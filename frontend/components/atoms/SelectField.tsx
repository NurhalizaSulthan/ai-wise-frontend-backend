"use client";

import { FC, ReactNode, useEffect, useId, useRef, useState } from "react";
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
    const listId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    useEffect(() => {
        if (!open || activeIndex < 0) return;
        listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    const openMenu = () => {
        if (disabled) return;
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
    };

    const choose = (opt: Option) => {
        onChange?.(opt.value);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!open) openMenu();
                else setActiveIndex((i) => Math.min(i + 1, options.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!open) openMenu();
                else setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (!open) openMenu();
                else if (activeIndex >= 0 && options[activeIndex]) choose(options[activeIndex]);
                break;
            case "Escape":
                if (open) {
                    e.stopPropagation();
                    setOpen(false);
                }
                break;
            case "Tab":
                setOpen(false);
                break;
        }
    };

    return (
        <div ref={rootRef} className="relative">
            {name && <input type="hidden" name={name} value={value ?? ""} />}

            {startIcon && (
                <span className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center text-muted">
                    {startIcon}
                </span>
            )}

            <button
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                disabled={disabled}
                onClick={() => (open ? setOpen(false) : openMenu())}
                onKeyDown={handleKeyDown}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border-2 bg-surface px-5 py-3 text-left text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:border-border/40 disabled:bg-muted/10 disabled:text-muted/50 ${open ? "border-primary ring-2 ring-primary/20" : "border-muted/50"
                    } ${startIcon ? "pl-11" : ""} ${selected ? "text-foreground" : "text-muted"}`}
            >
                <span className="truncate">{selected ? selected.label : placeholder}</span>
                <Icon
                    icon="mdi:chevron-down"
                    className={`size-5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-lg"
                >
                    {options.length === 0 ? (
                        <li className="px-3 py-2.5 text-sm text-muted">Tidak ada pilihan</li>
                    ) : (
                        options.map((opt, i) => {
                            const isSelected = opt.value === value;
                            return (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => choose(opt)}
                                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${i === activeIndex ? "bg-primary/10" : ""
                                        } ${isSelected ? "font-semibold text-primary" : "text-foreground"}`}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && (
                                        <Icon icon="mdi:check" className="size-4 shrink-0" />
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
};

export default SelectField;