"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "../atoms/Button";

interface ActionsMenuProps {
    editLabel?: string;
    deleteLabel?: string;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ActionsMenu = ({
    editLabel = "Edit",
    deleteLabel = "Delete",
    onView,
    onEdit,
    onDelete,
}: ActionsMenuProps) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={menuRef} className="relative flex w-fit items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer hover:bg-primary/30 hover:border-primary/30 hover:text-primary"
                onClick={onView}
            >
                View Details
            </Button>

            <Button
                variant="outline"
                size="sm"
                startIcon={<Icon icon="tabler:dots-vertical" />}
                className="cursor-pointer hover:bg-primary/30 hover:border-primary/30 hover:text-primary"
                onClick={() => setOpen((o) => !o)}
            />

            {open && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-45 rounded-xl border border-border bg-surface shadow-lg">
                    <button
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10"
                        onClick={() => {
                            setOpen(false);
                            onEdit?.();
                        }}
                    >
                        <Icon icon="tabler:edit" />
                        {editLabel}
                    </button>

                    <button
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10"
                        onClick={() => {
                            setOpen(false);
                            onDelete?.();
                        }}
                    >
                        <Icon icon="tabler:trash" />
                        {deleteLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionsMenu;