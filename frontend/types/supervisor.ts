import type { ApiSuccessResponse } from "./api";

interface Supervisor {
    public_id: string;
    nama: string;
    role: string;
}

type FetchSupervisorResponse = ApiSuccessResponse<Supervisor[]>;

export type { Supervisor, FetchSupervisorResponse };