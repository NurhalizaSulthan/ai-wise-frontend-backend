import type { FetchSupervisorResponse } from "@/types/supervisor";
import apiFetch from "./api/client";
import { endpoints } from "./api/endpoints";


// GET ALL SUPERVISOR (PENGAWAS)
const fetchSupervisor = (signal?: AbortSignal) =>
    apiFetch<FetchSupervisorResponse>(endpoints.supervisors, { signal });

export { fetchSupervisor };