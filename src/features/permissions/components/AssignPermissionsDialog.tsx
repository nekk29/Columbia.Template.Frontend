import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Check, XmarkCircle } from "@tailgrids/icons";
import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { NestedTree } from "@/components/shared/NestedTree";
import { WindowDialog } from "@/components/shared/WindowDialog";
import type { DialogAction } from "@/components/shared/AlertMessageDialog";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/tailgrids/core/accordion";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useAssignPermissions, useRolePermissions } from "@/features/permissions/hooks/permissionsHooks";
import type { PermissionModel } from "@/features/permissions/models/permissionModel";

export interface AssignPermissionsDialogProps {
  roleId: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function AssignPermissionsDialog({ roleId, isOpen, setIsOpen, onSuccess }: AssignPermissionsDialogProps) {
  const { t: translate } = useTranslation();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: permissionsResponse, isLoading } = useRolePermissions(roleId ?? '');
  const rolePermissions = permissionsResponse?.data ?? [];

  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());

  // Re-derive the checked set whenever a new rolePermissions response arrives, without an
  // effect (react-hooks/set-state-in-effect) — see https://react.dev/learn/you-might-not-need-an-effect
  // Compared on `permissionsResponse` itself (kept referentially stable by react-query across
  // re-renders when unchanged) rather than on `rolePermissions`, which is a freshly-allocated
  // fallback array whenever there's no data yet and would otherwise "change" every render.
  const [syncedResponse, setSyncedResponse] = useState(permissionsResponse);
  if (permissionsResponse !== syncedResponse) {
    setSyncedResponse(permissionsResponse);

    const assigned = (permissionsResponse?.data ?? [])
      .flatMap((group) => group.permissions)
      .filter((permission) => permission.isAssigned)
      .map((permission) => permission.actionId);

    setSelectedActionIds(new Set(assigned));
  }

  const toggleAction = (actionId: string): void => {
    setSelectedActionIds((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const { mutate: assign, isPending } = useAssignPermissions({
    onSuccess: (response) => {
      openToasts(response);
      if (response.isValid) {
        setIsOpen(false);
        onSuccess?.();
      }
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const onSave = (): void => {
    if (!roleId) return;
    assign({ roleId, actionIds: Array.from(selectedActionIds) });
  };

  const actions: DialogAction[] = [
    { label: translate('COMMON.ACTIONS.SAVE'), icon: <Check />, variant: "primary", func: onSave },
    { label: translate('COMMON.ACTIONS.CANCEL'), icon: <XmarkCircle />, variant: "danger", close: true, func: () => setIsOpen(false) },
  ];

  if (!isOpen) return null;

  return (
    <WindowDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={translate('PERMISSIONS.ASSIGN.TITLE')}
      description={translate('PERMISSIONS.ASSIGN.SUB_TITLE')}
      actions={isPending ? [] : actions}
    >
      {isLoading && <div className="py-4 text-sm text-text-100">{translate('COMMON.MESSAGES.SEARCH.NO_RESULTS')}</div>}

      {!isLoading && (rolePermissions ?? []).length === 0 &&
        <div className="py-4 text-sm text-text-100">{translate('COMMON.MESSAGES.SEARCH.NO_RESULTS')}</div>
      }

      {!isLoading && (rolePermissions ?? []).length > 0 &&
        <AccordionRoot variant="style_two">
          {(rolePermissions ?? []).map((group) => (
            <AccordionItem key={group.moduleCode}>
              <AccordionTrigger>{group.moduleName}</AccordionTrigger>
              <AccordionContent>
                <NestedTree<PermissionModel>
                  items={group.permissions}
                  getId={(permission) => permission.actionId}
                  getParentId={(permission) => permission.parentActionId}
                  renderNode={(permission) => (
                    <label className="flex cursor-pointer items-start gap-2">
                      <Checkbox
                        checked={selectedActionIds.has(permission.actionId)}
                        onClick={() => toggleAction(permission.actionId)}
                        onChange={() => {}}
                      />
                      <span>
                        <span className="block text-sm text-title-50">{permission.actionName}</span>
                        {permission.actionDescription &&
                          <span className="block text-xs text-text-100">{permission.actionDescription}</span>
                        }
                      </span>
                    </label>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionRoot>
      }
    </WindowDialog>
  );
}
