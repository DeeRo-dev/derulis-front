import * as React from "react";
import { cn } from "@/lib/utils";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
  /** Largo actual, para el contador. Requiere maxLength. */
  count?: number;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, error, hint, count, className, id, maxLength, ...props },
    ref,
  ) {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const messageId = `${fieldId}-message`;
    const showCount = typeof count === "number" && typeof maxLength === "number";

    return (
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
          {showCount ? (
            <span
              aria-hidden="true"
              className={cn(
                "text-xs tabular-nums",
                count > maxLength ? "text-error" : "text-muted",
              )}
            >
              {count}/{maxLength}
            </span>
          ) : null}
        </div>

        <textarea
          id={fieldId}
          ref={ref}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            "min-h-28 w-full resize-y rounded-xl bg-lilac-100 px-4 py-3 text-base text-foreground",
            "placeholder:text-muted outline-none transition",
            "focus:ring-2 focus:ring-primary",
            error && "ring-2 ring-error",
            className,
          )}
          {...props}
        />

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
