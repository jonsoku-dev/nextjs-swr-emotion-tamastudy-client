import React from 'react';
import { SubmitHandler, useForm, UseFormMethods } from 'react-hook-form';

type FormProps<TFormValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  resolver: any;
  children: (methods: UseFormMethods<TFormValues>) => React.ReactNode;
};

export const HForm = <TFormValues extends Record<string, any> = Record<string, any>>({
  onSubmit,
  resolver,
  children
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    mode: 'onBlur',
    resolver
  });
  return <form onSubmit={methods.handleSubmit(onSubmit)}>{children(methods)}</form>;
};
