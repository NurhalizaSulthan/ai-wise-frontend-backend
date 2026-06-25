import React, { FC, ReactNode } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  startIcon,
  endIcon,
}) => {
  const baseClasses =
    "w-full rounded-lg border-2 border-border px-5 py-3 text-base text-muted placeholder:text-muted outline-none transition focus:ring-2";

  const iconPadding = `${startIcon ? "pl-11" : ""} ${endIcon ? "pr-11" : ""}`;

  const stateClasses = disabled
    ? "cursor-not-allowed border-border/40 bg-muted/10 text-muted/50"
    : error
      ? "border-danger/50 text-danger focus:border-danger focus:ring-danger/20"
      : success
        ? "border-primary/50 text-primary focus:border-primary focus:ring-primary/20"
        : "border-muted/50 focus:border-primary focus:ring-primary/20";

  const hintClasses = error
    ? "text-danger"
    : success
      ? "text-primary"
      : "text-muted";

  return (
    <div className="relative">
      <div className="relative">
        {startIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-muted">
            {startIcon}
          </span>
        )}

        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`${baseClasses} ${iconPadding} ${stateClasses} ${className}`}
        />

        {endIcon && (
          <span className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-muted">
            {endIcon}
          </span>
        )}
      </div>

      {hint && <p className={`mt-1.5 text-xs ${hintClasses}`}>{hint}</p>}
    </div>
  );
};

export default Input;