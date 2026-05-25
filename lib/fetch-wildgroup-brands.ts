import { convertImagePaths } from '@/lib/image-utils';
import { query } from '@/lib/db';

const DEFAULT_WILDGROUP_API_URLS = [
  'https://wildgroupau.com/api/brands',
  'https://wildgroupau.co/api/brands',
  'https://wildgroup.vip/api/brands',
  'https://wildgrouppartnership.com/api/brands',
];

function getWildGroupApiUrls(): string[] {
  const fromEnv = process.env.WILDGROUP_BRANDS_API_URLS;
  if (fromEnv) {
    return fromEnv.split(',').map((url) => url.trim()).filter(Boolean);
  }
  return DEFAULT_WILDGROUP_API_URLS;
}

function normalizeWildGroupBrand(brand: Record<string, unknown>) {
  const normalized = {
    ...brand,
    source: 'wildgroup' as const,
    registerUrl_2:
      (brand.registerUrl_2 as string | null | undefined) ??
      (brand.register_url_2 as string | null | undefined) ??
      null,
  };
  return convertImagePaths(normalized, 'wildgroup', ['logo']);
}

async function fetchFromLiveWildGroupSites(): Promise<Record<string, unknown>[]> {
  let lastError: unknown;

  for (const url of getWildGroupApiUrls()) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        lastError = new Error(`${url} returned ${response.status}`);
        continue;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`WildGroup brands loaded from ${url} (${data.length} items)`);
        return data as Record<string, unknown>[];
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('Unable to fetch WildGroup brands from live sites');
}

async function fetchFromWildGroupDatabase(): Promise<Record<string, unknown>[]> {
  const sql =
    'SELECT * FROM brands WHERE is_active = TRUE ORDER BY display_order ASC, id ASC';
  const data = await query('wildgroup', sql);
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

/** Right-panel WildGroup cards: prefer live site APIs, fall back to shared DB. */
export async function fetchWildGroupBrands() {
  try {
    const liveBrands = await fetchFromLiveWildGroupSites();
    return liveBrands.map(normalizeWildGroupBrand);
  } catch (error) {
    console.warn('Live WildGroup API fetch failed, falling back to database:', error);
    const dbBrands = await fetchFromWildGroupDatabase();
    return dbBrands.map((brand) => normalizeWildGroupBrand({ ...brand, source: 'wildgroup' }));
  }
}
