"use client";

import { useMemo, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import DataTable from "./DataTable";
import ActionsMenu from "../molecules/ActionsMenu";
import DevicesToolbar from "./DevicesToolbar";
import CursorPagination from "../molecules/CursorPagination";
import DeviceStatusBadge from "../atoms/DeviceStatusBadge";
import type { useDevicesPagination } from "@/hooks/useDevices";
import type { Device } from "@/types/device";

interface ListDevicesTableProps {
    onAddDevice: () => void;
    onViewDevice: (device: Device) => void;
    onEditDevice: (device: Device) => void;
    pagination: ReturnType<typeof useDevicesPagination>;
}

function ListDevicesTable({ onAddDevice, onViewDevice, onEditDevice, pagination }: ListDevicesTableProps) {
    const { data, isLoading, error, hasNext, hasPrevious, goNext, goPrevious, retry } =
        pagination;

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const columns = useMemo(
        () => [
            { accessorKey: "nama", header: "NAMA PERANGKAT" },
            { accessorKey: "mac_address", header: "MAC ADDRESS" },
            {
                accessorKey: "status",
                header: "STATUS",
                cell: ({ row }: CellContext<Device, unknown>) => (
                    <DeviceStatusBadge status={row.original.status} />
                ),
            },
            {
                id: "actions",
                header: "AKSI",
                enableSorting: false,
                cell: ({ row }: CellContext<Device, unknown>) => (
                    <ActionsMenu
                        editLabel="Edit Perangkat"
                        deleteLabel="Hapus Perangkat"
                        onView={() => onViewDevice(row.original)}
                        onEdit={() => onEditDevice(row.original)}
                        onDelete={() => console.log("delete", row.original.id)}
                    />
                ),
            },
        ],
        [onViewDevice, onEditDevice],
    );

    const filteredData = useMemo(() => {
        const q = search.trim().toLowerCase();
        return data.filter(
            (d) =>
                ((d.nama ?? "").toLowerCase().includes(q) ||
                    d.mac_address.toLowerCase().includes(q)) &&
                (statusFilter === "all" || d.status === statusFilter),
        );
    }, [data, search, statusFilter]);

    return (
        <DataTable<Device>
            data={filteredData}
            columns={columns}
            manualPagination
            error={error}
            isLoading={isLoading}
            onRetry={retry}
            emptyMessage="Belum ada data perangkat"
            toolbar={
                <DevicesToolbar
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    onAddDevice={onAddDevice}
                />
            }
            renderMobileCard={(d) => (
                <div className="border border-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-md">{d.nama}</p>
                            <p className="text-sm text-muted">{d.mac_address}</p>
                        </div>
                        <DeviceStatusBadge status={d.status} />
                    </div>
                    <div className="border-t border-border pt-3">
                        <ActionsMenu
                            editLabel="Edit Perangkat"
                            deleteLabel="Hapus Perangkat"
                            onView={() => onViewDevice(d)}
                            onEdit={() => onEditDevice(d)}
                            onDelete={() => console.log("delete", d.id)}
                        />
                    </div>
                </div>
            )}
            renderPagination={() => (
                <CursorPagination
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    loading={isLoading}
                    itemCount={filteredData.length}
                    itemLabel="perangkat"
                    onPrevious={goPrevious}
                    onNext={goNext}
                />
            )}
        />
    );
}

export default ListDevicesTable;