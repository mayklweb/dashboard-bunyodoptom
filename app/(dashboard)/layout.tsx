// app/(dashboard)/layout.tsx
import Header from "../widgets/header/Header"
import { AppSidebar } from "../widgets/sidebar/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <div className="flex w-full flex-col overflow-y-auto">
            <Header />
            <main className="flex-1 bg-background p-5">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}