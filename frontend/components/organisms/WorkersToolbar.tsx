"use client";

import { Icon } from "@iconify/react";
import Input from "../atoms/InputField";
import Button from "../atoms/Button";
import FilterDropdown from "../molecules/FilterDropdown";

interface WorkersToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    genderFilter: "all" | "L" | "P";
    onGenderChange: (value: "all" | "L" | "P") => void;
    onAddWorker: () => void;
}

const WorkersToolbar = ({
    search,
    onSearchChange,
    genderFilter,
    onGenderChange,
    onAddWorker,
}: WorkersToolbarProps) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
                <div className="flex-1">
                    <Input
                        className="h-12"
                        placeholder="Cari pekerja..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        startIcon={
                            <Icon icon="material-symbols:search-rounded" className="h-5 w-5" />
                        }
                    />
                </div>

                <FilterDropdown
                    value={genderFilter}
                    onChange={onGenderChange}
                    options={[
                        { label: "Semua", value: "all" },
                        { label: "Laki-laki", value: "L" },
                        { label: "Perempuan", value: "P" },
                    ]}
                />
            </div>

            <Button
                className="h-12 w-full tracking-wider sm:w-auto"
                startIcon={<Icon icon="material-symbols:add-rounded" className="size-5" />}
                onClick={onAddWorker}
            >
                Tambah Pekerja
            </Button>
        </div>
    );
};

export default WorkersToolbar;