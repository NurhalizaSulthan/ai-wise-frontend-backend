"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Input from "../atoms/InputField";
import Button from "../atoms/Button";
import SelectField from "../atoms/SelectField";
import Alert from "../atoms/Alert";
import { useCreateDevice, useUpdateDevice } from "@/hooks/useDevices";
import type { Device } from "@/types/device";
import PanelHeader from "../molecules/PanelHeader";

interface DeviceFormData {
    name: string;
    mac: string;
    status: string;
}

type FieldErrors = Partial<Record<keyof DeviceFormData, string>>;

interface DeviceFormPanelProps {
    device?: Device;
    onClose: () => void;
    onSaved?: () => void;
}

const MAC_REGEX = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

const STATUS_OPTIONS = [
    { label: "Aktif", value: "aktif" },
    { label: "Tidak aktif", value: "tidak aktif" },
];

const getMacError = (mac: string): string | undefined => {
    if (!mac) return "MAC address wajib diisi";
    if (MAC_REGEX.test(mac)) return undefined;
    if (mac.includes("-")) return "Gunakan titik dua (:) sebagai pemisah, bukan strip (-)";
    if (/[^0-9A-Fa-f:]/.test(mac)) return "Hanya boleh berisi angka 0-9 dan huruf a-f";
    return "Format tidak lengkap. Gunakan 6 pasang karakter, contoh: a1:b2:c3:d4:e5:f6";
};

const formFromDevice = (d?: Device): DeviceFormData => ({
    name: d?.nama ?? "",
    mac: d?.mac_address ?? "",
    status: d?.status ?? "aktif",
});

const DeviceFormPanel = ({ device, onClose, onSaved }: DeviceFormPanelProps) => {
    const isEdit = !!device;
    const initialForm = useMemo(() => formFromDevice(device), [device]);

    const [form, setForm] = useState<DeviceFormData>(() => formFromDevice(device));
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const {
        create: submitCreate,
        isSubmitting: isCreating,
        error: createError,
        resetError: resetCreateError,
    } = useCreateDevice(onSaved);

    const {
        update: submitUpdate,
        isSubmitting: isUpdating,
        error: updateError,
        resetError: resetUpdateError,
    } = useUpdateDevice(onSaved);

    const isSubmitting = isEdit ? isUpdating : isCreating;
    const error = isEdit ? updateError : createError;

    const resetError = useCallback(() => {
        resetCreateError();
        resetUpdateError();
    }, [resetCreateError, resetUpdateError]);

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
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleClose]);

    const handleChange = (field: keyof DeviceFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async () => {
        resetError();

        const name = form.name.trim();
        const mac = form.mac.trim();

        const errors: FieldErrors = {};
        if (!name) errors.name = "Nama perangkat wajib diisi";
        const macError = getMacError(mac);
        if (macError) errors.mac = macError;

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const base = {
            nama: name,
            mac_address: mac.toLowerCase(),
        }

        const ok = isEdit
            ? await submitUpdate({ ...base, public_id: device.public_id, status: form.status })
            : await submitCreate({ ...base });

        if (ok) {
            toast.success(isEdit ? "Perangkat diperbarui" : "Perangkat ditambahkan", {
                description: isEdit
                    ? `Data ${name} berhasil diperbarui.`
                    : `${name} berhasil ditambahkan sebagai perangkat.`,
            });
            onSaved?.();
            handleClose();
        }
    };

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            {/* Header */}
            <PanelHeader
                icon={isEdit ? "solar:cpu-linear" : "solar:cpu-bolt-linear"}
                title={isEdit ? "Edit Perangkat" : "Tambah Perangkat"}
                subtitle={isEdit ? "Ubah data perangkat" : "Daftarkan perangkat baru"}
                onClose={handleClose}
            />
            {/* Form */}
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:gap-6 sm:px-6 sm:py-6">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                        Nama Perangkat
                    </label>
                    <Input
                        placeholder="Contoh: Device 1"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!fieldErrors.name}
                        hint={fieldErrors.name}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                        MAC Address
                    </label>
                    <Input
                        placeholder="Contoh: a1:b2:c3:d4:e5:f6"
                        value={form.mac}
                        onChange={(e) => handleChange("mac", e.target.value)}
                        error={!!fieldErrors.mac}
                        hint={fieldErrors.mac}
                    />
                </div>

                {isEdit && (
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">
                            Status
                        </label>
                        <SelectField
                            placeholder="Pilih status"
                            options={STATUS_OPTIONS}
                            value={form.status}
                            onChange={(value) => handleChange("status", value)}
                        />
                    </div>
                )}

                {error && (
                    <Alert
                        variant="error"
                        title={isEdit ? "Gagal memperbarui perangkat" : "Gagal menambahkan perangkat"}
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

export default DeviceFormPanel;