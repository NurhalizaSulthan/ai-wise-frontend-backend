"use client";

import { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    CellContext,
} from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import WorkerActions from '../molecules/WorkerActions';
import WorkerAvatar from '../molecules/WorkerAvatar';
import GenderBadge from '../atoms/GenderBadge';
import WorkersToolbar from './WorkersToolbar';
import WorkersPagination from './WorkersPagination';

interface Worker {
    id: number;
    public_id: string;
    name: string;
    gender: string;
    birthDate: string;
    supervisor_id: string;
}

function ListWorkersTable() {
    const [data] = useState<Worker[]>([
        { id: 1, public_id: 'WR-001', name: 'Fakhri Rasyad', gender: 'L', birthDate: '01 Jan 2000', supervisor_id: 'SPV-001' },
        { id: 2, public_id: 'WR-002', name: 'Siti Nurhalizah', gender: 'P', birthDate: '02 Jan 2000', supervisor_id: 'SPV-002' },
        { id: 3, public_id: 'WR-003', name: 'Leonardo Nifinluri', gender: 'L', birthDate: '03 Jan 2000', supervisor_id: 'SPV-001' },
        { id: 4, public_id: 'WR-004', name: 'Nurfadillah Umar', gender: 'P', birthDate: '04 Jan 2000', supervisor_id: 'SPV-001' },
        { id: 5, public_id: 'WR-005', name: 'Nurfadillah Umar', gender: 'P', birthDate: '04 Jan 2000', supervisor_id: 'SPV-001' },
        { id: 6, public_id: 'WR-006', name: 'Nurfadillah Umar', gender: 'P', birthDate: '04 Jan 2000', supervisor_id: 'SPV-001' }
    ]);

    const columns = useMemo(() => [
        {
            id: "avatar",
            header: "",
            enableSorting: false,
            cell: ({ row }: CellContext<Worker, unknown>) => (<WorkerAvatar name={row.original.name} />),
        },
        {
            accessorKey: 'public_id',
            header: 'WORKER ID'
        },
        {
            accessorKey: 'name',
            header: 'NAME',
        },
        {
            accessorKey: "gender",
            header: "GENDER",
            cell: ({ row }: CellContext<Worker, unknown>) => (<GenderBadge gender={row.original.gender} />),
        },
        {
            accessorKey: 'birthDate',
            header: 'BIRTH DATE',
        },
        {
            accessorKey: 'supervisor_id',
            header: 'SUPERVISOR ID',
        },
        {
            id: 'actions',
            header: 'ACTIONS',
            enableSorting: false,
            cell: () => <WorkerActions />,
        },
    ], []);

    const [search, setSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState<"all" | "L" | "P">("all");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const filteredData = useMemo(() => {
        return data.filter((worker) => {
            const matchesSearch =
                worker.name.toLowerCase().includes(search.toLowerCase()) ||
                worker.public_id.toLowerCase().includes(search.toLowerCase()) ||
                worker.supervisor_id.toLowerCase().includes(search.toLowerCase());

            const matchesGender =
                genderFilter === "all" ||
                worker.gender === genderFilter;

            return matchesSearch && matchesGender;
        });
    }, [data, search, genderFilter]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable<Worker>({
        data: filteredData,
        columns,
        state: {
            pagination,
        },

        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    return (
        <div className="bg-surface border-border p-7 rounded-xl dark:bg-surface dark:border-border" >
            <WorkersToolbar
                search={search}
                onSearchChange={setSearch}
                genderFilter={genderFilter}
                onGenderChange={setGenderFilter}
            />
            <table className='w-full border-collapse'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const sorted = header.column.getIsSorted();

                                return (
                                    <th
                                        key={header.id}
                                        className="p-3 text-start text-base font-semibold uppercase tracking-wider text-muted border-b-2 border-t-2 border-border"
                                        onClick={header.column.getCanSort()
                                            ? header.column.getToggleSortingHandler()
                                            : undefined}
                                    >
                                        <div className="flex items-center gap-3">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                            {header.column.getCanSort() && (
                                                <Icon
                                                    icon={
                                                        sorted === "asc"
                                                            ? "mdi:chevron-up"
                                                            : sorted === "desc"
                                                                ? "mdi:chevron-down"
                                                                : "mdi:unfold-more-horizontal"
                                                    }
                                                    className="h-3 w-3 text-muted/60"
                                                />
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='border-b border-border'>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className='p-4'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <WorkersPagination
                table={table}
                pagination={pagination}
                totalItems={filteredData.length}
            />
        </div>
    );
}

export default ListWorkersTable;