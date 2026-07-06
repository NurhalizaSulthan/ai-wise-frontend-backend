"use client";

import { FC, ReactNode } from "react";
import { Icon } from "@iconify/react";

interface Option {
    label: string;
    value: string;
}

interface SelectFieldProps {
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    options: Option[];
    onChange?: (value: string) => void;
    disabled?: boolean;
    startIcon?: ReactNode;
}

const SelectField: FC<SelectFieldProps> = ({
    id,
    name,
    placeholder = "Select...",
    value,
    options,
    onChange,
    disabled = false,
    startIcon,
}) => {
    return (
        <div className="relative">
            {startIcon && (
                <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-muted">
                    {startIcon}
                </span>
            )}

            <select
                id={id}
                name={name}
                value={value ?? ""}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full appearance-none rounded-lg border-2 border-muted/50 bg-surface px-5 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:border-border/40 disabled:bg-muted/10 disabled:text-muted/50 ${startIcon ? "pl-11" : ""
                    } ${value ? "text-foreground" : "text-muted"}`}
            >
                <option value="" disabled hidden>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-foreground">
                        {opt.label}
                    </option>
                ))}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-muted">
                <Icon icon="mdi:chevron-down" className="size-5" />
            </span>
        </div>
    );
};

export default SelectField;