import { useCallback, useEffect, useState } from "react";
import { mapWorker } from "@/types/worker";
import type { Worker, CreateWorkerPayload, UpdateWorkerPayload, ApiWorker } from "@/types/worker";
import { ApiError } from "@/lib/api/errors";
import { createWorker, updateWorker, fetchWorkersPage, fetchWorkerDetail } from "@/lib/workers";

type Cursor = { after?: string; before?: string };

// GET ALL WORKERS PAGINATION
const useWorkersPagination = (externalReloadKey = 0) => {
    const [cursor, setCursor] = useState<Cursor>({});
    const [reloadKey, setReloadKey] = useState(0);
    const [data, setData] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState({
        hasNext: false,
        hasPrevious: false,
        nextCursor: undefined as string | undefined,
        previousCursor: undefined as string | undefined,
    });

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const json = await fetchWorkersPage(cursor, controller.signal);
                const p = json.data;
                setData((p.data ?? []).map(mapWorker));
                setMeta({
                    hasNext: p.has_next,
                    hasPrevious: p.has_previous,
                    nextCursor: p.next_cursor ?? undefined,
                    previousCursor: p.previous_cursor ?? undefined,
                });
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setData([]);
                setMeta((m) => ({ ...m, hasNext: false, hasPrevious: false }));
                setError(err instanceof ApiError ? err.message : "Gagal memuat data pekerja");
            } finally {
                setIsLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, [cursor, reloadKey, externalReloadKey]);

    const goNext = useCallback(() => {
        if (meta.hasNext && meta.nextCursor) setCursor({ after: meta.nextCursor });
    }, [meta.hasNext, meta.nextCursor]);

    const goPrevious = useCallback(() => {
        if (meta.hasPrevious && meta.previousCursor) setCursor({ before: meta.previousCursor });
    }, [meta.hasPrevious, meta.previousCursor]);

    const retry = useCallback(() => setReloadKey((k) => k + 1), []);

    const refresh = useCallback(() => {
        setCursor({});
        setReloadKey((k) => k + 1);
    }, []);

    return {
        data,
        isLoading,
        error,
        hasNext: meta.hasNext,
        hasPrevious: meta.hasPrevious,
        goNext,
        goPrevious,
        retry,
        refresh,
    };
};

// GET DETAIL WORKER
const useWorkerDetail = (publicId?: string) => {
    const [data, setData] = useState<ApiWorker | null>(null);
    const [isLoading, setIsLoading] = useState(!!publicId);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refetch = useCallback(() => setTick((t) => t + 1), []);

    useEffect(() => {
        if (!publicId) return;
        const controller = new AbortController();

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        setError(null);

        fetchWorkerDetail(publicId, controller.signal)
            .then((res) => setData(res.data))
            .catch((e) => {
                if ((e as Error).name === "AbortError") return;
                setError(e instanceof ApiError ? e.message : "Gagal memuat data pekerja");
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [publicId, tick]);

    return { data, isLoading, error, refetch };
};


// CREATE WORKER
const useCreateWorker = (onSuccess?: () => void) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(
        async (payload: CreateWorkerPayload): Promise<boolean> => {
            setIsSubmitting(true);
            setError(null);
            try {
                await createWorker(payload);
                onSuccess?.();
                return true;
            } catch (err) {
                setError(err instanceof ApiError ? err.message : "Gagal menambahkan pekerja");
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [onSuccess],
    );

    const resetError = useCallback(() => setError(null), []);

    return { create, isSubmitting, error, resetError };
};

//UPDATE WORKER
const useUpdateWorker = (onSuccess?: () => void) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(
        async (payload: UpdateWorkerPayload): Promise<boolean> => {
            setIsSubmitting(true);
            setError(null);
            try {
                await updateWorker(payload);
                onSuccess?.();
                return true;
            } catch (err) {
                setError(err instanceof ApiError ? err.message : "Gagal memperbarui pekerja");
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [onSuccess],
    );

    const resetError = useCallback(() => setError(null), []);

    return { update, isSubmitting, error, resetError };
};


export { useWorkersPagination, useCreateWorker, useUpdateWorker, useWorkerDetail };