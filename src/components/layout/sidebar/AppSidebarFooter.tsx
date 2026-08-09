import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserInfo } from "@/features/users/hooks/usersHooks";
import { AuthService } from "@/core/auth/services/auth.service";

import {
  ChevronBothDirection,
  User2
} from "@tailgrids/icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";

import {
  SidebarFooter
} from "@/components/tailgrids/core/sidebar";

export function AppSidebarFooter({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const { data } = useUserInfo();
  const { t: translate } = useTranslation();

  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "w-full flex items-center rounded-md duration-200 hover:bg-background-soft-50 focus-visible:bg-background-soft-50 aria-expanded:bg-background-soft-100",
            open ? "p-2 justify-between" : "size-8 p-0 justify-center"
          )} >

          <div className={cn("flex items-center", open && "gap-2")}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <User2 className="size-4" />
            </div>

            {open && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-text-100">
                  {data?.nickname}
                </span>
                <span className="truncate text-xs text-text-100/70">
                  {data?.email}
                </span>
              </div>
            )}
          </div>

          {open && (
            <ChevronBothDirection className="ml-auto size-4 text-text-100/50" />
          )}

        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--sidebar-width) min-w-56 p-1.5 border"
          placement="end top"
          offset={6}
        >
          <DropdownMenuHeader className="flex items-center gap-2 p-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <User2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{data?.nickname}</span>
              <span className="truncate text-xs text-text-100/70">
                {data?.email}
              </span>
            </div>
          </DropdownMenuHeader>

          <DropdownMenuSeparator className="my-0.5" />

          <DropdownMenuItem onClick={() => {
            navigate('/users/profile');
          }}>
            {translate('USERS.ACCOUNT.PROFILE')}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            AuthService.logout();
            navigate('/user/login');
            ;
          }}>
            {translate('USERS.ACCOUNT.LOGOUT')}
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
