/**
 * In-memory LRU cache with TTL support
 * Used to cache image binary data and reduce traffic to source servers
 * 
 * Features:
 * - LRU eviction when max entries exceeded
 * - TTL-based expiration
 * - Max memory size limit
 * - Request deduplication (coalescing)
 */

interface CacheEntry<T> {
  data: T;
  size: number;
  createdAt: number;
  lastAccessed: number;
}

interface CacheOptions {
  /** Max number of entries (default: 500) */
  maxEntries?: number;
  /** TTL in milliseconds (default: 24 hours) */
  ttlMs?: number;
  /** Max total memory in bytes (default: 256MB) */
  maxMemoryBytes?: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxEntries: number;
  private ttlMs: number;
  private maxMemoryBytes: number;
  private currentMemoryBytes = 0;

  constructor(options: CacheOptions = {}) {
    this.maxEntries = options.maxEntries ?? 500;
    this.ttlMs = options.ttlMs ?? 24 * 60 * 60 * 1000; // 24 hours
    this.maxMemoryBytes = options.maxMemoryBytes ?? 256 * 1024 * 1024; // 256MB
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.delete(key);
      return null;
    }

    // Update last accessed (LRU)
    entry.lastAccessed = Date.now();
    // Move to end (most recently used) by re-inserting
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  set(key: string, data: T, sizeBytes: number): void {
    // Remove existing entry first if present
    if (this.cache.has(key)) {
      this.delete(key);
    }

    // Don't cache if single item exceeds 10% of max memory
    if (sizeBytes > this.maxMemoryBytes * 0.1) {
      return;
    }

    // Evict until we have space
    while (
      (this.cache.size >= this.maxEntries || this.currentMemoryBytes + sizeBytes > this.maxMemoryBytes) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      size: sizeBytes,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
    });
    this.currentMemoryBytes += sizeBytes;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentMemoryBytes -= entry.size;
      this.cache.delete(key);
    }
  }

  private evictLRU(): void {
    // Map iteration order is insertion order, first entry is the LRU
    const firstKey = this.cache.keys().next().value;
    if (firstKey !== undefined) {
      this.delete(firstKey);
    }
  }

  get size(): number {
    return this.cache.size;
  }

  get memoryUsageBytes(): number {
    return this.currentMemoryBytes;
  }

  /** Clean up expired entries */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.createdAt > this.ttlMs) {
        this.delete(key);
      }
    }
  }

  getStats(): { entries: number; memoryMB: number; maxEntries: number; maxMemoryMB: number } {
    return {
      entries: this.cache.size,
      memoryMB: Math.round(this.currentMemoryBytes / 1024 / 1024 * 100) / 100,
      maxEntries: this.maxEntries,
      maxMemoryMB: Math.round(this.maxMemoryBytes / 1024 / 1024),
    };
  }
}

/**
 * Request deduplication / coalescing
 * When multiple requests come in for the same resource simultaneously,
 * only one actual fetch is performed and the result is shared.
 */
const inflightRequests = new Map<string, Promise<any>>();

export async function deduplicatedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // If there's already an inflight request for this key, wait for it
  const existing = inflightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  // Create the request and store it
  const promise = fetcher().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, promise);
  return promise;
}

/**
 * Simple rate limiter using sliding window
 */
interface RateLimitEntry {
  count: number;
  windowStart: number;
}

export class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 60, windowMs: number = 60_000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60_000).unref();
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now - entry.windowStart > this.windowMs) {
      this.limits.set(key, { count: 1, windowStart: now });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits) {
      if (now - entry.windowStart > this.windowMs) {
        this.limits.delete(key);
      }
    }
  }
}

// ── Singleton instances ──

/** Image cache: 500 entries, 24h TTL, 256MB max */
export const imageCache = new MemoryCache<{ buffer: Buffer; contentType: string }>({
  maxEntries: 500,
  ttlMs: 24 * 60 * 60 * 1000,
  maxMemoryBytes: 256 * 1024 * 1024,
});

/** Rate limiter: 30 requests per minute per IP */
export const proxyRateLimiter = new RateLimiter(30, 60_000);

// Clean up expired image cache entries every 10 minutes
setInterval(() => imageCache.cleanup(), 10 * 60 * 1000).unref();
