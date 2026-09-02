// widgets/header/Header.tsx
"use client"

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
  return (
    <header className="sticky top-0 z-10 w-full">
      <div className="flex w-full items-center gap-2 border-b border-border bg-header-bg p-2">
        <SidebarTrigger />
        <div className="flex-1" />
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