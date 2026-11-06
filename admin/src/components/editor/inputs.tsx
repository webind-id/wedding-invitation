"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { getIn, pathKey, type Path } from "@/lib/immutable";
import { fromLocalInput, toLocalInput } from "@/shared/contract";
import { useEditor } from "./EditorContext";

interface BaseProps {
  label: string;
  path: Path;
  hint?: ReactNode;
  className?: string;
}

/** Bungkus label + error + hint; menghubungkan aria-describedby. */
function FieldShell({
  label,
  path,
  hint,
  className,
  children,
}: BaseProps & { children: (a: { id: string; invalid: boolean; describedBy?: string }) => ReactNode }) {
  const { errors } = useEditor();
  const id = useId();
  const error = errors[pathKey(path)];
  const describedBy = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children({ id, invalid: Boolean(error), describedBy })}
      {error ? (
        <p id={`${id}-e`} className="error-text">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-h`} className="hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextInput({ placeholder, type = "text", ...props }: BaseProps & { placeholder?: string; type?: string }) {
  const { content, set } = useEditor();
  return (
    <FieldShell {...props}>
      {({ id, invalid, describedBy }) => (
        <input
          id={id}
          type={type}
          value={String(getIn(content, props.path) ?? "")}
          onChange={(e) => set(props.path, e.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn("input", invalid && "input-error")}
        />
      )}
    </FieldShell>
  );
}

export function TextArea({ rows = 3, dir, ...props }: BaseProps & { rows?: number; dir?: "rtl" }) {
  const { content, set } = useEditor();
  return (
    <FieldShell {...props}>
      {({ id, invalid, describedBy }) => (
        <textarea
          id={id}
          rows={rows}
          dir={dir}
          value={String(getIn(content, props.path) ?? "")}
          onChange={(e) => set(props.path, e.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn("input resize-y", invalid && "input-error", dir === "rtl" && "text-lg leading-loose")}
        />
      )}
    </FieldShell>
  );
}

export function SelectInput({
  options,
  ...props
}: BaseProps & { options: { value: string; label: string }[] }) {
  const { content, set } = useEditor();
  return (
    <FieldShell {...props}>
      {({ id, invalid, describedBy }) => (
        <select
          id={id}
          value={String(getIn(content, props.path) ?? "")}
          onChange={(e) => set(props.path, e.target.value)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn("input", invalid && "input-error")}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

/** Tanggal & jam dalam zona waktu undangan; disimpan sebagai ISO dengan offset. */
export function DateTimeInput(props: BaseProps) {
  const { content, set } = useEditor();
  const tz = content.timeZone;
  return (
    <FieldShell {...props}>
      {({ id, invalid, describedBy }) => (
        <input
          id={id}
          type="datetime-local"
          value={toLocalInput(String(getIn(content, props.path) ?? ""), tz)}
          onChange={(e) => set(props.path, fromLocalInput(e.target.value, tz))}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn("input", invalid && "input-error")}
        />
      )}
    </FieldShell>
  );
}
