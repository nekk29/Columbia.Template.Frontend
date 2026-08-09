/* eslint-disable @typescript-eslint/no-explicit-any */
interface InputErrorsProps {
  form: any
  field: any,
  language?: string
}

export function InputErrors({ form, field, language }: InputErrorsProps) {
  return (
    <>
      {form.state.isTouched && field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <p className="mt-0 peer-invalid:block text-xs text-red-600">
          {field.state.meta.errors.at(0)?.message} {language}
        </p>
      ) : null}
    </>
  )
}
