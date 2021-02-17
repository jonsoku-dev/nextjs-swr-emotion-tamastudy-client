import React from 'react';
import { SubmitHandler, useForm, UseFormMethods } from 'react-hook-form';
import { Mode } from 'react-hook-form/dist/types/form';

type FormProps<TFormValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  resolver: any;
  mode?: Mode;
  children: (methods: UseFormMethods<TFormValues>) => React.ReactNode;
};

export const HForm = <TFormValues extends Record<string, any> = Record<string, any>>({
  onSubmit,
  resolver,
  mode = 'onBlur',
  children
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    mode,
    resolver
  });

  React.useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      methods.reset();
    }
  }, [methods.formState.isSubmitSuccessful, methods.reset]);

  return (
    <form autoComplete="off" onSubmit={methods.handleSubmit(onSubmit)}>
      {children(methods)}
    </form>
  );
};
