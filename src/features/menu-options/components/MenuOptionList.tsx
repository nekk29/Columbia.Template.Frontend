import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";

import * as Icons from "@tailgrids/icons";
import { Label, TextField } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { NestedTree } from "@/components/shared/NestedTree";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger
} from "@/components/tailgrids/core/select";
import { Buildings11, Plus, Pencil1, Trash1, Layout6 } from "@tailgrids/icons";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { exportToExcel } from "@/utils/exportToExcel";
import { useListApplications } from "@/features/applications/hooks/applicationsHooks";
import { useDeleteMenuOption, useListAllMenuOptions } from "@/features/menu-options/hooks/menuOptionsHooks";
import { MenuOptionForm } from "@/features/menu-options/components/MenuOptionForm";

import type { TableColumn } from "@/models/shared/TableColumn";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { GetMenuOptionModel } from "@/features/menu-options/models/getMenuOptionModel";

interface DynamicIconProps {
  menuIcon: string;
}

export default function MenuOptionList() {
  const { t: translate } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.MENU_OPTIONS);

  const {
    openToasts,
    openErrorToast,
    openSuccessToast,
    openWarningToast,
    openConfirmationDialog
  } = useDialogs();

  const { data: applicationsResponse } = useListApplications();
  const { data: applications } = applicationsResponse ?? { data: [] };

  const [applicationId, setApplicationId] = useState<string>('');
  const selectedApplication = (applications ?? []).find((a) => a.id === applicationId);

  const [parentMenuOptionId, setParentMenuOptionId] = useState<string | null>(null);

  const { data: menuOptionsResponse, isLoading, refetch } = useListAllMenuOptions(selectedApplication?.code ?? '');
  const { data: menuOptions } = menuOptionsResponse ?? { data: [] };

  const MenuIcon: React.FC<DynamicIconProps> = ({ menuIcon }: { menuIcon: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[menuIcon];

    if (!IconComponent) {
      console.warn(`Icon "${name}" does not exist in @tailgrids/icons`);
      return null;
    }

    return <IconComponent />;
  };

  const { mutate: deleteRecord } = useDeleteMenuOption({
    onSuccess: (response: ResponseBaseDto) => {
      openToasts(response);
      if (response.isValid) { refetch(); }
    },
    onError: (error) => {
      openErrorToast("Operation failed");
      console.error(error);
    }
  });

  const [formState, setFormState] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const onNew = (parentMenuOptionId: string | null): void => {
    setParentMenuOptionId(parentMenuOptionId);
    setFormState({ isOpen: true, id: null });
  };

  const onEdit = (item: GetMenuOptionModel): void => {
    setFormState({ isOpen: true, id: item.id });
  };

  const onDelete = (item: GetMenuOptionModel): void => {
    openConfirmationDialog({
      data: item.id,
      title: translate('COMMON.MESSAGES.DELETE.TITLE'),
      description: translate('COMMON.MESSAGES.DELETE.QUESTION'),
      onYes: (id: string) => { deleteRecord(id); }
    });
  };

  const exportColumns: TableColumn<GetMenuOptionModel>[] = [
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION'), exportFields: new Map([["applicationName", translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.MODULE'), exportFields: new Map([["moduleName", translate('MENU_OPTIONS.COMMON.FIELDS.MODULE')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.ACTION'), exportFields: new Map([["actionName", translate('MENU_OPTIONS.COMMON.FIELDS.ACTION')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.PARENT'), exportFields: new Map([["parentName", translate('MENU_OPTIONS.COMMON.FIELDS.PARENT')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.CODE'), exportFields: new Map([["code", translate('MENU_OPTIONS.COMMON.FIELDS.CODE')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.NAME'), exportFields: new Map([["name", translate('MENU_OPTIONS.COMMON.FIELDS.NAME')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.MENU_URI'), exportFields: new Map([["menuUri", translate('MENU_OPTIONS.COMMON.FIELDS.MENU_URI')]]), render: () => null },
    { header: translate('MENU_OPTIONS.COMMON.FIELDS.SORT_ORDER'), exportFields: new Map([["sortOrder", translate('MENU_OPTIONS.COMMON.FIELDS.SORT_ORDER')]]), render: () => null },
    { header: translate('COMMON.FIELDS.STATUS'), exportFields: new Map([["isActive", translate('COMMON.FIELDS.STATUS')]]), render: () => null },
  ];

  const onExport = (): void => {
    const exportItems = menuOptions ?? [];
    if (exportItems.length === 0) {
      openWarningToast(translate("COMMON.MESSAGES.EXPORT.NO_RECORDS"));
      return;
    }

    exportToExcel({
      items: exportItems,
      columns: exportColumns,
      fileName: 'MenuOptions',
      sheetName: 'MenuOptions',
      translate: translate,
      onSuccess: () => {
        openSuccessToast(translate("COMMON.MESSAGES.EXPORT.SUCCESS"));
      }
    });
  };

  return (
    <>
      <AppCard className="mb-6">
        <AppCardHeader title={translate('MENU_OPTIONS.SEARCH.TITLE')} subTitle={translate('MENU_OPTIONS.SEARCH.SUB_TITLE')}>
          <div className="flex flex-wrap justify-end gap-2">
            <HasPermissions permissions={[PERMISSIONS.CREATE]}>
              <Button size="xs" variant="primary" onClick={() => onNew(null)} disabled={!applicationId}>
                <Plus />
                {translate('COMMON.ACTIONS.NEW')}
              </Button>
            </HasPermissions>
            <HasPermissions permissions={[PERMISSIONS.EXPORT]}>
              <Button size="xs" variant="success" onClick={onExport}>
                <Layout6 />
                {translate('COMMON.ACTIONS.EXPORT')}
              </Button>
            </HasPermissions>
          </div>
        </AppCardHeader>
        <AppCardBody>
          <TextField className="flex items-center gap-4 sm:w-1/4">
            <Label className="sm:text-sm/4 whitespace-nowrap">
              {translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION')}
            </Label>
            <Select
              aria-label={translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION')}
              value={applicationId}
              onChange={(value) => setApplicationId(value?.toString() ?? '')}>
              <SelectTrigger>
                <Buildings11 className="size-4.5 mr-1" />
                <span className="truncate">
                  {(applications ?? []).find((a) => a.id === applicationId)?.name
                    ?? translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION') })}
                </span>
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                {(applications ?? []).map((a) => (
                  <SelectItem key={a.id} id={a.id} textValue={a.name}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TextField>
        </AppCardBody>
      </AppCard>

      {!applicationId &&
        <div className="rounded-xl border border-base-100 bg-background-100 p-6 text-sm text-text-100">
          {translate('MENU_OPTIONS.SEARCH.NO_APPLICATION_SELECTED')}
        </div>
      }

      {applicationId && !isLoading && (menuOptions ?? []).length === 0 &&
        <div className="rounded-xl border border-base-100 bg-background-100 p-6 text-sm text-text-100">
          {translate('MENU_OPTIONS.SEARCH.NO_MENU_OPTIONS')}
        </div>
      }

      {applicationId && (menuOptions ?? []).length > 0 &&
        <div className="w-full overflow-clip rounded-xl border border-base-100 bg-background-100 p-5">
          <NestedTree<GetMenuOptionModel>
            items={menuOptions ?? []}
            getId={(item) => item.id}
            getParentId={(item) => item.parentMenuOptionId}
            renderNode={(item) => (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MenuIcon menuIcon={item.menuIcon} />
                  <div>
                    <div className="text-sm text-title-50">{item.name} <span className="text-xs text-text-100">({item.code})</span></div>
                    {item.menuUri && <div className="text-xs text-text-100">{item.menuUri}</div>}
                  </div>
                  <StatusBadge isActive={item.isActive} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <HasPermissions permissions={[PERMISSIONS.CREATE]}>
                    <Button size="xs" variant="success" iconOnly onClick={() => onNew(item.id)}>
                      <Plus />
                    </Button>
                  </HasPermissions>
                  <HasPermissions permissions={[PERMISSIONS.EDIT]}>
                    <Button size="xs" variant="primary" iconOnly onClick={() => onEdit(item)}>
                      <Pencil1 />
                    </Button>
                  </HasPermissions>
                  <HasPermissions permissions={[PERMISSIONS.DELETE]}>
                    <Button size="xs" variant="danger" iconOnly disabled={!item.isActive} onClick={() => onDelete(item)}>
                      <Trash1 />
                    </Button>
                  </HasPermissions>
                </div>
              </div>
            )}
          />
        </div>
      }

      <MenuOptionForm
        isOpen={formState.isOpen}
        id={formState.id}
        applicationId={applicationId}
        parentMenuOptionId={parentMenuOptionId}
        setIsOpen={(isOpen) => setFormState((prev) => ({ ...prev, isOpen }))}
        onSuccess={() => refetch()}
      />
    </>
  );
}
