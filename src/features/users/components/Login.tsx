import { useEffect, useState } from "react";
import { z as zod } from "zod";

import { useForm } from '@tanstack/react-form';
import { useTranslation } from "react-i18next";
import { useLogin } from "@/features/users/hooks/usersHooks";

import { Envelope1, Locked3 } from "@tailgrids/icons";
import { Label, TextField } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { InputErrors } from "@/components/shared/InputErrors";
import { LanguagePicker } from "@/components/shared/LanguagePicker";
import { AlertMessage, AlertMessages } from "@/components/shared/AlertMessage";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/tailgrids/core/input-group";

import companyLogo from "@/assets/images/logos/company.jpg";
import userLayoutBg from "@/assets/images/background/user-layout-bg.jpg";

import { environment } from "@/environments/environment";
import { AuthService } from "@/core/auth/services/auth.service";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { LoginResultModel } from "@/features/users/models/LoginResultModel";

export default function Login() {
  const { t: translate, i18n } = useTranslation();

  const [response, setResponse] = useState<ResponseDto<LoginResultModel> | null>(null);

  const { mutate: login, isPending, isError, error } = useLogin({
    onSuccess: (response: ResponseDto<LoginResultModel>) => {
      if (response.isValid) {
        AuthService.authenticate(response.data as LoginResultModel);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
        return;
      }
      setResponse(response);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  const formSchema = zod.object({
    username: zod.string()
      .email(translate('VALIDATION.EMAIL.INVALID', { field: translate('USERS.LOGIN.FORM.EMAIL') }))
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_2', { field: translate('USERS.LOGIN.FORM.EMAIL') })),
    password: zod.string()
      .nonempty(translate('VALIDATION.INPUT.REQUIRED_3', { field: translate('USERS.LOGIN.FORM.PASSWORD') }))
  });

  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    validators: {
      onChange: formSchema,
    },
  });

  // Update validations language
  useEffect(() => {
    if (form.state.isTouched) {
      form.validate('change')
    }
  }, [form, i18n.language]);

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formValue = form.state.values;

    login({
      applicationCode: environment.application.code,
      userName: formValue.username,
      password: formValue.password,
      returnUrl: window.location.href,
      rememberMe: false,
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${userLayoutBg})` }} >
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950/80">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-3xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="mb-4 flex justify-center">
            <img src={companyLogo} alt="Company" width={225} height={55} className="rounded-2xl border border-slate-700" />
          </div>

          <div className="mb-4 text-center">
            <h1 className="text-3xl font-semibold text-white">{translate("USERS.LOGIN.TITLE")}</h1>
            <p className="mt-2 text-sm text-slate-300">
              {translate("USERS.LOGIN.SUB_TITLE")}
            </p>
          </div>

          {response && (
            <AlertMessages className="mb-4" response={response} />
          )}

          {isError && error && (
            <AlertMessage className="mb-4" status="error" title="Error" description={error.message} />
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <form.Field name="username" children={(field) => (
                <TextField className="flex flex-col gap-2">
                  <Label className="sm:text-sm/4 text-white">
                    {translate("USERS.LOGIN.FORM.EMAIL")}
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
                      placeholder={translate("USERS.LOGIN.FORM.EMAIL_PLACEHOLDER")}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                  </InputGroup>
                  <InputErrors form={form} field={field} />
                </TextField>
              )}>
              </form.Field>
            </div>

            <div>
              <form.Field name="password" children={(field) => (
                <TextField className="flex flex-col gap-2">
                  <Label className="sm:text-sm/4 text-white">
                    {translate("USERS.LOGIN.FORM.PASSWORD")}
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
                      placeholder={translate("USERS.LOGIN.FORM.PASSWORD_PLACEHOLDER")}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                  </InputGroup>
                  <InputErrors form={form} field={field} />
                </TextField>
              )}>
              </form.Field>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="font-medium text-primary-200 hover:text-primary-100">
                {translate("USERS.LOGIN.FORM.FORGOT_PASSWORD")}
              </a>
              <div className="mb-2 flex justify-end">
                <LanguagePicker />
              </div>
            </div>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  size="sm"
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit || isPending}
                  className="w-full px-5 py-3 text-sm text-white font-semibold bg-primary-600 hover:bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                  {isSubmitting ? translate("USERS.LOGIN.FORM.SUBMIT_LOADING") : translate("USERS.LOGIN.FORM.SUBMIT")}
                </Button>
              )}
            />
          </form>
        </div>
      </div >
    </div >
  );
}
