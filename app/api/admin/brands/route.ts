import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch all brands from both databases
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Try to select registerUrl_2, but fallback if column doesn't exist yet
    const sqlWithRegisterUrl2 = 'SELECT id, `key`, name, registerUrl_2 FROM brands WHERE is_active = TRUE ORDER BY display_order ASC, id ASC';
    const sqlWithoutRegisterUrl2 = 'SELECT id, `key`, name FROM brands WHERE is_active = TRUE ORDER BY display_order ASC, id ASC';
    
    // Helper function to query with fallback
    const queryWithFallback = async (source: 'wildgroup' | '88group', sqlWith: string, sqlWithout: string) => {
      try {
        return await query(source, sqlWith);
      } catch (error: any) {
        // If registerUrl_2 column doesn't exist, try without it
        if (error.code === 'ER_BAD_FIELD_ERROR' || error.message?.includes('registerUrl_2') || error.message?.includes('Unknown column')) {
          console.warn(`registerUrl_2 column not found in ${source} database, querying without it`);
          const result = await query(source, sqlWithout);
          // Add null registerUrl_2 to all results
          return Array.isArray(result) ? result.map((b: any) => ({ ...b, registerUrl_2: null })) : result;
        }
        throw error;
      }
    };
    
    // Query both databases
    const [wildGroupBrands, group88Brands] = await Promise.allSettled([
      queryWithFallback('wildgroup', sqlWithRegisterUrl2, sqlWithoutRegisterUrl2),
      queryWithFallback('88group', sqlWithRegisterUrl2, sqlWithoutRegisterUrl2),
    ]);

    const brands: any[] = [];
    
    if (wildGroupBrands.status === 'fulfilled') {
      const data = wildGroupBrands.value as any[];
      brands.push(...data.map(b => ({ ...b, registerUrl_2: b.registerUrl_2 || null, source: 'wildgroup' })));
    } else {
      console.error('WildGroup brands query failed:', wildGroupBrands.reason);
    }
    
    if (group88Brands.status === 'fulfilled') {
      const data = group88Brands.value as any[];
      brands.push(...data.map(b => ({ ...b, registerUrl_2: b.registerUrl_2 || null, source: '88group' })));
    } else {
      console.error('88Group brands query failed:', group88Brands.reason);
    }

    return NextResponse.json(brands);
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

// PUT - Update registerUrl_2 for a brand
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, source, registerUrl_2 } = body;

    if (!id || !source || registerUrl_2 === undefined) {
      return NextResponse.json({ error: 'Missing required fields: id, source, registerUrl_2' }, { status: 400 });
    }

    if (source !== 'wildgroup' && source !== '88group') {
      return NextResponse.json({ error: 'Invalid source. Must be "wildgroup" or "88group"' }, { status: 400 });
    }

    const sql = 'UPDATE brands SET registerUrl_2 = ? WHERE id = ?';
    
    await query(source as 'wildgroup' | '88group', sql, [registerUrl_2 || null, id]);

    revalidateTag(`db-${source}`, { expire: 0 });

    return NextResponse.json({ success: true, message: 'Brand updated successfully' });
  } catch (error: any) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}
