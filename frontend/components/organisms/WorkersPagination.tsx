"use client";

import { Icon } from "@iconify/react";
import { Table } from "@tanstack/react-table";

interface WorkersPaginationProps<TData = unknown> {
    table: Table<TData>;
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    totalItems: number;
}

const WorkersPagination = <TData,>({
    table,
    pagination,
    totalItems,
}: WorkersPaginationProps<TData>) => {
    return (
        <div className="mt-6 flex items-center justify-between pt-5">
            <p className="text-sm text-muted">
                Showing{" "}
                {pagination.pageIndex * pagination.pageSize + 1}
                {" "}to{" "}
                {Math.min(
                    (pagination.pageIndex + 1) *
                    pagination.pageSize,
                    totalItems
                )}
                {" "}of{" "}
                {totalItems}
                {" "}workers
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border cursor-pointer disabled:opacity-50"
                >
                    <Icon icon="heroicons:chevron-left" />
                </button>

                {Array.from(
                    { length: table.getPageCount() },
                    (_, i) => (
                        <button
                            key={i}
                            onClick={() =>
                                table.setPageIndex(i)
                            }
                            className={`h-10 w-10 rounded-lg ${pagination.pageIndex === i
                                ? "bg-primary text-background"
                                : "border border-border"
                                }`}
                        >
                            {i + 1}
                        </button>
                    )
                )}

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border cursor-pointer disabled:opacity-50"
                >
                    <Icon icon="heroicons:chevron-right" />
                </button>
            </div>
        </div>
    );
};

export default WorkersPagination;