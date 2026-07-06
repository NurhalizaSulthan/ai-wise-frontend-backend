"use client";

import { Icon } from "@iconify/react";
import Input from "../atoms/InputField";
import Button from "../atoms/Button";
import WorkerFilterDropdown from "../molecules/WorkerFilterDropdown";
import { useState } from "react";
import AddWorkerModal from "./AddWorkerModal";

interface WorkersToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    genderFilter: "all" | "L" | "P";
    onGenderChange: (value: "all" | "L" | "P") => void;
}

const WorkersToolbar = ({
    search,
    onSearchChange,
    genderFilter,
    onGenderChange,
}: WorkersToolbarProps) => {
    const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="w-full sm:w-80">
                    <Input
                        placeholder="Search worker..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        startIcon={
                            <Icon
                                icon="material-symbols:search-rounded"
                                className="h-5 w-5"
                            />
                        }
                    />
                </div>

                <WorkerFilterDropdown
                    value={genderFilter}
                    onChange={onGenderChange}
                />
            </div>

            <Button
                startIcon={
                    <Icon
                        icon="material-symbols:add-rounded"
                        className="size-5"
                    />
                }
                className="w-full tracking-wider sm:w-auto"
                onClick={() => setIsAddWorkerOpen(true)}
            >
                Add Worker
            </Button>
            <AddWorkerModal
                isOpen={isAddWorkerOpen}
                onClose={() => setIsAddWorkerOpen(false)}
            />

        </div>
    );
};

export default WorkersToolbar;