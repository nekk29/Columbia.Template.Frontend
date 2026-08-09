import { useEffect, useState } from "react";
import { z as zod } from "zod";
import { useForm } from '@tanstack/react-form';
import { useTranslation } from "react-i18next";

import { Toggle } from "@/components/tailgrids/core/toggle";
import { InputErrors } from "@/components/shared/InputErrors";
import { WindowDialog } from "@/components/shared/WindowDialog";
import { Label, TextField } from "react-aria-components";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/tailgrids/core/input-group";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger
} from "@/components/tailgrids/core/select";
import { Check, XmarkCircle, Buildings11, Folder1, Code1, MenuFriesLeft1, Globe2, ChevronRight } from "@tailgrids/icons";
import type { DialogAction } from "@/components/shared/AlertMessageDialog";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useListApplications } from "@/features/applications/hooks/applicationsHooks";
import { useListSimpleModulesByApplication } from "@/features/modules/hooks/modulesHooks";
import { useListActionsByModule } from "@/features/actions/hooks/actionsHooks";
import {
  useCreateMenuOption,
  useGetMenuOption,
  useListAllMenuOptions,
  useUpdateMenuOption
} from "@/features/menu-options/hooks/menuOptionsHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetMenuOptionModel } from "@/features/menu-options/models/getMenuOptionModel";
import type { UpdateMenuOptionModel } from "@/features/menu-options/models/updateMenuOptionModel";
import type { CreateMenuOptionModel } from "@/features/menu-options/models/createMenuOptionModel";

export interface MenuOptionFormProps {
  id?: string | null;
  applicationId?: string;
  parentMenuOptionId?: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function MenuOptionForm({ id, applicationId: initialApplicationId, parentMenuOptionId, isOpen, setIsOpen, onSuccess }: MenuOptionFormProps) {
  const { t: translate, i18n } = useTranslation();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: applicationsResponse } = useListApplications();
  const { data: applications } = applicationsResponse ?? { data: [] };

  const { data: menuOptionResponse, isLoading } = useGetMenuOption(id ?? '');
  const { data: menuOption } = menuOptionResponse ?? { data: null };

  const onSuccessfulResponse = (response: ResponseDto<GetMenuOptionModel>): void => {
    openToasts(response);
    if (response.isValid) {
      setIsOpen(false);
      onSuccess?.();
    }
  };

  const { mutate: create, isPending: isPendingCreate } = useCreateMenuOption({
    onSuccess: (response: ResponseDto<GetMenuOptionModel>) => onSuccessfulResponse(response),
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const { mutate: update, isPending: isPendingUpdate } = useUpdateMenuOption({
    onSuccess: (response: ResponseDto<GetMenuOptionModel>) => onSuccessfulResponse(response),
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const formSchema = zod.object({
    id: zod.string(),
    applicationId: zod.string()
      .nonempty(translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION') })),
    moduleId: zod.string()
      .nonempty(translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MENU_OPTIONS.COMMON.FIELDS.MODULE') })),
    actionId: zod.string()
      .nonempty(translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MENU_OPTIONS.COMMON.FIELDS.ACTION') })),
    parentMenuOptionId: zod.string().nullable(),
    code: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('MENU_OPTIONS.COMMON.FIELDS.CODE') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('MENU_OPTIONS.COMMON.FIELDS.CODE'), value: 4 }))
      .max(64, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('MENU_OPTIONS.COMMON.FIELDS.CODE'), value: 64 })),
    name: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('MENU_OPTIONS.COMMON.FIELDS.NAME') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('MENU_OPTIONS.COMMON.FIELDS.NAME'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('MENU_OPTIONS.COMMON.FIELDS.NAME'), value: 256 })),
    description: zod.string()
      .max(1024, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('MENU_OPTIONS.COMMON.FIELDS.DESCRIPTION'), value: 1024 })),
    menuUri: zod.string(),
    menuIcon: zod.string(),
    sortOrder: zod.number()
      .min(0, translate('VALIDATION.TEXT.MIN_EQUAL', { field: translate('MENU_OPTIONS.COMMON.FIELDS.SORT_ORDER'), value: 0 }))
      .max(999, translate('VALIDATION.TEXT.MAX_EQUAL', { field: translate('MENU_OPTIONS.COMMON.FIELDS.SORT_ORDER'), value: 999 })),
    isActive: zod.boolean(),
    children: zod.array(zod.any())
  });

  const form = useForm({
    defaultValues: {
      id: '',
      applicationId: initialApplicationId ?? '',
      moduleId: '',
      actionId: '',
      parentMenuOptionId: parentMenuOptionId ?? null,
      code: '',
      name: '',
      description: '',
      menuUri: '',
      menuIcon: '',
      sortOrder: 0,
      isActive: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: [] as any[]
    },
    validators: {
      onMount: formSchema,
      onChange: formSchema,
      onSubmit: formSchema,
    },
  });


  const [applicationId, setApplicationId] = useState<string>('');
  const [applicationCode, setApplicationCode] = useState<string>('');
  const [moduleId, setModuleId] = useState<string>('');

  const { data: modulesResponse } = useListSimpleModulesByApplication(applicationId);
  const { data: modules } = modulesResponse ?? { data: [] };

  const { data: actionsResponse } = useListActionsByModule(moduleId);
  const { data: actions } = actionsResponse ?? { data: [] };

  const { data: parentOptionsResponse } = useListAllMenuOptions(applicationCode);
  const { data: parentOptions } = parentOptionsResponse ?? { data: [] };

  useEffect(() => {
    if (menuOption) {
      form.reset({
        ...menuOption,
        moduleId: menuOption.moduleId ?? '',
        parentMenuOptionId: menuOption.parentMenuOptionId ?? null,
        children: []
      });
    } else {
      form.reset({
        id: '',
        applicationId: initialApplicationId ?? '',
        moduleId: '',
        actionId: '',
        parentMenuOptionId: parentMenuOptionId ?? null,
        code: '',
        name: '',
        description: '',
        menuUri: '',
        menuIcon: '',
        sortOrder: 0,
        isActive: false,
        children: []
      });
    }

    form.validate('change');
    form.validateAllFields('submit');

    const selectedApp = (applications ?? []).find((a) => a.id === initialApplicationId);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplicationId(selectedApp?.id ?? '');
    setApplicationCode(selectedApp?.code ?? '');
    setModuleId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, menuOption, isOpen, initialApplicationId, parentMenuOptionId]);

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
      update(form.state.values as UpdateMenuOptionModel);
    } else {
      create(form.state.values as CreateMenuOptionModel);
    }
  }

  const actionsButtons: DialogAction[] = [
    { label: translate('COMMON.ACTIONS.SAVE'), icon: <Check />, variant: "primary", func: onSave },
    { label: translate('COMMON.ACTIONS.CANCEL'), icon: <XmarkCircle />, variant: "danger", close: true, func: () => setIsOpen(false) },
  ];

  if (!isOpen) return null;

  return (
    <WindowDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={translate(id ? 'MENU_OPTIONS.EDIT.TITLE' : 'MENU_OPTIONS.NEW.TITLE')}
      description={translate(id ? 'MENU_OPTIONS.EDIT.SUB_TITLE' : 'MENU_OPTIONS.NEW.SUB_TITLE')}
      actions={(isPendingCreate || isPendingUpdate || isLoading) ? [] : actionsButtons}
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <form.Field name="applicationId" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION')}</Label>
              <Select
                aria-label={translate('MENU_OPTIONS.COMMON.FIELDS.APPLICATION')}
                value={field.state.value}
                onChange={(value) => {
                  form.setFieldValue('moduleId', '');
                  form.setFieldValue('actionId', '');
                  form.setFieldValue('parentMenuOptionId', parentMenuOptionId ?? null);

                  field.handleChange(value?.toString() ?? '');

                  const selectedApp = (applications ?? []).find((a) => a.id === value?.toString());

                  setApplicationCode(selectedApp?.code ?? '');
                  setApplicationId(selectedApp?.id ?? '');
                  setModuleId('');

                }}>
                <SelectTrigger>
                  <Buildings11 className="size-4.5 mr-1" />
                  <span className="truncate">
                    {(applications ?? []).find((a) => a.id === field.state.value)?.name
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
              <InputErrors form={form} field={field} />
            </TextField>
          )}>
          </form.Field>
        </div>

        <div className="sm:col-span-1">
          <form.Field name="moduleId" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.MODULE')}</Label>
              <Select
                aria-label={translate('MENU_OPTIONS.COMMON.FIELDS.MODULE')}
                value={field.state.value}
                onChange={(value) => {
                  form.setFieldValue('actionId', '');

                  field.handleChange(value?.toString() ?? '');

                  setModuleId(value?.toString() ?? null);
                }}>
                <SelectTrigger>
                  <Folder1 className="size-4.5 mr-1" />
                  <span className="truncate">
                    {(modules ?? []).find((m) => m.id === field.state.value)?.name
                      ?? translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MENU_OPTIONS.COMMON.FIELDS.MODULE') })}
                  </span>
                  <SelectIndicator />
                </SelectTrigger>
                <SelectContent>
                  {(modules ?? []).map((m) => (
                    <SelectItem key={m.id} id={m.id} textValue={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputErrors form={form} field={field} />
            </TextField>
          )}>
          </form.Field>
        </div>

        <div className="sm:col-span-1">
          <form.Field name="actionId" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.ACTION')}</Label>
              <Select
                aria-label={translate('MENU_OPTIONS.COMMON.FIELDS.ACTION')}
                value={field.state.value}
                onChange={(value) => field.handleChange(value?.toString() ?? '')}>
                <SelectTrigger>
                  <ChevronRight className="size-4.5 mr-1" />
                  <span className="truncate">
                    {(actions ?? []).find((a) => a.id === field.state.value)?.name
                      ?? translate('COMMON.MESSAGES.SELECT.REQUIRED', { field: translate('MENU_OPTIONS.COMMON.FIELDS.ACTION') })}
                  </span>
                  <SelectIndicator />
                </SelectTrigger>
                <SelectContent>
                  {(actions ?? []).map((a) => (
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
          <form.Field name="parentMenuOptionId" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.PARENT')}</Label>
              <Select
                aria-label={translate('MENU_OPTIONS.COMMON.FIELDS.PARENT')}
                value={field.state.value ?? ''}
                onChange={(value) => field.handleChange(value?.toString() ?? '')}>
                <SelectTrigger>
                  <span className="truncate">
                    {(parentOptions ?? []).find((o) => o.id === field.state.value)?.name
                      ?? translate('COMMON.MESSAGES.SELECT.ALL_1')}
                  </span>
                  <SelectIndicator />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="" textValue={translate('COMMON.MESSAGES.SELECT.ALL_1')}>
                    {translate('COMMON.MESSAGES.SELECT.ALL_1')}
                  </SelectItem>
                  {(parentOptions ?? []).filter((o) => o.id !== id).map((o) => (
                    <SelectItem key={o.id} id={o.id} textValue={o.name}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TextField>
          )}>
          </form.Field>
        </div>

        <div className="sm:col-span-1">
          <form.Field name="code" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.CODE')}</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start"><Code1 className="size-4.5" /></InputGroupAddon>
                <InputGroupInput
                  type="text" maxLength={64} id={field.name} name={field.name}
                  value={field.state.value} onBlur={field.handleBlur} className="sm:text-sm/4 ps-3"
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
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.NAME')}</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start"><MenuFriesLeft1 className="size-4.5" /></InputGroupAddon>
                <InputGroupInput
                  type="text" maxLength={256} id={field.name} name={field.name}
                  value={field.state.value} onBlur={field.handleBlur} className="sm:text-sm/4 ps-3"
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
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.DESCRIPTION')}</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start"><Folder1 className="size-4.5" /></InputGroupAddon>
                <InputGroupInput
                  type="text" maxLength={1024} id={field.name} name={field.name}
                  value={field.state.value} onBlur={field.handleBlur} className="sm:text-sm/4 ps-3"
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </InputGroup>
              <InputErrors form={form} field={field} />
            </TextField>
          )}>
          </form.Field>
        </div>

        <div className="sm:col-span-1">
          <form.Field name="menuUri" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.MENU_URI')}</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start"><Globe2 className="size-4.5" /></InputGroupAddon>
                <InputGroupInput
                  type="text" id={field.name} name={field.name}
                  value={field.state.value} onBlur={field.handleBlur} className="sm:text-sm/4 ps-3"
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </InputGroup>
              <InputErrors form={form} field={field} />
            </TextField>
          )}>
          </form.Field>
        </div>

        <div className="sm:col-span-1">
          <form.Field name="menuIcon" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.MENU_ICON')}</Label>
              <InputGroup>
                <InputGroupInput
                  type="text" id={field.name} name={field.name}
                  value={field.state.value} onBlur={field.handleBlur} className="sm:text-sm/4"
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </InputGroup>
              <InputErrors form={form} field={field} />
            </TextField>
          )}>
          </form.Field>
        </div>

        <div className="sm:col-span-1">
          <form.Field name="sortOrder" children={(field) => (
            <TextField className="flex flex-col gap-2">
              <Label className="sm:text-sm/4">{translate('MENU_OPTIONS.COMMON.FIELDS.SORT_ORDER')}</Label>
              <InputGroup>
                <InputGroupInput
                  type="number" min={0} max={999} id={field.name} name={field.name}
                  value={field.state.value} onBlur={field.handleBlur} className="sm:text-sm/4"
                  onChange={(event) => field.handleChange(Number(event.target.value))}
                />
              </InputGroup>
              <InputErrors form={form} field={field} />
            </TextField>
          )}>
          </form.Field>
        </div>

        {id && <div className="sm:col-span-1 mt-4">
          <form.Field name="isActive" children={(field) => (
            <Toggle
              label={translate("COMMON.STATUS.ACTIVE")}
              defaultChecked={menuOption?.isActive === true}
              onChange={() => field.handleChange(!field.state.value)}
            />
          )}>
          </form.Field>
        </div>}
      </div>
    </WindowDialog>
  );
}
