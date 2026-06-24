import { Icon } from "@iconify/react";
import type React from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
    >
      <div className="relative h-5 w-5">
        <input
          id={id}
          type="checkbox"
          className={`h-5 w-5 appearance-none rounded-md border border-muted bg-background cursor-pointer checked:border-transparent checked:bg-primary disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />

        {checked && (
          <Icon
            icon="mdi:check"
            className={`pointer-events-none absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 ${disabled ? "text-muted" : "text-background"
              }`}
          />
        )}
      </div>

      {label && (
        <span className="text-sm font-medium text-muted">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;