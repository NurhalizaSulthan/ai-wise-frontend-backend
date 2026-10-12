import { useCallback, useEffect, useState } from "react";
import { createDevice, fetchDetailDevice, fetchDevices, fetchDevicesPage, updateDevice } from "@/lib/devices";
import { mapDevice } from "@/types/device";
import type { Device, CreateDevice, UpdateDevice, ApiDevice } from "@/types/device";
import { ApiError } from "@/lib/api/errors";

// GET ALL DEVICE
const useDevices = (enabled = true) => {
    const [data, setData] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const controller = new AbortController();

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const json = await fetchDevices(controller.signal);
                setData(json.data.map(mapDevice));
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof ApiError ? err.message : "Gagal memuat data perangkat");
            } finally {
                setIsLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, [enabled]);

    return { data, isLoading, error };
};

interface Cursor {
    after?: string;
    before?: string;
}

// GET ALL DEVICES PAGINATION
const useDevicesPagination = () => {
    const [data, setData] = useState<Device[]>([]);
    const [cursor, setCursor] = useState<Cursor>({});
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [previousCursor, setPreviousCursor] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const json = await fetchDevicesPage(cursor, controller.signal);
                const page = json.data;
                setData((page.data ?? []).map(mapDevice));
                setNextCursor(page.next_cursor);
                setPreviousCursor(page.previous_cursor);
                setHasNext(page.has_next);
                setHasPrevious(page.has_previous);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setError(err instanceof ApiError ? err.message : "Gagal memuat data perangkat");
            } finally {
                setIsLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, [cursor, reloadKey]);

    const goNext = useCallback(() => {
        if (hasNext && nextCursor) setCursor({ after: nextCursor });
    }, [hasNext, nextCursor]);

    const goPrevious = useCallback(() => {
        if (hasPrevious && previousCursor) setCursor({ before: previousCursor });
    }, [hasPrevious, previousCursor]);

    const retry = useCallback(() => setReloadKey((k) => k + 1), []);

    const refresh = useCallback(() => {
        setCursor({});
        setReloadKey((k) => k + 1);
    }, []);

    return { data, isLoading, error, hasNext, hasPrevious, goNext, goPrevious, retry, refresh };
};

// GET DETAIL DEVICE
const useDeviceDetail = (publicId?: string) => {
    const [data, setData] = useState<ApiDevice | null>(null);
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

        fetchDetailDevice(publicId, controller.signal)
            .then((res) => setData(res.data))
            .catch((e) => {
                if ((e as Error).name === "AbortError") return;
                setError(e instanceof ApiError ? e.message : "Gagal memuat data perangkat");
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [publicId, tick]);

    return { data, isLoading, error, refetch };
}

// CREATE DEVICE
const useCreateDevice = (onSuccess?: () => void) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (payload: CreateDevice): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createDevice(payload);
            onSuccess?.();
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal menambah perangkat");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [onSuccess]);

    const resetError = useCallback(() => setError(null), []);

    return { create, isSubmitting, error, resetError };
};

//UPDATE DEVICE
const useUpdateDevice = (onSuccess?: () => void) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(async (payload: UpdateDevice): Promise<boolean> => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateDevice(payload);
            onSuccess?.();
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal mengubah perangkat");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [onSuccess]);

    const resetError = useCallback(() => setError(null), []);

    return { update, isSubmitting, error, resetError };
}

export { useDevices, useDevicesPagination, useDeviceDetail, useCreateDevice, useUpdateDevice };