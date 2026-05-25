import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { convertImagePaths } from '@/lib/image-utils';
import { noStoreJsonResponse } from '@/lib/cache-utils';
import { fetchWildGroupBrands } from '@/lib/fetch-wildgroup-brands';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch brands separately for split layout
export async function GET() {
  try {
    const sql =
      'SELECT * FROM brands WHERE is_active = TRUE ORDER BY display_order ASC, id ASC';

    const [wildGroupBrands, group88Brands] = await Promise.all([
      fetchWildGroupBrands(),
      query('88group', sql).then((data) => {
        const rows = (Array.isArray(data) ? data : []) as any[];
        return rows.map((item) => {
          const brand = convertImagePaths(
            { ...item, source: '88group' },
            '88group',
            ['logo']
          );
          return {
            ...brand,
            registerUrl_2: brand.registerUrl_2 || null,
          };
        });
      }),
    ]);

    return noStoreJsonResponse({
      wildgroup: wildGroupBrands,
      '88group': group88Brands,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch brands';
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
