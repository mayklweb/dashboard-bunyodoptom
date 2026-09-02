// widgets/sidebar/SidebarContext.tsx
"use client"

import { createContext, useContext, useState } from "react"

interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, toggle: () => setOpen((prev) => !prev) }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarState() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarState SidebarProvider ichida ishlatilishi kerak")
  }
  return context
}