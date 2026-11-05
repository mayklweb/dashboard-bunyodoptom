export function authHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }
  return headers
}
