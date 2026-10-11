import { ApiSuccessResponse, CursorPage } from "./api";

interface ApiDevice {
    public_id: string;
    pekerja_id: number | null;
    nama: string;
    mac_address: string;
    status: string;
}

type CreateDevice = Pick<ApiDevice, "nama" | "mac_address">;
type UpdateDevice = Omit<ApiDevice, "pekerja_id">;
type DevicesPage = CursorPage<ApiDevice>;

interface Device {
    id: string;
    public_id: string;
    pekerja_id: number | null;
    nama: string;
    mac_address: string;
    status: string;
}

type FetchDevicesResponse = ApiSuccessResponse<ApiDevice[]>;
type FetchDevicesPageResponse = ApiSuccessResponse<DevicesPage>;
type CreateDeviceResponse = ApiSuccessResponse<null>;
type UpdateDeviceResponse = ApiSuccessResponse<ApiDevice>;

const mapDevice = (d: ApiDevice): Device => ({
    id: d.public_id,
    public_id: d.public_id,
    pekerja_id: d.pekerja_id,
    nama: d.nama,
    mac_address: d.mac_address,
    status: d.status,
});

export type {
    ApiDevice,
    FetchDevicesResponse,
    FetchDevicesPageResponse,
    DevicesPage,
    Device,
    CreateDevice,
    CreateDeviceResponse,
    UpdateDevice,
    UpdateDeviceResponse,
};
export { mapDevice };