/** Prefix public URLs once, while leaving external URLs and fragments intact. */
export function sitePath(path: string, baseURL = "/"): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = `/${baseURL.split("/").filter(Boolean).join("/")}`;
  if (base === "/" || path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}

export function siteUrl(path: string, origin: string, baseURL = "/"): string {
  return new URL(sitePath(path, baseURL), origin).href;
}
