"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "../atoms/Button";

interface WorkerFilterDropdownProps {
    value: "all" | "L" | "P";
    onChange: (value: "all" | "L" | "P") => void;
}

const WorkerFilterDropdown = ({
    value,
    onChange,
}: WorkerFilterDropdownProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <Button
                variant="outline"
                onClick={() => setOpen(!open)}
                startIcon={<Icon icon="material-symbols:filter-list-rounded" />}
                endIcon={
                    <Icon
                        icon="material-symbols:keyboard-arrow-down-rounded"
                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                    />
                }
            >
                Filter
            </Button>

            {open && (
                <div className="absolute left-0 top-14 z-50 w-56 rounded-xl border border-border bg-surface p-4 shadow-lg
                                max-sm:left-auto max-sm:right-0">
                    <h4 className="mb-3 text-sm font-semibold">Gender</h4>

                    <div className="space-y-2">
                        {([
                            { label: "All", val: "all" },
                            { label: "Male", val: "L" },
                            { label: "Female", val: "P" },
                        ] as const).map(({ label, val }) => (
                            <label key={val} className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    checked={value === val}
                                    onChange={() => onChange(val)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerFilterDropdown;