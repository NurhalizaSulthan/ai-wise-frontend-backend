import { ApiError, ApiErrorResponse } from "./errors";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiFetch = async <T>(
    path: string,
    options: RequestInit = {}
): Promise<T> => {
    const { headers, body, ...rest } = options;

    const mergedHeaders = new Headers(headers);
    if (typeof body === "string" && !mergedHeaders.has("Content-Type")) {
        mergedHeaders.set("Content-Type", "application/json");
    }

    const res = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        ...rest,
        headers: mergedHeaders,
        body,
    });

    if (!res.ok) {
        // Error bisa saja tanpa body JSON (misalnya 502 dari proxy)
        const errorBody = (await res.json().catch(() => null)) as ApiErrorResponse | null;

        throw new ApiError(
            errorBody?.status_code ?? res.status,
            errorBody?.code ?? "UNKNOWN_ERROR",
            errorBody?.message ?? "Terjadi kesalahan pada server"
        );
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json();
};

export default apiFetch;