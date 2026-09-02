"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")

    if (token) {
      // Redirect to dashboard if already logged in
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  )
}
