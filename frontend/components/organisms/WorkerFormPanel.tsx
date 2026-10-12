"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import flatpickr from "flatpickr";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.min.css";
import Input from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import Button from "../atoms/Button";
import Alert from "../atoms/Alert";
import { useCreateWorker, useUpdateWorker } from "@/hooks/useWorkers";
import { useDevices } from "@/hooks/useDevices";
import { useSupervisors } from "@/hooks/useSupervisors";
import type { Worker, Gender } from "@/types/worker";
import { toApiDate, toDisplayDate } from "@/lib/utils";
import PanelHeader from "../molecules/PanelHeader";

interface WorkerFormData {
    name: string;
    gender: string;
    birthDate: string;
    device: string;
    supervisor: string;
}

type FieldErrors = Partial<Record<keyof WorkerFormData, string>>;

interface WorkerFormPanelProps {
    worker?: Worker;
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

const GENDER_OPTIONS = [
    { label: "Laki-laki", value: "L" },
    { label: "Perempuan", value: "P" },
];

const EMPTY_FORM: WorkerFormData = {
    name: "",
    gender: "",
    birthDate: "",
    device: "",
    supervisor: "",
};

const formFromWorker = (w?: Worker): WorkerFormData =>
    w
        ? {
            name: w.name,
            gender: w.gender,
            birthDate: toDisplayDate(w.birthDateIso),
            device: w.device?.public_id ?? "",
            supervisor: "",
        }
        : EMPTY_FORM;

const WorkerFormPanel = ({ worker, isOpen, onClose, onSaved }: WorkerFormPanelProps) => {
    const isEdit = !!worker;
    const initialForm = useMemo(() => formFromWorker(worker), [worker]);

    const [form, setForm] = useState<WorkerFormData>(initialForm);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const {
        create: submitCreate,
        isSubmitting: isCreating,
        error: createError,
        resetError: resetCreateError,
    } = useCreateWorker(onSaved);

    const {
        update: submitUpdate,
        isSubmitting: isUpdating,
        error: updateError,
        resetError: resetUpdateError,
    } = useUpdateWorker(onSaved);

    const isSubmitting = isEdit ? isUpdating : isCreating;
    const error = isEdit ? updateError : createError;

    const resetError = useCallback(() => {
        resetCreateError();
        resetUpdateError();
    }, [resetCreateError, resetUpdateError]);

    const { data: devices, isLoading: devicesLoading, error: devicesError } =
        useDevices(isOpen);

    const {
        data: supervisors,
        isLoading: supervisorsLoading,
        error: supervisorsError,
    } = useSupervisors(isOpen && !isEdit);

    const deviceOptions = useMemo(() => {
        const currentId = worker?.device?.public_id;

        const options = devices
            .filter((d) => !d.pekerja_id || d.public_id === currentId)
            .map((d) => ({
                label: `${d.nama} (${d.status})`,
                value: d.public_id,
            }));

        if (currentId && worker?.device && !options.some((o) => o.value === currentId)) {
            options.unshift({
                label: `${worker.device.nama || worker.device.mac_address} (saat ini)`,
                value: currentId,
            });
        }
        return options;
    }, [devices, worker]);

    const supervisorOptions = useMemo(
        () => supervisors.map((s) => ({ label: s.nama, value: s.public_id })),
        [supervisors],
    );

    useEffect(() => {
        if (!isEdit && !form.supervisor && supervisorOptions.length === 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm((prev) => ({ ...prev, supervisor: supervisorOptions[0].value }));
        }
    }, [isEdit, form.supervisor, supervisorOptions]);

    const dateInputRef = useRef<HTMLInputElement>(null);
    const fpInstanceRef = useRef<FlatpickrInstance | null>(null);

    const handleClose = useCallback(() => {
        setForm(initialForm);
        setFieldErrors({});
        resetError();
        onClose();
    }, [initialForm, onClose, resetError]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (!isOpen || !dateInputRef.current) return;

        fpInstanceRef.current = flatpickr(dateInputRef.current, {
            dateFormat: "d/m/Y",
            altInput: false,
            allowInput: true,
            maxDate: "today",
            defaultDate: initialForm.birthDate || undefined,
            onChange: (_selectedDates, dateStr) => {
                setForm((prev) => ({ ...prev, birthDate: dateStr }));
                setFieldErrors((prev) => ({ ...prev, birthDate: undefined }));
            },
        });

        return () => {
            fpInstanceRef.current?.destroy();
            fpInstanceRef.current = null;
        };
    }, [isOpen, initialForm.birthDate]);

    const handleChange = (field: keyof WorkerFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async () => {
        resetError();

        const name = form.name.trim();
        const birthDate = toApiDate(form.birthDate);

        const errors: FieldErrors = {};
        if (!name) errors.name = "Nama wajib diisi";
        if (!form.gender) errors.gender = "Pilih jenis kelamin";
        if (!form.birthDate) errors.birthDate = "Tanggal lahir wajib diisi";
        else if (!birthDate) errors.birthDate = "Format harus DD/MM/YYYY";
        if (!form.device) errors.device = "Pilih device";
        if (!isEdit && !form.supervisor) errors.supervisor = "Pilih supervisor";

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const base = {
            nama: name,
            jenis_kelamin: form.gender as Gender,
            tanggal_lahir: birthDate!,
            device_public_id: form.device,
        };

        const ok = isEdit
            ? await submitUpdate({ ...base, public_id: worker.public_id })
            : await submitCreate({ ...base, pengawas_public_id: form.supervisor });

        if (ok) {
            toast.success(isEdit ? "Pekerja diperbarui" : "Pekerja ditambahkan", {
                description: isEdit
                    ? `Data ${name} berhasil diperbarui.`
                    : `${name} berhasil ditambahkan sebagai pekerja.`,
            });
            handleClose();
        }
    };

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            {/* Header */}
            <PanelHeader
                icon={isEdit ? "ic:round-edit" : "ic:round-person-add"}
                title={isEdit ? "Edit Pekerja" : "Tambah Pekerja"}
                subtitle={isEdit ? "Ubah data pekerja" : "Daftarkan pekerja baru"}
                onClose={handleClose}
            />

            {/* Form */}
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:gap-6 sm:px-6 sm:py-6">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">Nama</label>
                    <Input
                        placeholder="Masukkan nama..."
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!fieldErrors.name}
                        hint={fieldErrors.name}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">Jenis Kelamin</label>
                    <SelectField
                        placeholder="Pilih jenis kelamin"
                        options={GENDER_OPTIONS}
                        value={form.gender}
                        onChange={(value) => handleChange("gender", value)}
                    />
                    {fieldErrors.gender && (
                        <p className="mt-1.5 text-xs text-danger">{fieldErrors.gender}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">Tanggal Lahir</label>
                    <div className="flex items-start gap-2 sm:gap-3">
                        <div className="min-w-0 flex-1">
                            <Input
                                ref={dateInputRef}
                                placeholder="DD/MM/YYYY"
                                value={form.birthDate}
                                onChange={(e) => handleChange("birthDate", e.target.value)}
                                error={!!fieldErrors.birthDate}
                                hint={fieldErrors.birthDate}
                            />
                        </div>
                        <Button variant="outline" onClick={() => fpInstanceRef.current?.open()} startIcon={<Icon icon="material-symbols:calendar-month-outline" className="size-5" />} className="h-13 w-12 shrink-0 border-2 hover:border-primary  transition hover:text-primary" />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">Device</label>
                    <SelectField
                        placeholder={devicesLoading ? "Memuat device..." : "Pilih device"}
                        options={deviceOptions}
                        value={form.device}
                        onChange={(value) => handleChange("device", value)}
                    />
                    {fieldErrors.device && (
                        <p className="mt-1.5 text-xs text-danger">{fieldErrors.device}</p>
                    )}
                    {devicesError && (
                        <p className="mt-1.5 text-xs text-danger">{devicesError}</p>
                    )}
                </div>

                {!isEdit && (
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">Supervisor</label>
                        <SelectField
                            placeholder={supervisorsLoading ? "Memuat supervisor..." : "Pilih supervisor"}
                            options={supervisorOptions}
                            value={form.supervisor}
                            onChange={(value) => handleChange("supervisor", value)}
                        />
                        {fieldErrors.supervisor && (
                            <p className="mt-1.5 text-xs text-danger">{fieldErrors.supervisor}</p>
                        )}
                        {supervisorsError && (
                            <p className="mt-1.5 text-xs text-danger">{supervisorsError}</p>
                        )}
                    </div>
                )}

                {error && (
                    <Alert
                        variant="error"
                        title={isEdit ? "Gagal memperbarui pekerja" : "Gagal menambahkan pekerja"}
                        onClose={resetError}
                    >
                        {error}
                    </Alert>
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border px-4 py-5 sm:px-6">
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
                </Button>
            </div>
        </div>
    );
};

export default WorkerFormPanel;