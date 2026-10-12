"use client";

import { useMemo } from "react";
import TableStatus from "../atoms/TableStatus";
import ReadOnlyField from "../atoms/ReadOnlyField";
import DeviceStatusBadge from "../atoms/DeviceStatusBadge";
import PanelHeader from "../molecules/PanelHeader";
import { useDeviceDetail } from "@/hooks/useDevices";
import { mapDevice } from "@/types/device";

type PanelProps = {
    publicId: string;
    onClose: () => void;
};

const DeviceDetailPanel = ({ publicId, onClose }: PanelProps) => {
    const { data, isLoading, error, refetch } = useDeviceDetail(publicId);

    const device = useMemo(() => (data ? mapDevice(data) : null), [data]);

    const renderBody = () => {
        if (isLoading) return <TableStatus variant="loading" message="" />;
        if (error) return <TableStatus variant="error" message={error} onRetry={refetch} />;
        if (!device) return <TableStatus variant="empty" message="Perangkat tidak ditemukan" />;

        return (
            <div className="flex w-full flex-col gap-4">
                <section className="rounded-xl bg-surface">
                    <div className="flex items-start justify-between gap-3 border-b border-border p-5">
                        <div className="min-w-0">
                            <h3 className="truncate text-xl font-bold text-foreground">{device.nama}</h3>
                            <p className="mt-0.5 truncate font-mono text-sm text-muted">{device.public_id}</p>
                        </div>
                        <DeviceStatusBadge status={device.status} />
                    </div>

                    <div className="flex flex-col gap-4 p-5">
                        <ReadOnlyField label="MAC Address" value={device.mac_address} mono />
                    </div>
                </section>
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            <PanelHeader
                icon="solar:cpu-linear"
                title="Detail Perangkat"
                subtitle="Informasi perangkat terdaftar"
                onClose={onClose}
            />

            <div className="flex-1 overflow-y-auto p-4">{renderBody()}</div>
        </div>
    );
};

export default DeviceDetailPanel;