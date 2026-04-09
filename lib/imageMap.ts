/**
 * Maps Wix (static.wixstatic.com) image URLs to local paths.
 * Scraper filenames: domain + path with / and ~ replaced by _
 * e.g. https://static.wixstatic.com/media/51d5cc_dfd6534550a14e14af0cc44b5a2c7825~mv2.png
 *   -> static.wixstatic.com_media_51d5cc_dfd6534550a14e14af0cc44b5a2c7825_mv2.png
 */

const IMAGE_BASE = "/images";

/**
 * Convert a Wix image URL to the local path.
 * Handles: static.wixstatic.com/media URLs; strips query params and /v1/fill/ paths.
 */
export function getImageUrl(wixUrl: string): string {
  try {
    // Strip query params and fragments
    let url = wixUrl.split("?")[0].split("#")[0];
    try {
      url = decodeURIComponent(url);
    } catch {
      // ignore
    }
    // Match static.wixstatic.com/media/... (may have /v1/fill/... after)
    const match = url.match(/static\.wixstatic\.com\/media\/([^/]+)/);
    if (!match) return wixUrl;
    const pathPart = match[1];
    // Build local filename: static.wixstatic.com_media_ + path with ~ and %7E -> _
    const normalized = pathPart.replace(/^\//, "").replace(/~/g, "_").replace(/%7E/gi, "_");
    const baseName = "static.wixstatic.com_media_" + normalized;
    return `${IMAGE_BASE}/${baseName}`;
  } catch {
    return wixUrl;
  }
}

/**
 * Get the local filename (no leading /images/) for a Wix URL.
 */
export function getImageFilename(wixUrl: string): string {
  const full = getImageUrl(wixUrl);
  return full.replace(IMAGE_BASE + "/", "");
}
