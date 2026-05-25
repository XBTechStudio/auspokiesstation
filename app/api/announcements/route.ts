import { NextResponse } from 'next/server';
import { cachedQueryBoth } from '@/lib/db';
import { query as queryLocal } from '@/lib/db-local';
import { convertImagePath } from '@/lib/image-utils';
import { cachedJsonResponse } from '@/lib/cache-utils';

export const revalidate = 3600;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // This route uses request.url, so it must be dynamic

// GET - Fetch all announcements (local database first, then external databases)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const importantOnly = searchParams.get('important') === 'true';

    let sql = 'SELECT id, title, content, category, image, is_important, created_at FROM announcements WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (importantOnly) {
      sql += ' AND is_important = TRUE';
    }

    sql += ' ORDER BY is_important DESC, created_at DESC LIMIT 50';

    // First try to get from local database
    let localAnnouncements: any[] = [];
    try {
      localAnnouncements = await queryLocal(sql, params.length > 0 ? params : undefined) as any[];
      localAnnouncements = localAnnouncements.map((item: any) => ({ ...item, source: 'local' }));
    } catch (error) {
      console.log('Local announcements not available, using external databases');
    }

    // Then get from external databases (cached)
    const cacheKey = `announcements-${category || 'all'}-${importantOnly ? 'important' : 'all'}`;
    const externalAnnouncements = await cachedQueryBoth(sql, params.length > 0 ? params : undefined, cacheKey, 3600);

    // Combine: local first, then external
    const announcements = [...localAnnouncements, ...externalAnnouncements];

    // Normalize the response format and convert image paths
    const normalized = announcements.map((announcement: any) => ({
      id: announcement.id?.toString() || announcement.id,
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      image: convertImagePath(announcement.image, announcement.source),
      isImportant: announcement.is_important === 1 || announcement.is_important === true,
      is_important: announcement.is_important === 1 || announcement.is_important === true,
      date: announcement.created_at ? new Date(announcement.created_at).toISOString().split('T')[0] : undefined,
      created_at: announcement.created_at ? new Date(announcement.created_at).toISOString() : undefined,
      source: announcement.source,
    }));

    // Sort by date descending
    normalized.sort((a: any, b: any) => {
      const dateA = a.created_at || a.date;
      const dateB = b.created_at || b.date;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Cache for 6 hours, stale-while-revalidate for 12 hours
    return cachedJsonResponse(normalized);
  } catch (error: any) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}
