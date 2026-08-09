import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { environment } from "@/environments/environment";
import companyIcon from "@/assets/images/icons/company.png";

import {
  DropdownMenu,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";

import {
  SidebarHeader
} from "@/components/tailgrids/core/sidebar";

export function AppSidebarHeader({ open }: { open: boolean; }) {
  const navigate = useNavigate();

  return (
    <SidebarHeader>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "w-full flex items-center rounded-md duration-200",
            open ? "p-2 justify-between" : "justify-start"
          )}
          onClick={() => { navigate('/home'); }}
        >
          <div className={cn("flex items-center", open && "gap-2")}>
            <img src={companyIcon} alt="Company" width={34} height={34} />
            {open && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {environment.application.companyName}
                </span>
                <span className="truncate text-xs text-text-100/70">
                  {environment.application.companyDescription}
                </span>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </SidebarHeader>
  );
}
