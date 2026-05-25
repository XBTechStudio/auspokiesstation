import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-local';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch all announcements
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = 'SELECT * FROM announcements';
    const params: any[] = [];

    if (category) {
      sql += ' WHERE category = ?';
      params.push(category);
    }

    sql += ' ORDER BY is_important DESC, created_at DESC';

    const rows = await query(sql, params.length > 0 ? params : undefined) as any[];

    // Convert is_important to boolean
    const announcements = rows.map((row: any) => ({
      ...row,
      is_important: row.is_important === 1 || row.is_important === true,
    }));

    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, image, is_important } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO announcements (title, content, category, image, is_important)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title,
        content,
        category,
        image || null,
        is_important !== undefined ? is_important : false,
      ]
    ) as any;

    return NextResponse.json({ id: result.insertId, message: 'Announcement created successfully' });
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
