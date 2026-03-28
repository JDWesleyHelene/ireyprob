/**
 * Auto-converts WordPress image URLs to Cloudinary by matching filename.
 * Falls back to original URL if Cloudinary not configured.
 */

function getCloudName(): string {
  // Check all possible env var names
  if (typeof process !== "undefined") {
    return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
           process.env.CLOUDINARY_CLOUD_NAME || "";
  }
  return "";
}

export function toCloudUrl(url: string): string {
  if (!url) return url;
  if (!url.includes("ireyprod.com/wp-content")) return url;
  if (url.includes("res.cloudinary.com")) return url;

  const CLOUD = getCloudName() || "dvmhbtiz4"; // fallback to known cloud name
  if (!CLOUD) return url; // No cloud name — keep original WP URL working

  const filename  = url.split("/").pop() || "";
  const nameNoExt = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `https://res.cloudinary.com/${CLOUD}/image/upload/ireyprod/${nameNoExt}`;
}

export function rewriteUrls(text: string): string {
  if (!text || !text.includes("ireyprod.com/wp-content")) return text;
  return text.replace(
    /https:\/\/ireyprod\.com\/wp-content\/uploads\/[^\s"'\`}\]>]+/g,
    match => toCloudUrl(match)
  );
}
