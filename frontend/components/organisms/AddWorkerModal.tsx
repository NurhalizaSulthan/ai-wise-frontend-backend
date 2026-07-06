"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import flatpickr from "flatpickr";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.min.css";
import Input from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import Button from "../atoms/Button";

interface AddWorkerFormData {
    name: string;
    gender: string;
    birthDate: string;
    supervisor: string;
}

interface AddWorkerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: AddWorkerFormData) => void;
}

const GENDER_OPTIONS = [
    { label: "Male", value: "L" },
    { label: "Female", value: "P" },
];

const SUPERVISOR_OPTIONS = [
    { label: "SPV-001", value: "SPV-001" },
    { label: "SPV-002", value: "SPV-002" },
];

const AddWorkerModal = ({ isOpen, onClose, onSave }: AddWorkerModalProps) => {
    const [form, setForm] = useState<AddWorkerFormData>({
        name: "",
        gender: "",
        birthDate: "",
        supervisor: "",
    });

    const dateInputRef = useRef<HTMLInputElement>(null);
    const fpInstanceRef = useRef<FlatpickrInstance | null>(null);

    // Lock body scroll saat modal terbuka
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Tutup dengan ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Init flatpickr saat modal terbuka
    useEffect(() => {
        if (!isOpen || !dateInputRef.current) return;

        fpInstanceRef.current = flatpickr(dateInputRef.current, {
            dateFormat: "d/m/Y",
            altInput: false,
            allowInput: true,
            maxDate: "today",
            static: window.innerWidth < 640,
            onChange: (_selectedDates, dateStr) => {
                setForm((prev) => ({ ...prev, birthDate: dateStr }));
            },
        });

        return () => {
            fpInstanceRef.current?.destroy();
            fpInstanceRef.current = null;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (field: keyof AddWorkerFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave?.(form);
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-9999 overflow-y-auto bg-background/10 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
                <div
                    className="my-auto w-full max-w-2xl rounded-xl bg-surface shadow-2xl sm:rounded-2xl dark:bg-surface"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 px-4 pt-5 pb-4 sm:px-6 sm:pt-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/60 text-background sm:size-12">
                                <Icon icon="ic:round-person-add" className="size-5 sm:size-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                                    Add Worker
                                </h2>
                                <p className="text-xs leading-relaxed text-muted sm:text-sm">
                                    Add a new worker by entering their personal information
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-1 shrink-0 cursor-pointer rounded-full p-1.5 text-muted transition hover:bg-muted/10 hover:text-danger sm:p-2"
                        >
                            <Icon icon="iconamoon:close-duotone" className="size-5 sm:size-6" />
                        </button>
                    </div>

                    <div className="border-t border-border" />

                    {/* Form */}
                    <div className="flex flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-8 sm:py-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Name
                            </label>
                            <Input
                                placeholder="Enter your name..."
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Gender
                            </label>
                            <SelectField
                                placeholder="Select gender"
                                options={GENDER_OPTIONS}
                                value={form.gender}
                                onChange={(value) => handleChange("gender", value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Birth Date
                            </label>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="min-w-0 flex-1">
                                    <Input
                                        ref={dateInputRef}
                                        placeholder="DD/MM/YYYY"
                                        value={form.birthDate}
                                        onChange={(e) => handleChange("birthDate", e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fpInstanceRef.current?.open()}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-muted/50 text-muted transition hover:border-primary hover:text-primary sm:h-13 sm:w-13"
                                >
                                    <Icon
                                        icon="material-symbols:calendar-month-outline"
                                        className="size-5"
                                    />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Supervisor
                            </label>
                            <SelectField
                                placeholder="Select supervisor"
                                options={SUPERVISOR_OPTIONS}
                                value={form.supervisor}
                                onChange={(value) => handleChange("supervisor", value)}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-5 sm:px-8 sm:pb-8">
                        <Button className="w-full" onClick={handleSubmit}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddWorkerModal;