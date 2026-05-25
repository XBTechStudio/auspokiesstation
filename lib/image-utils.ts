/**
 * Convert image paths to use proxy API for external domains
 * This reduces traffic on wildgroupau.com and 88groupau.com servers
 * wildgroup -> /api/proxy-image?url=https://wildgroupau.com/...
 * 88group -> /api/proxy-image?url=https://88groupau.com/...
 */

export function convertImagePath(path: string | null | undefined, source?: 'wildgroup' | '88group'): string | undefined {
  if (!path) return undefined;
  const trimmedPath = path.trim();
  if (!trimmedPath) return undefined;

  // Keep data URLs untouched (some logos are stored as base64 data:image/...).
  // Remove whitespace/newlines to prevent invalid base64 rendering in <img src>.
  if (trimmedPath.startsWith('data:image/')) {
    return trimmedPath.replace(/\s+/g, '');
  }
  
  // If already a full URL from wildgroupau.com or 88groupau.com, convert to proxy
  if (trimmedPath.startsWith('https://wildgroupau.com') || trimmedPath.startsWith('https://88groupau.com')) {
    // Use proxy API to reduce traffic on source servers
    return `/api/proxy-image?url=${encodeURIComponent(trimmedPath)}`;
  }
  
  // If already a full URL from other domains, return as is (don't proxy)
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }
  
  // Determine base URL based on source
  let baseUrl = '';
  if (source === 'wildgroup') {
    baseUrl = 'https://wildgroupau.com';
  } else if (source === '88group') {
    baseUrl = 'https://88groupau.com';
  }
  
  // If no source specified or no baseUrl, return original path
  if (!baseUrl) {
    return trimmedPath;
  }
  
  // Handle different path formats
  // If path starts with /, keep it (e.g., /uploads/image.jpg)
  // If path doesn't start with /, add it (e.g., uploads/image.jpg -> /uploads/image.jpg)
  const cleanPath = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
  
  // Combine base URL with path and proxy through our API
  const fullUrl = `${baseUrl}${cleanPath}`;
  return `/api/proxy-image?url=${encodeURIComponent(fullUrl)}`;
}

/**
 * Convert multiple image paths in an object
 */
export function convertImagePaths<T extends Record<string, any>>(
  data: T,
  source?: 'wildgroup' | '88group',
  imageFields: string[] = ['logo', 'image', 'thumbnail']
): T {
  const converted: any = { ...data };
  
  imageFields.forEach(field => {
    if (converted[field]) {
      converted[field] = convertImagePath(converted[field], source);
    }
  });
  
  return converted as T;
}

/**
 * Helper function to get proxy URL for hardcoded image URLs
 */
export function getProxyImageUrl(imageUrl: string): string {
  // If already using proxy, return as is
  if (imageUrl.startsWith('/api/proxy-image')) {
    return imageUrl;
  }
  
  // If it's from wildgroupau.com or 88groupau.com, proxy it
  if (imageUrl.startsWith('https://wildgroupau.com') || imageUrl.startsWith('https://88groupau.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  }
  
  // Otherwise return as is
  return imageUrl;
}
