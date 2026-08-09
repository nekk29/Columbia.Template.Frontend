import * as React from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layout/header/AppHeader";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
import { AppContent } from "@/components/layout/content/AppContent";
import { SidebarProvider } from "@/components/tailgrids/core/sidebar";
import { PermissionsProvider } from "@/core/auth/context/PermissionsProvider";

export default function AppLayout() {
  const [open, setOpen] = React.useState<boolean>(true);

  return (
    <div className="flex h-full w-full min-h-screen overflow-hidden bg-background-100">
      <PermissionsProvider>
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <AppSidebar open={open} />
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <AppContent>
              <Outlet />
            </AppContent>
          </div>
        </SidebarProvider>
      </PermissionsProvider>
    </div>
  );
}
