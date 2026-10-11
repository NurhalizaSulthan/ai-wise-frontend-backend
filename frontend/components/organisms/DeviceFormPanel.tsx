"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import Input from "../atoms/InputField";
import Button from "../atoms/Button";
import SelectField from "../atoms/SelectField";
import Alert from "../atoms/Alert";
import { useCreateDevice, useUpdateDevice } from "@/hooks/useDevices";
import type { Device } from "@/types/device";

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

    const [form, setForm] = useState<DeviceFormData>(() => formFromDevice(device));
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const createHook = useCreateDevice();
    const updateHook = useUpdateDevice();

    const isSubmitting = isEdit ? updateHook.isPending : createHook.isPending;
    const error = isEdit ? updateHook.error : createHook.error;

    const resetError = useCallback(() => {
        createHook.resetError();
        updateHook.resetError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createHook.resetError, updateHook.resetError]);

    const handleClose = useCallback(() => {
        setForm(formFromDevice(device));
        setFieldErrors({});
        resetError();
        onClose();
    }, [device, onClose, resetError]);

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

        const ok = isEdit
            ? await updateHook.update({
                public_id: device.public_id,
                nama: name,
                mac_address: mac.toLowerCase(),
                status: form.status,
            })
            : await createHook.create({
                nama: name,
                mac_address: mac.toLowerCase(),
            });

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
            <div className="flex shrink-0 items-start justify-between gap-2 px-4 pt-5 pb-4 sm:px-6 sm:pt-6">
                <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/60 text-background sm:size-12">
                        <Icon icon="mdi:tablet-cellphone" className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground sm:text-xl">
                            {isEdit ? "Edit Perangkat" : "Tambah Perangkat"}
                        </h2>
                        <p className="text-xs leading-relaxed text-muted sm:text-sm">
                            {isEdit
                                ? "Ubah data perangkat yang sudah terdaftar"
                                : "Tambahkan perangkat baru dengan mengisi data perangkat"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="mt-1 shrink-0 cursor-pointer rounded-full p-1.5 text-muted transition hover:bg-muted/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
                >
                    <Icon icon="iconamoon:close-duotone" className="size-5 sm:size-6" />
                </button>
            </div>

            <div className="shrink-0 border-t border-border" />

            {/* Form */}
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:gap-6 sm:px-6 sm:py-6">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                        Nama Perangkat
                    </label>
                    <Input
                        placeholder="Contoh: Device-1"
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