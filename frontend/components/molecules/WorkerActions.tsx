"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "../atoms/Button";

const WorkerActions = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div ref={menuRef} className="relative flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer hover:bg-primary/30 hover:border-primary/30 hover:text-primary"
            >
                View Details
            </Button>

            <Button
                variant="outline"
                size="sm"
                startIcon={<Icon icon="tabler:dots-vertical" />}
                className="cursor-pointer hover:bg-primary/30 hover:border-primary/30 hover:text-primary"
                onClick={() => setOpen(!open)}
            />

            {open && (
                <div className="absolute right-0 top-12 z-50 min-w-45 rounded-xl border border-border bg-surface shadow-lg">
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10">
                        <Icon icon="tabler:edit" />
                        Edit Worker
                    </button>

                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10">
                        <Icon icon="tabler:trash" />
                        Delete Worker
                    </button>
                </div>
            )}
        </div>
    );
}

export default WorkerActions;