import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";

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
import { Buildings11, Plus, Minus, Pencil1, Trash1, Layout6 } from "@tailgrids/icons";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { exportToExcel } from "@/utils/exportToExcel";
import { useListApplications } from "@/features/applications/hooks/applicationsHooks";
import { useDeleteModule, useListModulesByApplication } from "@/features/modules/hooks/modulesHooks";
import { useDeleteAction } from "@/features/actions/hooks/actionsHooks";
import { ActionForm } from "@/features/actions/components/ActionForm";

import type { TableColumn } from "@/models/shared/TableColumn";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { GetActionModel } from "@/features/actions/models/GetActionModel";
import type { ListModuleModel } from "@/features/modules/models/ListModuleModel";

export default function ModuleList() {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const [searchParams] = useSearchParams();
  const { PERMISSIONS } = usePermissionsModule(MODULES.MODULES);

  const {
    openToasts,
    openErrorToast,
    openSuccessToast,
    openWarningToast,
    openConfirmationDialog
  } = useDialogs();

  const { data: applicationsResponse } = useListApplications();
  const { data: applications } = applicationsResponse ?? { data: [] };

  const [applicationId, setApplicationId] = useState<string>(searchParams.get('applicationId') ?? '');
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set());

  const { data: modulesResponse, isLoading, refetch } = useListModulesByApplication(applicationId);
  const { data: moduleList } = modulesResponse ?? { data: [] };

  const toggleModule = (moduleId: string): void => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const { mutate: deleteModuleRecord } = useDeleteModule({
    onSuccess: (response: ResponseBaseDto) => {
      openToasts(response);
      if (response.isValid) { refetch(); }
    },
    onError: (error) => {
      openErrorToast("Operation failed");
      console.error(error);
    }
  });

  const { mutate: deleteActionRecord } = useDeleteAction({
    onSuccess: (response: ResponseBaseDto) => {
      openToasts(response);
      if (response.isValid) { refetch(); }
    },
    onError: (error) => {
      openErrorToast("Operation failed");
      console.error(error);
    }
  });

  const [actionFormState, setActionFormState] = useState<{
    isOpen: boolean;
    id: string | null;
    moduleId: string;
    parentActionId: string | null;
  }>({ isOpen: false, id: null, moduleId: '', parentActionId: null });

  const onNewAction = (moduleId: string, parentActionId: string | null): void => {
    setActionFormState({ isOpen: true, id: null, moduleId, parentActionId });
  };

  const onEditAction = (action: GetActionModel): void => {
    setActionFormState({ isOpen: true, id: action.id, moduleId: action.moduleId, parentActionId: action.parentActionId });
  };

  const onDeleteAction = (action: GetActionModel): void => {
    openConfirmationDialog({
      data: action.id,
      title: translate('COMMON.MESSAGES.DELETE.TITLE'),
      description: translate('COMMON.MESSAGES.DELETE.QUESTION'),
      onYes: (id: string) => { deleteActionRecord(id); }
    });
  };

  const onNewModule = (): void => {
    navigate(`/modules/new${applicationId ? `?applicationId=${applicationId}` : ''}`);
  };

  const onEditModule = (module: ListModuleModel): void => {
    navigate(`/modules/edit/${module.id}`);
  };

  const onDeleteModule = (module: ListModuleModel): void => {
    openConfirmationDialog({
      data: module.id,
      title: translate('COMMON.MESSAGES.DELETE.TITLE'),
      description: translate('COMMON.MESSAGES.DELETE.QUESTION'),
      onYes: (id: string) => { deleteModuleRecord(id); }
    });
  };

  const moduleExportColumns: TableColumn<ListModuleModel>[] = [
    { header: translate('MODULES.COMMON.FIELDS.APPLICATION'), exportFields: new Map([["applicationName", translate('MODULES.COMMON.FIELDS.APPLICATION')]]), render: () => null },
    { header: translate('MODULES.COMMON.FIELDS.CODE'), exportFields: new Map([["code", translate('MODULES.COMMON.FIELDS.CODE')]]), render: () => null },
    { header: translate('MODULES.COMMON.FIELDS.NAME'), exportFields: new Map([["name", translate('MODULES.COMMON.FIELDS.NAME')]]), render: () => null },
    { header: translate('COMMON.FIELDS.STATUS'), exportFields: new Map([["isActive", translate('COMMON.FIELDS.STATUS')]]), render: () => null },
  ];

  const onExport = (): void => {
    const exportItems = moduleList ?? [];
    if (exportItems.length === 0) {
      openWarningToast(translate("COMMON.MESSAGES.EXPORT.NO_RECORDS"));
      return;
    }

    exportToExcel({
      items: exportItems,
      columns: moduleExportColumns,
      fileName: 'Modules',
      sheetName: 'Modules',
      translate: translate,
      onSuccess: () => {
        openSuccessToast(translate("COMMON.MESSAGES.EXPORT.SUCCESS"));
      }
    });
  };

  return (
    <>
      <AppCard className="mb-6">
        <AppCardHeader title={translate('MODULES.SEARCH.TITLE')} subTitle={translate('MODULES.SEARCH.SUB_TITLE')}>
          <div className="flex flex-wrap justify-end gap-2">
            <HasPermissions permissions={[PERMISSIONS.CREATE]}>
              <Button size="xs" variant="primary" onClick={onNewModule} disabled={!applicationId}>
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
              {translate('MODULES.COMMON.FIELDS.APPLICATION')}
            </Label>
            <Select
              aria-label={translate('MODULES.COMMON.FIELDS.APPLICATION')}
              value={applicationId}
              onChange={(value) => setApplicationId(value?.toString() ?? '')}>
              <SelectTrigger>
                <Buildings11 className="size-4.5 mr-1" />
                <span className="truncate">
                  {(applications ?? []).find((a) => a.id === applicationId)?.name
                    ?? translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MODULES.COMMON.FIELDS.APPLICATION') })}
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
          {translate('MODULES.SEARCH.NO_APPLICATION_SELECTED')}
        </div>
      }

      {applicationId && !isLoading && (moduleList ?? []).length === 0 &&
        <div className="rounded-xl border border-base-100 bg-background-100 p-6 text-sm text-text-100">
          {translate('MODULES.SEARCH.NO_MODULES')}
        </div>
      }

      {applicationId && (moduleList ?? []).length > 0 &&
        <div className="flex flex-col gap-3">
          {(moduleList ?? []).map((module) => {
            const isExpanded = expandedModuleIds.has(module.id);
            const hasActions = module.actions.length > 0;

            return (
              <div key={module.id} className="w-full overflow-clip rounded-xl border border-base-100 bg-background-100">
                <div className="flex flex-wrap items-center justify-between gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex size-6 shrink-0 items-center justify-center rounded border border-base-100 text-text-100"
                    >
                      {isExpanded ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </button>
                    <div>
                      <div className="font-medium text-title-50">{module.name} <span className="text-xs text-text-100">({module.code})</span></div>
                      {module.description && <div className="text-xs text-text-100">{module.description}</div>}
                    </div>
                    <StatusBadge isActive={module.isActive} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <HasPermissions permissions={[PERMISSIONS.CREATE_ACTIONS]}>
                      <Button size="xs" variant="success" onClick={() => onNewAction(module.id, null)}>
                        <Plus />
                        {translate('MODULES.ACTIONS.ADD')}
                      </Button>
                    </HasPermissions>
                    <HasPermissions permissions={[PERMISSIONS.EDIT]}>
                      <Button size="xs" variant="primary" iconOnly onClick={() => onEditModule(module)}>
                        <Pencil1 />
                      </Button>
                    </HasPermissions>
                    <HasPermissions permissions={[PERMISSIONS.DELETE]}>
                      <Button size="xs" variant="danger" iconOnly disabled={!module.isActive} onClick={() => onDeleteModule(module)}>
                        <Trash1 />
                      </Button>
                    </HasPermissions>
                  </div>
                </div>

                {isExpanded &&
                  <div className="border-t border-base-100 p-5">
                    <HasPermissions permissions={[PERMISSIONS.SEARCH_ACTIONS]}>
                      {!hasActions
                        ? <div className="text-sm text-text-100">{translate('MODULES.SEARCH.NO_ACTIONS')}</div>
                        : <NestedTree<GetActionModel>
                            items={module.actions}
                            getId={(action) => action.id}
                            getParentId={(action) => action.parentActionId}
                            renderNode={(action) => (
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <div className="text-sm text-title-50">{action.name} <span className="text-xs text-text-100">({action.code})</span></div>
                                  {action.description && <div className="text-xs text-text-100">{action.description}</div>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <HasPermissions permissions={[PERMISSIONS.CREATE_ACTIONS]}>
                                    <Button size="xs" variant="success" iconOnly onClick={() => onNewAction(module.id, action.id)}>
                                      <Plus />
                                    </Button>
                                  </HasPermissions>
                                  <HasPermissions permissions={[PERMISSIONS.EDIT_ACTIONS]}>
                                    <Button size="xs" variant="primary" iconOnly onClick={() => onEditAction(action)}>
                                      <Pencil1 />
                                    </Button>
                                  </HasPermissions>
                                  <HasPermissions permissions={[PERMISSIONS.DELETE_ACTIONS]}>
                                    <Button size="xs" variant="danger" iconOnly disabled={!action.isActive} onClick={() => onDeleteAction(action)}>
                                      <Trash1 />
                                    </Button>
                                  </HasPermissions>
                                </div>
                              </div>
                            )}
                          />
                      }
                    </HasPermissions>
                  </div>
                }
              </div>
            );
          })}
        </div>
      }

      <ActionForm
        isOpen={actionFormState.isOpen}
        id={actionFormState.id}
        moduleId={actionFormState.moduleId}
        parentActionId={actionFormState.parentActionId}
        setIsOpen={(isOpen) => setActionFormState((prev) => ({ ...prev, isOpen }))}
        onSuccess={() => refetch()}
      />
    </>
  );
}
