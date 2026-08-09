import { useEffect } from "react";
import { z as zod } from "zod";
import { useForm } from '@tanstack/react-form';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";
import { AppCardBodyLoader } from "@/components/layout/content/AppCardBodyLoader";

import { Label, TextField } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { Toggle } from "@/components/tailgrids/core/toggle";
import { InputErrors } from "@/components/shared/InputErrors";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/tailgrids/core/input-group";

import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger
} from "@/components/tailgrids/core/select";

import { Check, XmarkCircle, Buildings11, MenuFriesLeft1 } from "@tailgrids/icons";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useListApplications } from "@/features/applications/hooks/applicationsHooks";
import { useCreateRole, useGetRole, useUpdateRole } from "@/features/roles/hooks/rolesHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetRoleModel } from "@/features/roles/models/GetRoleModel";
import type { UpdateRoleModel } from "@/features/roles/models/UpdateRoleModel";
import type { CreateRoleModel } from "@/features/roles/models/CreateRoleModel";

export default function RoleForm() {
  const navigate = useNavigate();
  const { t: translate, i18n } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.ROLES);

  const { id } = useParams();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: applicationsResponse, isLoading: isApplicationsLoading } = useListApplications();
  const { data: applications } = applicationsResponse ?? { data: [] };

  const { data: roleResponse, isLoading: isRoleLoading } = useGetRole(id ?? '');
  const { data: role } = roleResponse ?? { data: null };

  const onSuccessfulResponse = (response: ResponseDto<GetRoleModel>): void => {
    openToasts(response);
    if (response.isValid) {
      setTimeout(() => {
        navigate(`/roles`);
      }, 1000);
    }
  };

  const { mutate: create, isPending: isPendingCreate } = useCreateRole({
    onSuccess: (response: ResponseDto<GetRoleModel>) => {
      onSuccessfulResponse(response);
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const { mutate: update, isPending: isPendingUpdate } = useUpdateRole({
    onSuccess: (response: ResponseDto<GetRoleModel>) => {
      onSuccessfulResponse(response);
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const formSchema = zod.object({
    id: zod.string(),
    applicationId: zod.string()
      .nonempty(translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('ROLES.COMMON.FIELDS.APPLICATION') })),
    name: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('ROLES.COMMON.FIELDS.NAME') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('ROLES.COMMON.FIELDS.NAME'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('ROLES.COMMON.FIELDS.NAME'), value: 256 })),
    normalizedName: zod.string(),
    isActive: zod.boolean()
  });

  const form = useForm({
    defaultValues: {
      id: '',
      applicationId: '',
      name: '',
      normalizedName: '',
      isActive: false
    },
    validators: {
      onMount: formSchema,
      onChange: formSchema,
      onSubmit: formSchema,
    },
  });

  useEffect(() => {
    if (role) {
      form.reset(role);
      form.validate('change');
      form.validateAllFields('submit');
    }
  }, [form, role])

  // Update validations language
  useEffect(() => {
    if (form.state.isTouched) {
      form.validate('change');
      form.validateAllFields('submit');
    }
  }, [form, i18n.language]);

  const onSave = (): void => {
    if (!form.state.canSubmit) {
      form.validate('change');
      form.validateAllFields('submit');
      return;
    }

    if (id) {
      update(form.state.values as UpdateRoleModel);
    } else {
      create(form.state.values as CreateRoleModel);
    }
  }

  const onCancel = (): void => {
    navigate(`/roles`);
  }

  const isLoading = isApplicationsLoading || isRoleLoading;

  return (
    <>
      <AppCard>
        <AppCardHeader
          title={translate(id ? 'ROLES.EDIT.TITLE' : 'ROLES.NEW.TITLE')}
          subTitle={translate(id ? 'ROLES.EDIT.SUB_TITLE' : 'ROLES.NEW.SUB_TITLE')}>
          <div className="flex flex-wrap justify-end gap-2">
            <HasPermissions permissions={[PERMISSIONS.CREATE, PERMISSIONS.EDIT]}>
              <Button size="xs" variant="primary" onClick={onSave} disabled={isPendingCreate || isPendingUpdate}>
                <Check />
                {translate('COMMON.ACTIONS.SAVE')}
              </Button>
            </HasPermissions>
            <Button size="xs" variant="danger" onClick={onCancel} disabled={isPendingCreate || isPendingUpdate}>
              <XmarkCircle />
              {translate('COMMON.ACTIONS.CANCEL')}
            </Button>
          </div>
        </AppCardHeader>
        <AppCardBody>
          <form onSubmit={onSave}>
            {isLoading && <AppCardBodyLoader />}
            {!isLoading &&
              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <form.Field name="applicationId" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('ROLES.COMMON.FIELDS.APPLICATION')}
                        </Label>
                        <Select
                          aria-label={translate('ROLES.COMMON.FIELDS.APPLICATION')}
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value?.toString() ?? '')}>
                          <SelectTrigger>
                            <Buildings11 className="size-4.5 mr-1" />
                            <span className="truncate">
                              {(applications ?? []).find((a) => a.id === field.state.value)?.name
                                ?? translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('ROLES.COMMON.FIELDS.APPLICATION') })}
                            </span>
                            <SelectIndicator />
                          </SelectTrigger>
                          <SelectContent>
                            {(applications ?? []).map((a) => (
                              <SelectItem key={a.id} id={a.id} textValue={a.name}>{a.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="name" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('ROLES.COMMON.FIELDS.NAME')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <MenuFriesLeft1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={256}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_1", { field: translate("ROLES.COMMON.FIELDS.NAME") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  {id !== undefined && <div className="sm:col-span-1 mt-4">
                    <form.Field name="isActive" children={(field) => (
                      <Toggle
                        label={translate("COMMON.STATUS.ACTIVE")}
                        defaultChecked={role?.isActive === true}
                        onChange={() => field.handleChange(!field.state.value)}
                      />
                    )}>
                    </form.Field>
                  </div>}
                </div>
              </div>
            }
          </form>
        </AppCardBody>
      </AppCard>
    </>
  );
}
