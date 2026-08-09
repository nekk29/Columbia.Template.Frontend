import { MenuHamburger1 } from "@tailgrids/icons";
import { LanguagePicker } from "@/components/shared/LanguagePicker";
import { SidebarTrigger } from "@/components/tailgrids/core/sidebar";
import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-2 border-b border-base-100 bg-background-100 px-4 transition-[width,height,padding] ease-linear">
      <SidebarTrigger className="p-0 border-0 mr-1">
        <MenuHamburger1 size={24} />
      </SidebarTrigger>

      <Breadcrumbs items={[{ label: "Home", href: "#" }]} dividerType="chevron" />

      <div className="ml-auto flex-shrink-0">
        <LanguagePicker />
      </div>
    </header>
  );
}
