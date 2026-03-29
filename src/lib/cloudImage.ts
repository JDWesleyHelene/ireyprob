/**
 * Add Cloudinary transformations for auto quality + format + size.
 * Reduces image sizes by 60-80% with no visible quality loss.
 */
export function cloudImg(url: string, opts: { w?: number; h?: number; q?: number } = {}): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  
  const { w = 1200, q = 80 } = opts;
  
  // Insert transforms after /upload/
  const transforms = [
    "f_auto",        // auto format (WebP/AVIF for modern browsers)
    "q_auto",        // auto quality
    `w_${w}`,        // max width
    "c_limit",       // don't upscale
  ].join(",");

  return url.replace("/upload/", `/upload/${transforms}/`);
}
