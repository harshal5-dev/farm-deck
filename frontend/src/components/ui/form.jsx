import * as React from "react";
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Form = FormProvider;

const FormFieldContext = React.createContext({});

const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItemContext = React.createContext({});

function FormItem({ className, ...props }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ children, ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  const ariaDescribedBy = !error
    ? formDescriptionId
    : `${formDescriptionId} ${formMessageId}`;

  const formProps = {
    id: props.id ?? formItemId,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": !!error,
  };

  // Walk the children tree and merge `props` onto the first form control
  // (Input, Textarea, or a host <input>/<textarea>/<select>) we find. This
  // keeps the label's htmlFor → input id binding intact even when the
  // immediate child is a wrapper <div> that holds an icon + the actual
  // form control.
  const FORM_CONTROL_COMPONENTS = new Set([Input, Textarea]);
  const FORM_CONTROL_TAGS = new Set(["input", "textarea", "select"]);
  const isFormControlElement = (node) => {
    if (!React.isValidElement(node)) return false;
    if (typeof node.type === "string") return FORM_CONTROL_TAGS.has(node.type);
    return FORM_CONTROL_COMPONENTS.has(node.type);
  };

  const injectProps = (node, injectedProps, state) => {
    if (state.done) return node;
    if (!React.isValidElement(node)) return node;
    if (isFormControlElement(node)) {
      state.done = true;
      return React.cloneElement(node, injectedProps);
    }
    const childChildren = node.props?.children;
    if (childChildren === undefined || childChildren === null) return node;
    const nextChildren = Array.isArray(childChildren)
      ? React.Children.map(childChildren, (child) =>
          injectProps(child, injectedProps, state)
        )
      : injectProps(childChildren, injectedProps, state);
    if (state.done) {
      return React.cloneElement(node, { children: nextChildren });
    }
    return node;
  };

  return injectProps(children, { ...formProps, ...props }, { done: false });
}

function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
