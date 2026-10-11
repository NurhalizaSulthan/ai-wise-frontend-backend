import type {
    FetchWorkersResponse,
    FetchWorkersPageResponse,
    CreateWorkerPayload,
    CreateWorkerResponse,
    UpdateWorkerPayload,
    UpdateWorkerResponse,
} from "@/types/worker";
import apiFetch from "./api/client";
import { endpoints } from "./api/endpoints";

// GET ALL WORKERS
const fetchWorkers = (signal?: AbortSignal) => {
    return apiFetch<FetchWorkersResponse>(endpoints.workers, { signal });
};

// GET ALL WORKER WITH PAGINATION
const fetchWorkersPage = (
    cursor: { after?: string; before?: string },
    signal?: AbortSignal,
) => {
    const params = new URLSearchParams();
    if (cursor.after) params.set("after", cursor.after);
    else if (cursor.before) params.set("before", cursor.before);
    const qs = params.toString();

    return apiFetch<FetchWorkersPageResponse>(
        `${endpoints.workersPagination}${qs ? `?${qs}` : ""}`,
        { signal },
    );
};

// CREATE WORKER
const createWorker = (payload: CreateWorkerPayload, signal?: AbortSignal) =>
    apiFetch<CreateWorkerResponse>(endpoints.workers, {
        method: "POST",
        body: JSON.stringify(payload),
        signal,
    });

// UPDATE WORKER
const updateWorker = (payload: UpdateWorkerPayload, signal?: AbortSignal) =>
    apiFetch<UpdateWorkerResponse>(endpoints.workers, {
        method: "PUT",
        body: JSON.stringify(payload),
        signal,
    });

export { fetchWorkers, fetchWorkersPage, createWorker, updateWorker };