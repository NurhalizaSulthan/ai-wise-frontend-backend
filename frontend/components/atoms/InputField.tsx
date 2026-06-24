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
    "h-11 w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-muted placeholder:text-muted/60 shadow-sm outline-none transition focus:ring-2";

  const iconPadding = `${startIcon ? "pl-11" : ""} ${endIcon ? "pr-11" : ""}`;

  const stateClasses = disabled
    ? "cursor-not-allowed border-muted/40 bg-muted/10 text-muted/50"
    : error
      ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/20"
      : success
        ? "border-green-500 text-green-600 focus:border-green-500 focus:ring-green-500/20"
        : "border-muted/30 focus:border-primary focus:ring-primary/20";

  const hintClasses = error
    ? "text-red-500"
    : success
      ? "text-green-500"
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