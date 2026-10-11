"use client";

import { Icon } from "@iconify/react";

interface CursorPaginationProps {
    hasPrevious: boolean;
    hasNext: boolean;
    loading?: boolean;
    itemCount: number;
    itemLabel: string;
    onPrevious: () => void;
    onNext: () => void;
}

const CursorPagination = ({
    hasPrevious,
    hasNext,
    loading,
    itemCount,
    itemLabel,
    onPrevious,
    onNext,
}: CursorPaginationProps) => {
    const btn =
        "flex h-10 w-10 items-center justify-center rounded-lg border border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="mt-6 flex items-center justify-between pt-5">
            <p className="text-sm text-muted">
                {loading ? "Memuat..." : `Menampilkan ${itemCount} ${itemLabel}`}
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPrevious}
                    disabled={!hasPrevious || loading}
                    className={btn}
                    aria-label="Halaman sebelumnya"
                >
                    <Icon icon="heroicons:chevron-left" />
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasNext || loading}
                    className={btn}
                    aria-label="Halaman berikutnya"
                >
                    <Icon icon="heroicons:chevron-right" />
                </button>
            </div>
        </div>
    );
};

export default CursorPagination;