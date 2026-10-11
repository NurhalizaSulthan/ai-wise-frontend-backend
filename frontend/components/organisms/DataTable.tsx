"use client";
import { Icon } from '@iconify/react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    PaginationState,
    Table,
} from '@tanstack/react-table';
import { ReactNode } from 'react';
import TableStatus from '../atoms/TableStatus';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T, unknown>[];
    pagination?: PaginationState;
    onPaginationChange?: (pagination: PaginationState) => void;
    manualPagination?: boolean;
    renderMobileCard: (row: T) => ReactNode;
    toolbar?: ReactNode;
    renderPagination: (table: Table<T>, totalItems: number) => ReactNode;
    error?: string | null;
    isLoading?: boolean;
    emptyMessage?: string;
    onRetry?: () => void;
}

function DataTable<T>({
    data,
    columns,
    pagination,
    onPaginationChange,
    manualPagination = false,
    renderMobileCard,
    toolbar,
    renderPagination,
    error,
    isLoading,
    emptyMessage = "Tidak ada data",
    onRetry,
}: DataTableProps<T>) {
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable<T>({
        data,
        columns,
        state: pagination ? { pagination } : {},
        manualPagination,
        pageCount: manualPagination ? -1 : undefined,
        onPaginationChange: pagination && onPaginationChange
            ? (updater) => {
                const next = typeof updater === 'function' ? updater(pagination) : updater;
                onPaginationChange(next);
            }
            : undefined,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),

    });
    const rows = table.getRowModel().rows;
    const status = error
        ? { variant: 'error' as const, message: error }
        : isLoading && rows.length === 0
            ? { variant: 'loading' as const, message: 'Mohon tunggu sebentar' }
            : rows.length === 0
                ? { variant: 'empty' as const, message: emptyMessage }
                : null;

    return (
        <div className="bg-surface border-border p-4 md:p-7 rounded-xl dark:bg-surface dark:border-border">
            {toolbar}

            {/* DESKTOP */}
            <div className="hidden lg:block">
                <table className="w-full border-collapse">
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
                                                {header.isPlaceholder ? null : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <Icon
                                                        icon={
                                                            sorted === "asc" ? "mdi:chevron-up"
                                                                : sorted === "desc" ? "mdi:chevron-down"
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
                        {status ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <TableStatus {...status} onRetry={onRetry} />
                                </td>
                            </tr>
                        ) : (
                            rows.map(row => (
                                <tr key={row.id} className="border-b border-border">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="flex flex-col gap-3 lg:hidden mt-4">
                {status ? (
                    <TableStatus {...status} onRetry={onRetry} />
                ) : (
                    rows.map(row => (
                        <div key={row.id}>{renderMobileCard(row.original)}</div>
                    ))
                )}
            </div>

            {renderPagination(table, data.length)}
        </div>
    );
}

export default DataTable;