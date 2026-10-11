import { useCallback, useEffect, useState } from "react";
import { createDevice, fetchDevices, fetchDevicesPage, updateDevice } from "@/lib/devices";
import { mapDevice } from "@/types/device";
import type { Device, CreateDevice, UpdateDevice } from "@/types/device";
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

// CREATE DEVICE
const useCreateDevice = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (payload: CreateDevice): Promise<boolean> => {
        setIsPending(true);
        setError(null);
        try {
            await createDevice(payload);
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal menambah perangkat");
            return false;
        } finally {
            setIsPending(false);
        }
    }, []);

    const resetError = useCallback(() => setError(null), []);

    return { create, isPending, error, resetError };
};

//UPDATE DEVICE
const useUpdateDevice = () => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(async (payload: UpdateDevice): Promise<boolean> => {
        setIsPending(true);
        setError(null);
        try {
            await updateDevice(payload);
            return true;
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal mengubah perangkat");
            return false;
        } finally {
            setIsPending(false);
        }
    }, []);

    const resetError = useCallback(() => setError(null), []);

    return { update, isPending, error, resetError };
}

export { useDevices, useDevicesPagination, useCreateDevice, useUpdateDevice };