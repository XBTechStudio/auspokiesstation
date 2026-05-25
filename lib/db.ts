import { getPool as getWildGroupPool, query as wildGroupQuery } from './db-wildgroup';
import { getPool as get88GroupPool, query as query88Group } from './db-88group';
import type { QueryResult } from 'mysql2';
import { unstable_cache } from 'next/cache';

export type DataSource = 'wildgroup' | '88group';

// Unified database access interface
export function getPool(source: DataSource) {
  if (source === 'wildgroup') {
    return getWildGroupPool();
  }
  return get88GroupPool();
}

// Cache duration: 1 hour (3600 seconds) for database queries
// Brand data, bonuses, and testimonials rarely change – 1 hour is a good balance
// Admin operations use the non-cached query() function so changes are immediate
const CACHE_DURATION = 3600; // 1 hour

// Unified query helper (non-cached version for admin/write operations)
export async function query(source: DataSource, sql: string, params?: any[]) {
  if (source === 'wildgroup') {
    return wildGroupQuery(sql, params);
  }
  return query88Group(sql, params);
}

// Cached query helper for read operations
export async function cachedQuery<T = any>(
  source: DataSource,
  sql: string,
  params?: any[],
  cacheKey?: string,
  revalidate: number = CACHE_DURATION
): Promise<T> {
  // Create a unique cache key based on source, SQL, and params
  const key = cacheKey || `db-${source}-${sql}-${JSON.stringify(params || [])}`;
  
  return unstable_cache(
    async () => {
      if (source === 'wildgroup') {
        return wildGroupQuery(sql, params) as Promise<T>;
      }
      return query88Group(sql, params) as Promise<T>;
    },
    [key],
    {
      revalidate,
      tags: [`db-${source}`], // Allow cache invalidation by source
    }
  )();
}

// Helper to add source field to results
export function addSourceField<T>(data: T[], source: DataSource): (T & { source: DataSource })[] {
  return data.map(item => ({ ...item, source }));
}

// Query both databases and merge results
async function executeWithSource<T>(
  source: DataSource,
  executor: Promise<QueryResult>
): Promise<(T & { source: DataSource })[]> {
  try {
    const data = await executor;
    // Check if result is an array (RowDataPacket[])
    if (Array.isArray(data)) {
      // Ensure array is not empty and has valid row data
      if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
        return addSourceField(data as T[], source);
      }
      // Empty array is valid for SELECT queries with no results
      return [] as (T & { source: DataSource })[];
    }
    // For non-array results (ResultSetHeader, OkPacket), return empty array
    return [] as (T & { source: DataSource })[];
  } catch (error: any) {
    if (error?.code === 'ER_NO_SUCH_TABLE') {
      console.warn(`Table not found in ${source} database:`, error.message);
      return [] as (T & { source: DataSource })[];
    }
    console.error(`Error querying ${source} database:`, error);
    throw error;
  }
}

// Non-cached version of queryBoth (for admin/write operations)
export async function queryBoth<T>(
  sql: string,
  params?: any[]
): Promise<(T & { source: DataSource })[]> {
  const [wildGroupResults, group88Results] = await Promise.allSettled([
    executeWithSource<T>('wildgroup', wildGroupQuery(sql, params)),
    executeWithSource<T>('88group', query88Group(sql, params)),
  ]);

  const wildGroupData = wildGroupResults.status === 'fulfilled' 
    ? wildGroupResults.value 
    : [] as (T & { source: DataSource })[];
  
  const group88Data = group88Results.status === 'fulfilled' 
    ? group88Results.value 
    : [] as (T & { source: DataSource })[];

  // Log errors if any occurred
  if (wildGroupResults.status === 'rejected') {
    console.error('WildGroup database query failed:', wildGroupResults.reason);
  }
  if (group88Results.status === 'rejected') {
    console.error('88Group database query failed:', group88Results.reason);
  }

  return [...wildGroupData, ...group88Data] as (T & { source: DataSource })[];
}

// Cached version of queryBoth for read operations
export async function cachedQueryBoth<T>(
  sql: string,
  params?: any[],
  cacheKey?: string,
  revalidate: number = CACHE_DURATION
): Promise<(T & { source: DataSource })[]> {
  const key = cacheKey || `db-both-${sql}-${JSON.stringify(params || [])}`;
  
  return unstable_cache(
    async () => {
      const [wildGroupResults, group88Results] = await Promise.allSettled([
        executeWithSource<T>('wildgroup', wildGroupQuery(sql, params)),
        executeWithSource<T>('88group', query88Group(sql, params)),
      ]);

      const wildGroupData = wildGroupResults.status === 'fulfilled' 
        ? wildGroupResults.value 
        : [] as (T & { source: DataSource })[];
      
      const group88Data = group88Results.status === 'fulfilled' 
        ? group88Results.value 
        : [] as (T & { source: DataSource })[];

      // Log errors if any occurred
      if (wildGroupResults.status === 'rejected') {
        console.error('WildGroup database query failed:', wildGroupResults.reason);
      }
      if (group88Results.status === 'rejected') {
        console.error('88Group database query failed:', group88Results.reason);
      }

      return [...wildGroupData, ...group88Data] as (T & { source: DataSource })[];
    },
    [key],
    {
      revalidate,
      tags: ['db-both', 'db-wildgroup', 'db-88group'],
    }
  )();
}
