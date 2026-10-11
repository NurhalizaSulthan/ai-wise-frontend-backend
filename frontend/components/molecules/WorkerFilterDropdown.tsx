"use client";

import FilterDropdown from "./FilterDropdown";

interface WorkerFilterDropdownProps {
    value: "all" | "L" | "P";
    onChange: (value: "all" | "L" | "P") => void;
}

const WorkerFilterDropdown = ({ value, onChange }: WorkerFilterDropdownProps) => {
    return (
        <FilterDropdown
            label="Jenis Kelamin"
            value={value}
            onChange={onChange}
            options={[
                { label: "Semua", value: "all" },
                { label: "Laki-laki", value: "L" },
                { label: "Perempuan", value: "P" },
            ]}
        />
    );
};

export default WorkerFilterDropdown;