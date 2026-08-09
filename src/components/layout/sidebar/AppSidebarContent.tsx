import React from "react";
import * as Icons from "@tailgrids/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { environment } from "@/environments/environment";
import { useListTreeMenuOptions } from "@/features/menu-options/hooks/menuOptionsHooks";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/tailgrids/core/sidebar";

interface DynamicIconProps {
  menuIcon: string;
}

export function AppSidebarContent() {
  const navigate = useNavigate();

  const { t: translate } = useTranslation();

  const { data, error, isLoading, isError } = useListTreeMenuOptions(environment.application.code);

  const getTranslationKey = (code: string): string => {
    const translationKey = `MENUOPTIONS.${code}`.replaceAll('-', '_');
    return translationKey.toUpperCase();
  };

  const MenuIcon: React.FC<DynamicIconProps> = ({ menuIcon }: { menuIcon: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[menuIcon];

    if (!IconComponent) {
      console.warn(`Icon "${name}" does not exist in @tailgrids/icons`);
      return null;
    }

    return <IconComponent />;
  };

  return (
    <SidebarContent className={"px-4 group-data-[collapsible=icon]:px-2"}>
      <SidebarGroup>
        <SidebarGroupLabel>{translate('MODULES.SEARCH.TITLE')}</SidebarGroupLabel>
        <SidebarMenu>
          {isLoading && <div></div>}
          {isError && <div>Error: {error.message}</div>}
          {(data?.data ?? []).map(item => (
            <SidebarMenuItem key={item.actionCode}>
              <SidebarMenuButton
                slot="trigger"
                tooltip={translate(getTranslationKey(item.actionCode))}
                onClick={() => { navigate(item.menuUri); }}
              >
                <MenuIcon menuIcon={item.menuIcon} />
                <span className="group-data-[collapsible=icon]:hidden">
                  {translate(getTranslationKey(item.actionCode))}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
