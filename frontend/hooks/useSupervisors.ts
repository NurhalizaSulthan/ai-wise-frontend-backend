import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/errors";
import { fetchSupervisor } from "@/lib/supervisor";
import { Supervisor } from "@/types/supervisor";

// GET ALL SUPERVISORS (PENGAWAS)
const useSupervisors = (enabled = true) => {
    const [data, setData] = useState<Supervisor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const json = await fetchSupervisor(controller.signal);
                setData(json.data ?? []);
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
                setData([]);
                setError(err instanceof ApiError ? err.message : "Gagal memuat supervisor");
            } finally {
                setIsLoading(false);
            }
        })();

        return () => controller.abort();
    }, [enabled]);

    return { data, isLoading, error };
};

export { useSupervisors };