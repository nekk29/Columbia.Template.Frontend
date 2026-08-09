import { useEffect } from "react";
import { z as zod } from "zod";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";
import { AppCardBodyLoader } from "@/components/layout/content/AppCardBodyLoader";

import { Label, TextField } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { Toggle } from "@/components/tailgrids/core/toggle";
import { InputErrors } from "@/components/shared/InputErrors";

import {
  InputGroupAddon,
  InputGroup,
  InputGroupInput,
} from "@/components/tailgrids/core/input-group";

import {
  Check,
  Code1,
  Globe2,
  MenuFriesLeft1,
  XmarkCircle,
} from "@tailgrids/icons";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import {
  useGetSetting,
  useUpdateSetting,
} from "@/features/settings/hooks/settingsHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetSettingModel } from "@/features/settings/models/GetSettingModel";
import type { UpdateSettingModel } from "@/features/settings/models/UpdateSettingModel";

export default function SettingsForm() {
  const navigate = useNavigate();
  const { group = "", code = "" } = useParams();
  const { t: translate, i18n } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.SETTINGS);

  const { openToasts, openErrorToast } = useDialogs();
  const { data: response, isLoading } = useGetSetting(group, code);
  const { data: setting } = response ?? { data: null };

  const formSchema = zod.object({
    group: zod.string(),
    code: zod.string(),
    description: zod.string(),
    value: zod.string().nonempty(
      translate("VALIDATION.INPUT.REQUIRED_1", {
        field: translate("SETTINGS.COMMON.FIELDS.VALUE"),
      }),
    ),
    encrypted: zod.boolean(),
    isActive: zod.boolean(),
  });

  const form = useForm({
    defaultValues: {
      group,
      code,
      description: "",
      value: "",
      encrypted: false,
      isActive: false,
    },
    validators: {
      onMount: formSchema,
      onChange: formSchema,
      onSubmit: formSchema,
    },
  });

  useEffect(() => {
    if (setting) {
      form.reset(setting);
      form.validate("change");
      form.validateAllFields("submit");
    }
  }, [form, setting]);

  useEffect(() => {
    if (form.state.isTouched) {
      form.validate("change");
      form.validateAllFields("submit");
    }
  }, [form, i18n.language]);

  const onSuccessfulResponse = (result: ResponseDto<GetSettingModel>) => {
    openToasts(result);
    if (result.isValid) setTimeout(() => navigate("/settings"), 1000);
  };

  const { mutate: update, isPending } = useUpdateSetting({
    onSuccess: onSuccessfulResponse,
    onError: (error) => {
      openErrorToast("Operation failed");
      console.error(error);
    },
  });

  const onSave = () => {
    if (form.state.canSubmit) update(form.state.values as UpdateSettingModel);
    else {
      form.validate("change");
      form.validateAllFields("submit");
    }
  };

  return (
    <AppCard>
      <AppCardHeader
        title={translate("SETTINGS.EDIT.TITLE")}
        subTitle={translate("SETTINGS.EDIT.SUB_TITLE")}
      >
        <div className="flex flex-wrap justify-end gap-2">
          <HasPermissions
            permissions={[PERMISSIONS.EDIT]}
          >
            <Button
              size="xs"
              variant="primary"
              onClick={onSave}
              disabled={isPending}
            >
              <Check />
              {translate("COMMON.ACTIONS.SAVE")}
            </Button>
          </HasPermissions>
          <Button
            size="xs"
            variant="danger"
            onClick={() => navigate("/settings")}
            disabled={isPending}
          >
            <XmarkCircle />
            {translate("COMMON.ACTIONS.CANCEL")}
          </Button>
        </div>
      </AppCardHeader>
      <AppCardBody>
        {isLoading && <AppCardBodyLoader />}
        {!isLoading && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSave();
            }}
          >
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <form.Field
                  name="group"
                  children={(field) => (
                    <TextField className="flex flex-col gap-2">
                      <Label className="sm:text-sm/4">
                        {translate("SETTINGS.COMMON.FIELDS.GROUP")}
                      </Label>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <MenuFriesLeft1 className="size-4.5" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          readOnly
                          onBlur={field.handleBlur}
                          className="sm:text-sm/4 ps-3"
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </InputGroup>
                      <InputErrors form={form} field={field} />
                    </TextField>
                  )}
                />
                <form.Field
                  name="code"
                  children={(field) => (
                    <TextField className="flex flex-col gap-2">
                      <Label className="sm:text-sm/4">
                        {translate("SETTINGS.COMMON.FIELDS.CODE")}
                      </Label>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <Code1 className="size-4.5" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          readOnly
                          onBlur={field.handleBlur}
                          className="sm:text-sm/4 ps-3"
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </InputGroup>
                      <InputErrors form={form} field={field} />
                    </TextField>
                  )}
                />
                <form.Field
                  name="description"
                  children={(field) => (
                    <TextField className="flex flex-col gap-2 sm:col-span-2">
                      <Label className="sm:text-sm/4">
                        {translate("SETTINGS.COMMON.FIELDS.DESCRIPTION")}
                      </Label>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <Globe2 className="size-4.5" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          className="sm:text-sm/4 ps-3"
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </InputGroup>
                      <InputErrors form={form} field={field} />
                    </TextField>
                  )}
                />
                <form.Field
                  name="value"
                  children={(field) => (
                    <TextField className="flex flex-col gap-2 sm:col-span-2">
                      <Label className="sm:text-sm/4">
                        {translate("SETTINGS.COMMON.FIELDS.VALUE")}
                      </Label>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <Globe2 className="size-4.5" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          className="sm:text-sm/4 ps-3"
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </InputGroup>
                      <InputErrors form={form} field={field} />
                    </TextField>
                  )}
                />
                {group !== undefined && code !== undefined && <div className="sm:col-span-1 mt-4">
                  <form.Field name="isActive" children={(field) => (
                    <Toggle
                      label={translate("COMMON.STATUS.ACTIVE")}
                      defaultChecked={setting?.isActive === true}
                      onChange={() => field.handleChange(!field.state.value)}
                    />
                  )}>
                  </form.Field>
                </div>}
              </div>
            </div>
          </form>
        )}
      </AppCardBody>
    </AppCard>
  );
}
