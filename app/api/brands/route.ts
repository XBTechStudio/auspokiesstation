import { query } from '@/lib/db';
import { convertImagePaths } from '@/lib/image-utils';
import { noStoreJsonResponse } from '@/lib/cache-utils';
import { fetchWildGroupBrands } from '@/lib/fetch-wildgroup-brands';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - WildGroup cards from live sites; 88Group cards from database
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

    const brands = [...wildGroupBrands, ...group88Brands];
    console.log(
      `Fetched ${brands.length} brands (${wildGroupBrands.length} wildgroup live, ${group88Brands.length} 88group db)`
    );

    return noStoreJsonResponse(brands);
  } catch (error: unknown) {
    console.error('Error fetching brands:', error);
    return noStoreJsonResponse([], 200);
  }
}
