import { useEffect } from "react";
import { z as zod } from "zod";
import { useForm } from '@tanstack/react-form';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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

import { Check, XmarkCircle, Buildings11, Code1, MenuFriesLeft1, Folder1 } from "@tailgrids/icons";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useListApplications } from "@/features/applications/hooks/applicationsHooks";
import { useCreateModule, useGetModule, useUpdateModule } from "@/features/modules/hooks/modulesHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetModuleModel } from "@/features/modules/models/GetModuleModel";
import type { UpdateModuleModel } from "@/features/modules/models/UpdateModuleModel";
import type { CreateModuleModel } from "@/features/modules/models/CreateModuleModel";

export default function ModuleForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t: translate, i18n } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.MODULES);

  const { id } = useParams();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: applicationsResponse, isLoading: isApplicationsLoading } = useListApplications();
  const { data: applications } = applicationsResponse ?? { data: [] };

  const { data: moduleResponse, isLoading: isModuleLoading } = useGetModule(id ?? '');
  const { data: moduleRecord } = moduleResponse ?? { data: null };

  const onSuccessfulResponse = (response: ResponseDto<GetModuleModel>): void => {
    openToasts(response);
    if (response.isValid) {
      setTimeout(() => {
        navigate(`/modules?applicationId=${response.data?.applicationId ?? ''}`);
      }, 1000);
    }
  };

  const { mutate: create, isPending: isPendingCreate } = useCreateModule({
    onSuccess: (response: ResponseDto<GetModuleModel>) => onSuccessfulResponse(response),
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const { mutate: update, isPending: isPendingUpdate } = useUpdateModule({
    onSuccess: (response: ResponseDto<GetModuleModel>) => onSuccessfulResponse(response),
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const formSchema = zod.object({
    id: zod.string(),
    applicationId: zod.string()
      .nonempty(translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MODULES.COMMON.FIELDS.APPLICATION') })),
    code: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('MODULES.COMMON.FIELDS.CODE') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('MODULES.COMMON.FIELDS.CODE'), value: 4 }))
      .max(64, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('MODULES.COMMON.FIELDS.CODE'), value: 64 })),
    name: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('MODULES.COMMON.FIELDS.NAME') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('MODULES.COMMON.FIELDS.NAME'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('MODULES.COMMON.FIELDS.NAME'), value: 256 })),
    description: zod.string()
      .max(1024, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('MODULES.COMMON.FIELDS.DESCRIPTION'), value: 1024 })),
    isActive: zod.boolean()
  });

  const form = useForm({
    defaultValues: {
      id: '',
      applicationId: searchParams.get('applicationId') ?? '',
      code: '',
      name: '',
      description: '',
      isActive: false
    },
    validators: {
      onMount: formSchema,
      onChange: formSchema,
      onSubmit: formSchema,
    },
  });

  useEffect(() => {
    if (moduleRecord) {
      form.reset(moduleRecord);
      form.validate('change');
      form.validateAllFields('submit');
    }
  }, [form, moduleRecord])

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
      update(form.state.values as UpdateModuleModel);
    } else {
      create(form.state.values as CreateModuleModel);
    }
  }

  const onCancel = (): void => {
    navigate(`/modules`);
  }

  const isLoading = isApplicationsLoading || isModuleLoading;

  return (
    <>
      <AppCard>
        <AppCardHeader
          title={translate(id ? 'MODULES.EDIT.TITLE' : 'MODULES.NEW.TITLE')}
          subTitle={translate(id ? 'MODULES.EDIT.SUB_TITLE' : 'MODULES.NEW.SUB_TITLE')}>
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
                  <div className="sm:col-span-2">
                    <form.Field name="applicationId" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('MODULES.COMMON.FIELDS.APPLICATION')}
                        </Label>
                        <Select
                          aria-label={translate('MODULES.COMMON.FIELDS.APPLICATION')}
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value?.toString() ?? '')}>
                          <SelectTrigger>
                            <Buildings11 className="size-4.5 mr-1" />
                            <span className="truncate">
                              {(applications ?? []).find((a) => a.id === field.state.value)?.name
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
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="code" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('MODULES.COMMON.FIELDS.CODE')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <Code1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={64}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="name" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('MODULES.COMMON.FIELDS.NAME')}
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
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-2">
                    <form.Field name="description" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('MODULES.COMMON.FIELDS.DESCRIPTION')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <Folder1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={1024}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
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
                        defaultChecked={moduleRecord?.isActive === true}
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
