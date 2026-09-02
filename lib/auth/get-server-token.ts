// lib/auth/get-server-token.ts
import "server-only"
import { cookies } from "next/headers"

export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value
}