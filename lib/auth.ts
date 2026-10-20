// lib/auth.ts
export type Role = "admin" | "manager" | "courier" | "warehouse"

export interface AuthUser {
  id?: number | string
  name?: string
  username?: string
  role?: unknown
  role_id?: number
  [key: string]: unknown
}

// Backend rol_id yuborsa, shu yerda moslang
const ROLE_BY_ID: Record<number, Role> = {
  1: "admin",
  2: "manager",
  3: "courier",
}

// Backend turlicha nom yuborishi mumkin, hammasini bitta rolga keltiramiz
const ROLE_ALIASES: Record<string, Role> = {
  admin: "admin",
  superadmin: "admin",
  manager: "manager",
  menejer: "manager",
  courier: "courier",
  driver: "courier",
  delivery: "courier",
  dastavshik: "courier",
  dostavchik: "courier",
  kuryer: "courier",
  warehouse: "warehouse",
  storekeeper: "warehouse",
  omborchi: "warehouse",
}

// user obyektidan rolni aniqlaydi: "admin" | {name:"admin"} | role_id
export function resolveRole(user: AuthUser | null | undefined): Role | null {
  if (!user) return null

  // Backend rolni turli maydonlarda yuborishi mumkin
  let raw: unknown =
    user.role ?? user.role_name ?? user.type ?? user.user_type ?? user.position
  if (raw && typeof raw === "object") {
    raw =
      (raw as { name?: string }).name ?? (raw as { slug?: string }).slug
  }
  if (typeof raw === "string") {
    return ROLE_ALIASES[raw.toLowerCase().trim()] ?? null
  }
  if (typeof user.role_id === "number") {
    return ROLE_BY_ID[user.role_id] ?? null
  }
  return null
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("user")
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}