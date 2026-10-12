"use client";

import { useMemo } from "react";
import Card from "../atoms/Card";
import TableStatus from "../atoms/TableStatus";
import DeviceStatusBadge from "../atoms/DeviceStatusBadge";
import ReadOnlyField from "../atoms/ReadOnlyField";
import PanelHeader from "../molecules/PanelHeader";
import { useWorkerDetail } from "@/hooks/useWorkers";
import { mapWorker } from "@/types/worker";

type PanelProps = {
    publicId: string;
    onClose: () => void;
};

const WorkerDetailPanel = ({ publicId, onClose }: PanelProps) => {
    const { data, isLoading, error, refetch } = useWorkerDetail(publicId);

    const worker = useMemo(() => (data ? mapWorker(data) : null), [data]);

    const renderBody = () => {
        if (isLoading) return <TableStatus variant="loading" message="" />;
        if (error) return <TableStatus variant="error" message={error} onRetry={refetch} />;
        if (!worker) return <TableStatus variant="empty" message="Pekerja tidak ditemukan" />;

        return (
            <div className="flex w-full flex-col gap-4">
                {/* Data pekerja */}
                <section className="rounded-xl bg-surface">
                    <div className="border-b border-border p-5">
                        <h3 className="truncate text-xl font-bold text-foreground">{worker.name}</h3>
                        <p className="mt-0.5 truncate font-mono text-sm text-muted">{worker.public_id}</p>
                    </div>

                    <div className="flex flex-col gap-4 p-5">
                        <ReadOnlyField label="Jenis Kelamin" value={worker.genderLabel} />
                        <ReadOnlyField label="Tanggal Lahir" value={worker.birthDate} />
                    </div>
                </section>

                {/* Device */}
                <Card
                    title="Device"
                    icon="solar:cpu-linear"
                    right={worker.device && <DeviceStatusBadge status={worker.device.status} />}
                >
                    {worker.device ? (
                        <div className="flex flex-col gap-4">
                            <ReadOnlyField label="Nama" value={worker.device.nama} />
                            <ReadOnlyField label="MAC Address" value={worker.device.mac_address} mono />
                        </div>
                    ) : (
                        <TableStatus
                            variant="empty"
                            icon="solar:cpu-linear"
                            message="Belum ada device terpasang"
                        />
                    )}
                </Card>
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            <PanelHeader
                icon="healthicons:factory-worker-outline"
                title="Detail Pekerja"
                subtitle="Profil dan perangkat terhubung"
                onClose={onClose}
            />

            <div className="flex-1 overflow-y-auto p-4">{renderBody()}</div>
        </div>
    );
};

export default WorkerDetailPanel;