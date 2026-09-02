// lib/utils/get-image-url.ts
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (path.startsWith("blob:")) return path

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""
  return `${baseUrl}${path}`
}