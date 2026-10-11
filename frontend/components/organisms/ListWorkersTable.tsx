"use client";

import { useMemo, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import DataTable from "./DataTable";
import WorkerAvatar from "../molecules/WorkerAvatar";
import GenderBadge from "../atoms/GenderBadge";
import WorkersToolbar from "./WorkersToolbar";
import ActionsMenu from "../molecules/ActionsMenu";
import CursorPagination from "../molecules/CursorPagination";
import type { useWorkersPagination } from "@/hooks/useWorkers";
import type { Worker } from "@/types/worker";

interface ListWorkersTableProps {
    onAddWorker: () => void;
    onEditWorker: (worker: Worker) => void;
    pagination: ReturnType<typeof useWorkersPagination>;
}

function ListWorkersTable({ onAddWorker, onEditWorker, pagination }: ListWorkersTableProps) {
    const { data, isLoading, error, hasNext, hasPrevious, goNext, goPrevious, retry } =
        pagination;

    const [search, setSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState<"all" | "L" | "P">("all");

    const columns = useMemo(
        () => [
            {
                id: "avatar",
                header: "",
                enableSorting: false,
                cell: ({ row }: CellContext<Worker, unknown>) => (
                    <WorkerAvatar name={row.original.name} />
                ),
            },
            { accessorKey: "name", header: "NAMA" },
            {
                accessorKey: "gender",
                header: "JENIS KELAMIN",
                cell: ({ row }: CellContext<Worker, unknown>) => (
                    <GenderBadge gender={row.original.gender} />
                ),
            },
            { accessorKey: "birthDate", header: "TANGGAL LAHIR" },
            {
                id: "actions",
                header: "AKSI",
                enableSorting: false,
                cell: ({ row }: CellContext<Worker, unknown>) => (
                    <ActionsMenu
                        editLabel="Edit Pekerja"
                        deleteLabel="Hapus Pekerja"
                        onEdit={() => onEditWorker(row.original)}
                        onDelete={() => console.log("delete", row.original.id)}
                    />
                ),
            },
        ],
        [onEditWorker],
    );

    const filteredData = useMemo(() => {
        const q = search.trim().toLowerCase();
        return data.filter(
            (w) =>
                w.name.toLowerCase().includes(q) &&
                (genderFilter === "all" || w.gender === genderFilter),
        );
    }, [data, search, genderFilter]);

    return (
        <DataTable<Worker>
            data={filteredData}
            columns={columns}
            manualPagination
            error={error}
            isLoading={isLoading}
            onRetry={retry}
            emptyMessage="Belum ada data pekerja"
            toolbar={
                <WorkersToolbar
                    search={search}
                    onSearchChange={setSearch}
                    genderFilter={genderFilter}
                    onGenderChange={setGenderFilter}
                    onAddWorker={onAddWorker}
                />
            }
            renderMobileCard={(w) => (
                <div className="border border-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <WorkerAvatar name={w.name} />
                            <p className="font-semibold text-sm">{w.name}</p>
                        </div>
                        <GenderBadge gender={w.gender} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-muted font-medium uppercase tracking-wide">
                                Tanggal Lahir
                            </p>
                            <p className="font-medium">{w.birthDate}</p>
                        </div>
                    </div>
                    <div className="border-t border-border pt-3">
                        <ActionsMenu
                            editLabel="Edit Pekerja"
                            deleteLabel="Hapus Pekerja"
                            onEdit={() => onEditWorker(w)}
                            onDelete={() => console.log("delete", w.id)}
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
                    itemLabel="pekerja"
                    onPrevious={goPrevious}
                    onNext={goNext}
                />
            )}
        />
    );
}

export default ListWorkersTable;