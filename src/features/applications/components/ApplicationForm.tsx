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

import { Check, XmarkCircle, Code1, MenuFriesLeft1, Globe2, Link1AngularRight, ClockThree } from "@tailgrids/icons";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useCreateApplication, useGetApplication, useUpdateApplication } from "@/features/applications/hooks/applicationsHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetApplicationModel } from "@/features/applications/models/GetApplicationModel";
import type { UpdateApplicationModel } from "@/features/applications/models/UpdateApplicationModel";
import type { CreateApplicationModel } from "@/features/applications/models/CreateApplicationModel";

const AuthDefaults = {
  applicationUri: 'https://',
  signinRedirectUri: '/auth/signin',
  refreshRedirectUri: '/auth/silent-refresh',
  postLogoutRedirectUri: '/auth/signout',
  accessTokenLifetime: 3600
};

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { t: translate, i18n } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.APPLICATIONS);

  const { id } = useParams();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: applicationResponse, isLoading: isApplicationLoading } = useGetApplication(id ?? '');
  const { data: application } = applicationResponse ?? { data: null };

  const onSuccessfulResponse = (response: ResponseDto<GetApplicationModel>): void => {
    openToasts(response);
    if (response.isValid) {
      setTimeout(() => {
        navigate(`/applications`);
      }, 1000);
    }
  };

  const { mutate: create, isPending: isPendingCreate } = useCreateApplication({
    onSuccess: (response: ResponseDto<GetApplicationModel>) => {
      onSuccessfulResponse(response);
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const { mutate: update, isPending: isPendingUpdate } = useUpdateApplication({
    onSuccess: (response: ResponseDto<GetApplicationModel>) => {
      onSuccessfulResponse(response);
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const formSchema = zod.object({
    id: zod.string(),
    code: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.CODE') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('APPLICATIONS.COMMON.FIELDS.CODE'), value: 4 }))
      .max(64, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('APPLICATIONS.COMMON.FIELDS.CODE'), value: 64 })),
    name: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.NAME') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('APPLICATIONS.COMMON.FIELDS.NAME'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('APPLICATIONS.COMMON.FIELDS.NAME'), value: 256 })),
    logoUri: zod.string(),
    includeClient: zod.boolean(),
    applicationUri: zod.string(),
    signinRedirectUri: zod.string(),
    refreshRedirectUri: zod.string(),
    postLogoutRedirectUri: zod.string(),
    accessTokenLifetime: zod.number(),
    isActive: zod.boolean()
  }).superRefine((data, ctx) => {
    if (!data.includeClient) return;

    if (!data.applicationUri) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['applicationUri'], message: translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.URI') }) });
    }
    if (!data.signinRedirectUri) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['signinRedirectUri'], message: translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.SIGNIN_REDIRECT_URI') }) });
    }
    if (!data.refreshRedirectUri) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['refreshRedirectUri'], message: translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.REFRESH_REDIRECT_URI') }) });
    }
    if (!data.postLogoutRedirectUri) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['postLogoutRedirectUri'], message: translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.POST_LOGOUT_REDIRECT_URI') }) });
    }
    if (!data.accessTokenLifetime || data.accessTokenLifetime <= 0) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, path: ['accessTokenLifetime'], message: translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('APPLICATIONS.COMMON.FIELDS.ACCESS_TOKEN_LIFETIME') }) });
    }
  });

  const form = useForm({
    defaultValues: {
      id: '',
      code: '',
      name: '',
      logoUri: '',
      includeClient: false,
      applicationUri: '',
      signinRedirectUri: '',
      refreshRedirectUri: '',
      postLogoutRedirectUri: '',
      accessTokenLifetime: 3600,
      isActive: false
    },
    validators: {
      onMount: formSchema,
      onChange: formSchema,
      onSubmit: formSchema,
    },
  });

  useEffect(() => {
    if (application) {
      form.reset(application);
      form.validate('change');
      form.validateAllFields('submit');
    }
  }, [form, application])

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
      update(form.state.values as UpdateApplicationModel);
    } else {
      create(form.state.values as CreateApplicationModel);
    }
  }

  const updateClientInformation = (includeClient: boolean): void => {
    debugger
    if (includeClient) {
      form.setFieldValue('applicationUri', application?.applicationUri ?? AuthDefaults.applicationUri);
      form.setFieldValue('signinRedirectUri', application?.signinRedirectUri ?? AuthDefaults.signinRedirectUri);
      form.setFieldValue('refreshRedirectUri', application?.refreshRedirectUri ?? AuthDefaults.refreshRedirectUri);
      form.setFieldValue('postLogoutRedirectUri', application?.postLogoutRedirectUri ?? AuthDefaults.postLogoutRedirectUri);
      form.setFieldValue('accessTokenLifetime', application?.accessTokenLifetime ?? AuthDefaults.accessTokenLifetime);
    } else {
      form.setFieldValue('applicationUri', '');
      form.setFieldValue('signinRedirectUri', '');
      form.setFieldValue('refreshRedirectUri', '');
      form.setFieldValue('postLogoutRedirectUri', '');
      form.setFieldValue('accessTokenLifetime', 3600);
    }
  }

  const onCancel = (): void => {
    navigate(`/applications`);
  }

  return (
    <>
      <AppCard>
        <AppCardHeader
          title={translate(id ? 'APPLICATIONS.EDIT.TITLE' : 'APPLICATIONS.NEW.TITLE')}
          subTitle={translate(id ? 'APPLICATIONS.EDIT.SUB_TITLE' : 'APPLICATIONS.NEW.SUB_TITLE')}>
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
            {isApplicationLoading && <AppCardBodyLoader />}
            {!isApplicationLoading &&
              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <form.Field name="code" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('APPLICATIONS.COMMON.FIELDS.CODE')}
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
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_1", { field: translate("APPLICATIONS.COMMON.FIELDS.CODE") })}
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
                          {translate('APPLICATIONS.COMMON.FIELDS.NAME')}
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
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_1", { field: translate("APPLICATIONS.COMMON.FIELDS.NAME") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-2">
                    <form.Field name="logoUri" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('APPLICATIONS.COMMON.FIELDS.LOGO_URI')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <Globe2 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
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

                  <div className="sm:col-span-2 mt-2">
                    <form.Field name="includeClient" children={(field) => (
                      <Toggle
                        label={translate("APPLICATIONS.COMMON.FIELDS.INCLUDE_CLIENT")}
                        defaultChecked={application?.includeClient === true}
                        onChange={() => {
                          field.handleChange(!field.state.value);
                          updateClientInformation(!field.state.value);
                        }}
                      />
                    )}>
                    </form.Field>
                  </div>

                  <form.Subscribe selector={(state) => state.values.includeClient} children={(includeClient) => includeClient && (
                    <>
                      <div className="sm:col-span-2">
                        <form.Field name="applicationUri" children={(field) => (
                          <TextField className="flex flex-col gap-2">
                            <Label className="sm:text-sm/4">
                              {translate('APPLICATIONS.COMMON.FIELDS.URI')}
                            </Label>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                <Globe2 className="size-4.5" />
                              </InputGroupAddon>
                              <InputGroupInput
                                type="text"
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
                        <form.Field name="signinRedirectUri" children={(field) => (
                          <TextField className="flex flex-col gap-2">
                            <Label className="sm:text-sm/4">
                              {translate('APPLICATIONS.COMMON.FIELDS.SIGNIN_REDIRECT_URI')}
                            </Label>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                <Link1AngularRight className="size-4.5" />
                              </InputGroupAddon>
                              <InputGroupInput
                                type="text"
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
                        <form.Field name="refreshRedirectUri" children={(field) => (
                          <TextField className="flex flex-col gap-2">
                            <Label className="sm:text-sm/4">
                              {translate('APPLICATIONS.COMMON.FIELDS.REFRESH_REDIRECT_URI')}
                            </Label>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                <Link1AngularRight className="size-4.5" />
                              </InputGroupAddon>
                              <InputGroupInput
                                type="text"
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
                        <form.Field name="postLogoutRedirectUri" children={(field) => (
                          <TextField className="flex flex-col gap-2">
                            <Label className="sm:text-sm/4">
                              {translate('APPLICATIONS.COMMON.FIELDS.POST_LOGOUT_REDIRECT_URI')}
                            </Label>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                <Link1AngularRight className="size-4.5" />
                              </InputGroupAddon>
                              <InputGroupInput
                                type="text"
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
                        <form.Field name="accessTokenLifetime" children={(field) => (
                          <TextField className="flex flex-col gap-2">
                            <Label className="sm:text-sm/4">
                              {translate('APPLICATIONS.COMMON.FIELDS.ACCESS_TOKEN_LIFETIME')}
                            </Label>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                <ClockThree className="size-4.5" />
                              </InputGroupAddon>
                              <InputGroupInput
                                type="number"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                className="sm:text-sm/4 ps-3"
                                onChange={(event) => field.handleChange(Number(event.target.value))}
                              />
                            </InputGroup>
                            <InputErrors form={form} field={field} />
                          </TextField>
                        )}>
                        </form.Field>
                      </div>
                    </>
                  )}>
                  </form.Subscribe>

                  {id !== undefined && <div className="sm:col-span-1 mt-4">
                    <form.Field name="isActive" children={(field) => (
                      <Toggle
                        label={translate("COMMON.STATUS.ACTIVE")}
                        defaultChecked={application?.isActive === true}
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
