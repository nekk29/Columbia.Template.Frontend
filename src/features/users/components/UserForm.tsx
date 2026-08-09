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

import {
  Check,
  XmarkCircle,
  User2,
  MenuFriesLeft1,
  Envelope1,
  Telephone1,
  UserPencil,
  Locked3
} from "@tailgrids/icons";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useListRoles } from "@/features/roles/hooks/rolesHooks";
import { useCreateUser, useGetUser, useUpdateUser } from "@/features/users/hooks/usersHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetUserModel } from "@/features/users//models/GetUserModel";
import type { UpdateUserModel } from "@/features/users/models/UpdateUserModel";
import type { CreateUserModel } from "@/features/users//models/CreateUserModel";

export default function UserForm() {
  const navigate = useNavigate();
  const { t: translate, i18n } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.USERS);

  const { id } = useParams();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: rolesResponse, isLoading: isRolesLoading } = useListRoles();
  const { data: roles } = rolesResponse ?? { data: [] };

  const { data: userResponse, isLoading: isUserLoading } = useGetUser(id ?? '');
  const { data: user } = userResponse ?? { data: null };

  const onSuccessfulResponse = (response: ResponseDto<GetUserModel>): void => {
    openToasts(response);
    if (response.isValid) {
      setTimeout(() => {
        navigate(`/users`);
      }, 1000);
    }
  };

  const { mutate: create, isPending: isPendingCreate } = useCreateUser({
    onSuccess: (response: ResponseDto<GetUserModel>) => {
      onSuccessfulResponse(response);
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const { mutate: update, isPending: isPendingUpdate } = useUpdateUser({
    onSuccess: (response: ResponseDto<GetUserModel>) => {
      onSuccessfulResponse(response);
    },
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const formSchema = zod.object({
    id: zod.string(),
    userName: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('USERS.COMMON.FIELDS.USERNAME') }))
      .email(translate('VALIDATION.EMAIL.INVALID', { field: translate('USERS.COMMON.FIELDS.USERNAME') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.USERNAME'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.USERNAME'), value: 256 })),
    email: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_2', { field: translate('USERS.COMMON.FIELDS.EMAIL') }))
      .email(translate('VALIDATION.EMAIL.INVALID', { field: translate('USERS.COMMON.FIELDS.EMAIL') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.EMAIL'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.EMAIL'), value: 256 })),
    firstName: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_0', { field: translate('USERS.COMMON.FIELDS.FIRST_NAME') }))
      .min(2, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.FIRST_NAME'), value: 2 }))
      .max(100, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.FIRST_NAME'), value: 100 })),
    lastName: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_0', { field: translate('USERS.COMMON.FIELDS.LAST_NAME') }))
      .min(2, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.LAST_NAME'), value: 2 }))
      .max(100, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.LAST_NAME'), value: 100 })),
    phoneNumber: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_3', { field: translate('USERS.COMMON.FIELDS.PHONE') }))
      .min(3, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.PHONE'), value: 3 }))
      .max(100, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.PHONE'), value: 100 }))
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, translate('VALIDATION.PHONE.INVALID'))
      .refine((value) => value.replace(/\D/g, '').length >= 7, translate('VALIDATION.PHONE.INVALID')),
    roleIds: zod.array(zod.string())
      .nonempty(translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('USERS.COMMON.FIELDS.ROLES') })),
    password: id ? zod.string() : zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_3', { field: translate('USERS.COMMON.FIELDS.PASSWORD') }))
      .min(3, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.PASSWORD'), value: 3 }))
      .max(100, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.PASSWORD'), value: 100 })),
    confirmPassword: id ? zod.string() : zod.string()
      .nonempty(translate('USERS.COMMON.FIELDS.CONFIRM_PASSWORD'))
      .min(3, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('USERS.COMMON.FIELDS.CONFIRM_PASSWORD'), value: 3 }))
      .max(100, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('USERS.COMMON.FIELDS.CONFIRM_PASSWORD'), value: 100 })),
    isActive: zod.boolean()
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: translate('USERS.COMMON.MESSAGES.PASSWORD_MISMATCH'),
      });
    }
  });

  const form = useForm({
    defaultValues: {
      id: '',
      userName: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      roleIds: [] as string[],
      isActive: false
    },
    validators: {
      onMount: formSchema,
      onChange: formSchema,
      onSubmit: formSchema,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        password: '',
        confirmPassword: '',
        ...user
      });
      form.validate('change');
      form.validateAllFields('submit');
    }
  }, [form, user])

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
      update(form.state.values as UpdateUserModel);
    } else {
      create(form.state.values as CreateUserModel);
    }
  }

  const onCancel = (): void => {
    navigate(`/users`);
  }

  return (
    <>
      <AppCard>
        <AppCardHeader
          title={translate(id ? 'USERS.EDIT.TITLE' : 'USERS.NEW.TITLE')}
          subTitle={translate(id ? 'USERS.EDIT.SUB_TITLE' : 'USERS.NEW.SUB_TITLE')}>
          <div className="flex flex-wrap justify-end gap-2">
            <HasPermissions permissions={[PERMISSIONS.CREATE]}>
              <Button size="xs" variant="primary" onClick={onSave} disabled={isPendingCreate || isPendingUpdate}>
                <Check />
                {translate('COMMON.ACTIONS.SAVE')}
              </Button>
            </HasPermissions>
            <HasPermissions permissions={[PERMISSIONS.EXPORT]}>
              <Button size="xs" variant="danger" onClick={onCancel} disabled={isPendingCreate || isPendingUpdate}>
                <XmarkCircle />
                {translate('COMMON.ACTIONS.CANCEL')}
              </Button>
            </HasPermissions>
          </div>
        </AppCardHeader>
        <AppCardBody>
          <form onSubmit={onSave}>
            {(isRolesLoading || isUserLoading) && <AppCardBodyLoader />}
            {(!isRolesLoading && !isUserLoading) &&
              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div className="grid-cols-2">
                    <form.Field name="userName" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.USERNAME')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <User2 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={256}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_1", { field: translate("USERS.COMMON.FIELDS.USERNAME") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="grid-cols-2">
                    <form.Field name="email" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.EMAIL')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <Envelope1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={256}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_2", { field: translate("USERS.COMMON.FIELDS.EMAIL") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="firstName" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.FIRST_NAME')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <MenuFriesLeft1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={100}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_0", { field: translate("USERS.COMMON.FIELDS.FIRST_NAME") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="lastName" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.LAST_NAME')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <MenuFriesLeft1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={100}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_0", { field: translate("USERS.COMMON.FIELDS.LAST_NAME") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="phoneNumber" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.PHONE')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <Telephone1 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            maxLength={100}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_1", { field: translate("USERS.COMMON.FIELDS.PHONE") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  <div className="sm:col-span-1">
                    <form.Field name="roleIds" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.ROLES')}
                        </Label>
                        <Select
                          selectionMode="multiple"
                          aria-label={translate('USERS.COMMON.FIELDS.ROLES')}
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(event) => { field.handleChange(event) }}>
                          <SelectTrigger>
                            <span className="truncate">
                              {field.state.value.length === 0
                                ? translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('USERS.COMMON.FIELDS.ROLES') })
                                : field.state.value
                                  .map(key => {
                                    const role = (roles ?? []).find(r => r.id === key)
                                    return role ? `${role.applicationName} - ${role.name}` : '';
                                  })
                                  .join(", ")}
                            </span>
                            <SelectIndicator />
                          </SelectTrigger>
                          <SelectContent>
                            {(roles ?? []).map((r) => (
                              <SelectItem key={`pageSize-${r.id}`} id={r.id}>{r.applicationName} - {r.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>

                  {id === undefined && <div className="sm:col-span-1">
                    <form.Field name="password" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.PASSWORD')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <UserPencil className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="password"
                            maxLength={64}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("VALIDATION.INPUT.REQUIRED_1", { field: translate("USERS.COMMON.FIELDS.PASSWORD") })}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>}

                  {id === undefined && <div className="sm:col-span-1">
                    <form.Field name="confirmPassword" children={(field) => (
                      <TextField className="flex flex-col gap-2">
                        <Label className="sm:text-sm/4">
                          {translate('USERS.COMMON.FIELDS.CONFIRM_PASSWORD')}
                        </Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <Locked3 className="size-4.5" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="password"
                            maxLength={64}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4 ps-3"
                            placeholder={translate("USERS.COMMON.FIELDS.CONFIRM_PASSWORD")}
                            onChange={(event) => field.handleChange(event.target.value)}
                          />
                        </InputGroup>
                        <InputErrors form={form} field={field} />
                      </TextField>
                    )}>
                    </form.Field>
                  </div>}

                  {id !== undefined && <div className="sm:col-span-1 mt-4">
                    <form.Field name="isActive" children={(field) => (
                      <Toggle
                        label={translate("COMMON.STATUS.ACTIVE")}
                        defaultChecked={user?.isActive === true}
                        onChange={() => {
                          if (user) user.isActive = !field.state.value;
                          field.handleChange(!field.state.value);
                        }}
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
