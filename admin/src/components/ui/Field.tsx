import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  /** Render input; terima id & props aria agar label/error tersambung. */
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => ReactNode;
}

export function Field({ label, error, hint, className, children }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        className: cn("input", error && "input-error"),
      })}
      {error ? (
        <p id={`${id}-err`} className="error-text">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger">
      {message}
    </p>
  );
}
