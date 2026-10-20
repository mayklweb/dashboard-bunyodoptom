// widgets/header/Header.tsx
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { NotificationIcon } from "@/assets/icons"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hydration mismatchning oldini olish uchun
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-10 w-full">
      <div className="flex w-full items-center gap-2 border-b border-border bg-header-bg p-2">
        <SidebarTrigger className="size-9 [&_svg]:size-5" />
        <div className="flex-1" />

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Mavzuni almashtirish"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )
          ) : (
            <Sun className="size-4" />
          )}
        </Button>

        <Button variant="outline" size="icon">
          <NotificationIcon />
        </Button>

        <Avatar>
          <AvatarImage src="" alt="User Avatar" />
          <AvatarFallback>B</AvatarFallback>
          <AvatarBadge className="bg-green-500" />
        </Avatar>
      </div>
    </header>
  )
}

export default Header