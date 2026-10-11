"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "../atoms/Button";

interface FilterOption<T extends string> {
    label: string;
    value: T;
}

interface FilterDropdownProps<T extends string> {
    label?: string;
    value: T;
    options: FilterOption<T>[];
    onChange: (value: T) => void;
}

function FilterDropdown<T extends string>({
    label = "Filter",
    value,
    options,
    onChange,
}: FilterDropdownProps<T>) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? label;

    return (
        <div ref={dropdownRef} className="relative">
            <Button
                variant="outline"
                startIcon={<Icon icon="material-symbols:filter-list-rounded" className="h-5 w-5" />}
                className="h-11 cursor-pointer hover:bg-primary/30 hover:border-primary/30 hover:text-primary"
                onClick={() => setOpen(!open)}
            >
                {selectedLabel}
            </Button>

            {open && (
                <div className="absolute left-0 top-12 z-50 min-w-40 rounded-xl border border-border bg-surface shadow-lg">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 ${
                                opt.value === value ? "text-primary font-medium" : ""
                            }`}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FilterDropdown;