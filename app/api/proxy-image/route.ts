import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import {
  imageCache,
  proxyRateLimiter,
  deduplicatedFetch,
} from '@/lib/memory-cache';

export const runtime = 'nodejs';

// ── Constants ──
const DISK_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (increased from 1 day)
const DISK_CACHE_DIR = path.join(os.tmpdir(), 'proxy-images-cache');
const ALLOWED_DOMAINS = ['wildgroupau.com', '88groupau.com'];

// CDN / browser cache: 1 year (images rarely change)
const CACHE_CONTROL = 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable';

// ── Helpers ──

function getDiskCacheKey(imageUrl: string): string {
  return crypto.createHash('sha256').update(imageUrl).digest('hex');
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[^\x00-\x7F]/g, '');
}

function getAllowedReferers(): string[] {
  return (process.env.PROXY_IMAGE_ALLOWLIST || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isRefererAllowed(referer: string | null, allowlist: string[]): boolean {
  if (allowlist.length === 0) return true;
  if (!referer) return false;
  try {
    const refUrl = new URL(referer);
    return allowlist.some((allowed) => {
      const normalized = allowed.replace(/^https?:\/\//, '');
      return refUrl.host === normalized || refUrl.hostname === normalized;
    });
  } catch {
    return false;
  }
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// ── Disk cache ──

async function readDiskCache(imageUrl: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const key = getDiskCacheKey(imageUrl);
  const filePath = path.join(DISK_CACHE_DIR, `${key}.bin`);
  const metaPath = path.join(DISK_CACHE_DIR, `${key}.json`);

  try {
    const [fileStat, metaStat] = await Promise.all([fs.stat(filePath), fs.stat(metaPath)]);
    const age = Date.now() - Math.min(fileStat.mtimeMs, metaStat.mtimeMs);
    if (age > DISK_CACHE_TTL_MS) {
      // Expired – clean up in background
      fs.unlink(filePath).catch(() => {});
      fs.unlink(metaPath).catch(() => {});
      return null;
    }

    const [buffer, metaRaw] = await Promise.all([fs.readFile(filePath), fs.readFile(metaPath, 'utf8')]);
    const meta = JSON.parse(metaRaw) as { contentType: string };
    return { buffer, contentType: meta.contentType };
  } catch {
    return null;
  }
}

async function writeDiskCache(imageUrl: string, buffer: Buffer, contentType: string): Promise<void> {
  const key = getDiskCacheKey(imageUrl);
  const filePath = path.join(DISK_CACHE_DIR, `${key}.bin`);
  const metaPath = path.join(DISK_CACHE_DIR, `${key}.json`);

  try {
    await fs.mkdir(DISK_CACHE_DIR, { recursive: true });
    await Promise.all([
      fs.writeFile(filePath, buffer),
      fs.writeFile(metaPath, JSON.stringify({ contentType })),
    ]);
  } catch {
    // Ignore write errors
  }
}

// ── Fetch from source (with deduplication) ──

async function fetchImageFromSource(imageUrl: string): Promise<{ buffer: Buffer; contentType: string }> {
  const url = new URL(imageUrl);

  if (!ALLOWED_DOMAINS.includes(url.hostname)) {
    throw new Error('Domain not allowed');
  }

  const imageResponse = await fetch(imageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PartnershipBot/1.0)',
    },
    next: { revalidate: 86400 },
    cache: 'force-cache',
  });

  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.status}`);
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const rawContentType = imageResponse.headers.get('content-type') || 'image/png';
  const contentType = sanitizeHeaderValue(rawContentType) || 'application/octet-stream';

  return { buffer, contentType };
}

/**
 * Resolve an image through 3-tier cache:
 *   1. In-memory LRU cache  (fastest, ~0ms)
 *   2. Disk cache            (fast, ~1-5ms)
 *   3. Source server fetch   (slow, ~100-1000ms) – deduplicated
 */
async function resolveImage(imageUrl: string): Promise<{ buffer: Buffer; contentType: string; cacheHit: string }> {
  // ── Tier 1: Memory cache ──
  const memoryCached = imageCache.get(imageUrl);
  if (memoryCached) {
    return { ...memoryCached, cacheHit: 'memory' };
  }

  // ── Tier 2: Disk cache ──
  const diskCached = await readDiskCache(imageUrl);
  if (diskCached) {
    // Promote to memory cache
    imageCache.set(imageUrl, diskCached, diskCached.buffer.length);
    return { ...diskCached, cacheHit: 'disk' };
  }

  // ── Tier 3: Fetch from source (deduplicated) ──
  const fetched = await deduplicatedFetch(`img:${imageUrl}`, () => fetchImageFromSource(imageUrl));

  // Store in both caches
  imageCache.set(imageUrl, fetched, fetched.buffer.length);
  writeDiskCache(imageUrl, fetched.buffer, fetched.contentType).catch(() => {});

  return { ...fetched, cacheHit: 'miss' };
}

// ── Route handler ──

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // ── Rate limiting ──
    const clientIP = getClientIP(request);
    if (!proxyRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: { 'Retry-After': '60' },
        }
      );
    }

    // ── Referer check ──
    const allowlist = getAllowedReferers();
    if (!isRefererAllowed(request.headers.get('referer'), allowlist)) {
      console.warn('[proxy-image] blocked referer', {
        url: imageUrl,
        referer: request.headers.get('referer') || 'none',
      });
      return NextResponse.json({ error: 'Referer not allowed' }, { status: 403 });
    }

    // ── Validate URL domain before doing anything ──
    try {
      const url = new URL(imageUrl);
      if (!ALLOWED_DOMAINS.includes(url.hostname)) {
        return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // ── Resolve image (3-tier cache) ──
    const { buffer, contentType, cacheHit } = await resolveImage(imageUrl);

    console.log('[proxy-image]', { url: imageUrl, cache: cacheHit, size: buffer.length });

    const body = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(buffer.length),
        'Cache-Control': CACHE_CONTROL,
        'X-Content-Type-Options': 'nosniff',
        'Vary': 'Accept',
        'X-Proxy-Cache': cacheHit,
      },
    });
  } catch (error: any) {
    console.error('[proxy-image] error:', error.message);

    if (error.message === 'Domain not allowed') {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    if (error.message?.includes('Failed to fetch image')) {
      const statusMatch = error.message.match(/\d+/);
      const status = statusMatch ? parseInt(statusMatch[0]) : 502;
      return NextResponse.json({ error: 'Failed to fetch image' }, { status });
    }

    return NextResponse.json({ error: error.message || 'Failed to proxy image' }, { status: 500 });
  }
}
