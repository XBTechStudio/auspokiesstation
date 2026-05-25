import { NextResponse } from 'next/server';

/**
 * Cache utility functions for API responses
 */

/**
 * Add cache headers to API response
 * @param response NextResponse object
 * @param maxAge Cache duration in seconds (default: 21600 = 6 hours)
 * @param staleWhileRevalidate Stale-while-revalidate duration in seconds (default: 43200 = 12 hours)
 */
export function addCacheHeaders(
  response: NextResponse,
  maxAge: number = 21600,
  staleWhileRevalidate: number = 43200
): NextResponse {
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}, max-age=${maxAge}`
  );
  response.headers.set('Vary', 'Accept');
  return response;
}

/**
 * Create a cached JSON response
 */
export function cachedJsonResponse(
  data: any,
  maxAge: number = 21600,
  staleWhileRevalidate: number = 43200
): NextResponse {
  const response = NextResponse.json(data);
  return addCacheHeaders(response, maxAge, staleWhileRevalidate);
}

/** JSON for data that must not stick in the browser on F5 (e.g. brand register links after admin edits). Server may still use unstable_cache + revalidateTag. */
export function noStoreJsonResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  response.headers.set(
    'Cache-Control',
    'private, no-store, max-age=0, must-revalidate'
  );
  response.headers.set('Vary', 'Accept');
  return response;
}
