import { getStoredUser, logout as clearSession } from "@/lib/auth"

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const getUser = getStoredUser

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    clearSession()
    // Reload to clear cached data from the previous session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/login'
  }
}