"use client";

import { Icon } from "@iconify/react";
import Input from "../atoms/InputField";
import Button from "../atoms/Button";
import FilterDropdown from "../molecules/FilterDropdown";

interface DevicesToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onAddDevice: () => void;
}

const STATUS_FILTER_OPTIONS = [
    { label: "Semua", value: "all" },
    { label: "Aktif", value: "aktif" },
    { label: "Tidak aktif", value: "tidak aktif" },
];

const DevicesToolbar = ({
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    onAddDevice,
}: DevicesToolbarProps) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
                <div className="flex-1">
                    <Input
                        className="h-12"
                        placeholder="Cari perangkat..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        startIcon={
                            <Icon icon="material-symbols:search-rounded" className="h-5 w-5" />
                        }
                    />
                </div>

                <FilterDropdown
                    value={statusFilter}
                    onChange={onStatusChange}
                    options={STATUS_FILTER_OPTIONS}
                />
            </div>

            <Button
                className="h-12 w-full tracking-wider sm:w-auto"
                startIcon={<Icon icon="material-symbols:add-rounded" className="size-5" />}
                onClick={onAddDevice}
            >
                Tambah Perangkat
            </Button>
        </div>
    );
};

export default DevicesToolbar;