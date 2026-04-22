/** Vite `base` (예: `/`, `/somi_beauty/`) + public 이하 경로 */
export function assetUrl(absolutePath) {
  const p = absolutePath.startsWith("/") ? absolutePath.slice(1) : absolutePath;
  return `${import.meta.env.BASE_URL}${p}`;
}
