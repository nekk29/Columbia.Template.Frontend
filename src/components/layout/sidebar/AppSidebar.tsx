import { Sidebar } from "@/components/tailgrids/core/sidebar";
import { AppSidebarHeader } from "@/components/layout/sidebar/AppSidebarHeader";
import { AppSidebarFooter } from "@/components/layout/sidebar/AppSidebarFooter";
import { AppSidebarContent } from "@/components/layout/sidebar/AppSidebarContent";

export function AppSidebar({ open }: { open: boolean }) {
  return (
    <Sidebar collapsible="icon" showSheetCloseButton={false} className="h-full" >
      <AppSidebarHeader open={open} />
      <AppSidebarContent />
      <AppSidebarFooter open={open} />
    </Sidebar>
  );
}
