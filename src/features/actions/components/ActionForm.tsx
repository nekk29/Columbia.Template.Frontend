import { useEffect } from "react";
import { z as zod } from "zod";
import { useForm } from '@tanstack/react-form';
import { useTranslation } from "react-i18next";

import { Toggle } from "@/components/tailgrids/core/toggle";
import { InputErrors } from "@/components/shared/InputErrors";
import { WindowDialog } from "@/components/shared/WindowDialog";
import { Label, TextField } from "react-aria-components";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/tailgrids/core/input-group";
import { Check, XmarkCircle, Code1, MenuFriesLeft1, Folder1 } from "@tailgrids/icons";
import type { DialogAction } from "@/components/shared/AlertMessageDialog";

import { useDialogs } from "@/core/dialog/hooks/useDialogs";
import { useCreateAction, useGetAction, useUpdateAction } from "@/features/actions/hooks/actionsHooks";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { GetActionModel } from "@/features/actions/models/GetActionModel";
import type { UpdateActionModel } from "@/features/actions/models/UpdateActionModel";
import type { CreateActionModel } from "@/features/actions/models/CreateActionModel";

export interface ActionFormProps {
  id?: string | null;
  moduleId: string;
  parentActionId?: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function ActionForm({ id, moduleId, parentActionId, isOpen, setIsOpen, onSuccess }: ActionFormProps) {
  const { t: translate, i18n } = useTranslation();
  const { openToasts, openErrorToast } = useDialogs();

  const { data: actionResponse, isLoading } = useGetAction(id ?? '');
  const { data: action } = actionResponse ?? { data: null };

  const onSuccessfulResponse = (response: ResponseDto<GetActionModel>): void => {
    openToasts(response);
    if (response.isValid) {
      setIsOpen(false);
      onSuccess?.();
    }
  };

  const { mutate: create, isPending: isPendingCreate } = useCreateAction({
    onSuccess: (response: ResponseDto<GetActionModel>) => onSuccessfulResponse(response),
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const { mutate: update, isPending: isPendingUpdate } = useUpdateAction({
    onSuccess: (response: ResponseDto<GetActionModel>) => onSuccessfulResponse(response),
    onError: (error) => {
      openErrorToast("An unexpected error ocurred performing the operation");
      console.error(error);
    }
  });

  const formSchema = zod.object({
    id: zod.string(),
    moduleId: zod.string().nonempty(),
    parentActionId: zod.string().nullable(),
    code: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('ACTIONS.COMMON.FIELDS.CODE') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('ACTIONS.COMMON.FIELDS.CODE'), value: 4 }))
      .max(64, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('ACTIONS.COMMON.FIELDS.CODE'), value: 64 })),
    name: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_1', { field: translate('ACTIONS.COMMON.FIELDS.NAME') }))
      .min(4, translate('VALIDATION.TEXT.MIN_LENGTH', { field: translate('ACTIONS.COMMON.FIELDS.NAME'), value: 4 }))
      .max(256, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('ACTIONS.COMMON.FIELDS.NAME'), value: 256 })),
    description: zod.string()
      .max(1024, translate('VALIDATION.TEXT.MAX_LENGTH', { field: translate('ACTIONS.COMMON.FIELDS.DESCRIPTION'), value: 1024 })),
    isActive: zod.boolean()
  });

  const form = useForm({
    defaultValues: {
      id: id ?? '',
      moduleId,
      parentActionId: parentActionId ?? null,
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
    if (action) {
      form.reset(action);
      form.validate('change');
      form.validateAllFields('submit');
    } else {
      form.reset({
        id: '',
        moduleId,
        parentActionId: parentActionId ?? null,
        code: '',
        name: '',
        description: '',
        isActive: false
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, action, isOpen]);

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
      update(form.state.values as UpdateActionModel);
    } else {
      create(form.state.values as CreateActionModel);
    }
  }

  const actions: DialogAction[] = [
    { label: translate('COMMON.ACTIONS.SAVE'), icon: <Check />, variant: "primary", func: onSave },
    { label: translate('COMMON.ACTIONS.CANCEL'), icon: <XmarkCircle />, variant: "danger", close: true, func: () => setIsOpen(false) },
  ];

  if (!isOpen) return null;

  return (
    <WindowDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={translate(id ? 'ACTIONS.EDIT.TITLE' : 'ACTIONS.NEW.TITLE')}
      description={translate(id ? 'ACTIONS.EDIT.SUB_TITLE' : 'ACTIONS.NEW.SUB_TITLE')}
      actions={(isPendingCreate || isPendingUpdate || isLoading) ? [] : actions}
    >
      <div className="flex flex-col gap-4">
        <form.Field name="code" children={(field) => (
          <TextField className="flex flex-col gap-2">
            <Label className="sm:text-sm/4">
              {translate('ACTIONS.COMMON.FIELDS.CODE')}
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

        <form.Field name="name" children={(field) => (
          <TextField className="flex flex-col gap-2">
            <Label className="sm:text-sm/4">
              {translate('ACTIONS.COMMON.FIELDS.NAME')}
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

        <form.Field name="description" children={(field) => (
          <TextField className="flex flex-col gap-2">
            <Label className="sm:text-sm/4">
              {translate('ACTIONS.COMMON.FIELDS.DESCRIPTION')}
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

        {id && <form.Field name="isActive" children={(field) => (
          <Toggle
            label={translate("COMMON.STATUS.ACTIVE")}
            defaultChecked={action?.isActive === true}
            onChange={() => field.handleChange(!field.state.value)}
          />
        )}>
        </form.Field>}
      </div>
    </WindowDialog>
  );
}
