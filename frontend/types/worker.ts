import { formatDate } from "@/lib/utils";
import { ApiSuccessResponse, CursorPage } from "./api";

interface Telemetry {
    public_id: string;
    latitude: number;
    longitude: number;
    acc_x: number;
    acc_y: number;
    acc_z: number;
    gyro_x: number;
    gyro_y: number;
    gyro_z: number;
    pitch: number;
    roll: number;
    yaw: number;
    created_at: string;
}

interface ApiWorkerDevice {
    public_id: string;
    nama?: string;
    mac_address?: string;
    status?: string;
    telemetry?: Telemetry[];
}

type Gender = "L" | "P";

interface ApiWorker {
    public_id: string;
    nama: string;
    jenis_kelamin: Gender;
    tanggal_lahir: string; // ISO
    device?: ApiWorkerDevice | null;
}

type WorkersPage = CursorPage<ApiWorker>;

interface CreateWorkerPayload {
    nama: string;
    jenis_kelamin: Gender;
    tanggal_lahir: string;
    pengawas_public_id: string;
    device_public_id: string;
}

type UpdateWorkerPayload = Omit<CreateWorkerPayload, "pengawas_public_id"> & {
    public_id: string;
};

type FetchWorkersResponse = ApiSuccessResponse<ApiWorker[]>;
type FetchWorkersPageResponse = ApiSuccessResponse<WorkersPage>;
type CreateWorkerResponse = ApiSuccessResponse<ApiWorker | null>;
type UpdateWorkerResponse = ApiSuccessResponse<ApiWorker>;

interface WorkerDevice {
    public_id: string;
    nama: string;
    mac_address: string;
    status: string;
}

interface Worker {
    id: string;
    public_id: string;
    name: string;
    gender: Gender;
    genderLabel: string;
    birthDate: string;
    birthDateIso: string;
    device: WorkerDevice | null;
}

const GENDER_LABEL: Record<Gender, string> = {
    L: "Laki-laki",
    P: "Perempuan",
};

const mapWorker = (w: ApiWorker): Worker => ({
    id: w.public_id,
    public_id: w.public_id,
    name: w.nama,
    gender: w.jenis_kelamin,
    genderLabel: GENDER_LABEL[w.jenis_kelamin] ?? w.jenis_kelamin,
    birthDate: formatDate(w.tanggal_lahir),
    birthDateIso: w.tanggal_lahir,
    device: w.device
        ? {
            public_id: w.device.public_id,
            nama: w.device.nama ?? "",
            mac_address: w.device.mac_address ?? "",
            status: w.device.status ?? "",
        }
        : null,
});

export type {
    Telemetry,
    ApiWorkerDevice,
    ApiWorker,
    Gender,
    WorkersPage,
    CreateWorkerPayload,
    UpdateWorkerPayload,
    FetchWorkersResponse,
    FetchWorkersPageResponse,
    CreateWorkerResponse,
    UpdateWorkerResponse,
    WorkerDevice,
    Worker,
};
export { mapWorker, GENDER_LABEL };