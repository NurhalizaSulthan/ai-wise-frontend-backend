"use client";

import FilterDropdown from "./FilterDropdown";

interface DeviceFilterDropdownProps {
    value: "all" | "active" | "inactive";
    onChange: (value: "all" | "active" | "inactive") => void;
}

const DeviceFilterDropdown = ({ value, onChange }: DeviceFilterDropdownProps) => {
    return (
        <FilterDropdown
            label="Status"
            value={value}
            onChange={onChange}
            options={[
                { label: "Semua", value: "all" },
                { label: "Aktif", value: "active" },
                { label: "Nonaktif", value: "inactive" },
            ]}
        />
    );
};

export default DeviceFilterDropdown;