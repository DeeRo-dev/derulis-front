import * as React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, icon, className, id, type = "text", ...props },
    ref,
  ) {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const messageId = `${fieldId}-message`;

    const isPassword = type === "password";
    const [visible, setVisible] = React.useState(false);
    const inputType = isPassword && visible ? "text" : type;

    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
          {label}
        </label>

        <div className="relative">
          {icon ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            >
              {icon}
            </span>
          ) : null}

          <input
            id={fieldId}
            ref={ref}
            type={inputType}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? messageId : undefined}
            className={cn(
              "h-12 w-full rounded-xl bg-lilac-100 text-base text-foreground",
              "placeholder:text-muted outline-none transition",
              "focus:ring-2 focus:ring-primary",
              icon ? "pl-11" : "pl-4",
              isPassword ? "pr-12" : "pr-4",
              error && "ring-2 ring-error",
              className,
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-lilac-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {visible ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          ) : null}
        </div>

        {error ? (
          <p id={messageId} role="alert" className="text-sm text-error">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
