export default function resolveImageUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const origin = import.meta.env.VITE_API_ORIGIN || ''
  return origin ? `${origin}${url.startsWith('/') ? url : '/' + url}` : url
}
