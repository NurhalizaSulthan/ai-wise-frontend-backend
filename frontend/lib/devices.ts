import apiFetch from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { FetchDevicesResponse, FetchDevicesPageResponse, CreateDevice, CreateDeviceResponse, UpdateDeviceResponse, UpdateDevice, FetchDeviceDetailResponse } from '@/types/device';

// GET ALL DEVICES
const fetchDevices = (signal?: AbortSignal) => {
  return apiFetch<FetchDevicesResponse>(endpoints.devices, { signal });
};

interface PageParams {
  after?: string;
  before?: string;
}

// GET ALL DEVICES WITH PAGINATION
const fetchDevicesPage = (params: PageParams = {}, signal?: AbortSignal) => {
  const qs = new URLSearchParams();

  if (params.after) qs.set('after', params.after);
  else if (params.before) qs.set('before', params.before);

  const query = qs.toString();
  const url = `${endpoints.devices}/pagination${query ? `?${query}` : ''}`;
  return apiFetch<FetchDevicesPageResponse>(url, { signal });
};

// GET DETAIL DEVICE
const fetchDetailDevice = (publicId: string, signal: AbortSignal) =>
  apiFetch<FetchDeviceDetailResponse>(
    `${endpoints.devicesDetail}?public_id=${encodeURIComponent(publicId)}`,
    { signal },
  );

// CREATE DEVICE
const createDevice = (payload: CreateDevice, signal?: AbortSignal) => {
  return apiFetch<CreateDeviceResponse>(endpoints.devices, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
}

// UPDATE DEVICE
const updateDevice = (payload: UpdateDevice, signal?: AbortSignal) =>
  apiFetch<UpdateDeviceResponse>(endpoints.devices, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });


export { fetchDevices, fetchDevicesPage, fetchDetailDevice, createDevice, updateDevice };


// Suggested location in your project: lib/devices.ts
//
// ---------------------------------------------------------------
// Shared device types, dummy data & helpers used by both the
// active device list and the device detail page, so a device
// clicked on the list shows matching data on its detail page.
// Replace DUMMY_DEVICES with a real fetch/query once the API
// (e.g. GET /api/devices, GET /api/devices/:publicId) is ready.
// ---------------------------------------------------------------

export interface Device {
  id: number;
  publicId: string; // uuid
  pekerjaId: number;
  pekerjaName: string; // TODO: comes from joining the `pekerja` table
  macAddress: string;
  lastSeenAt: string; // ISO timestamp of the device's last heartbeat/ping
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export const DUMMY_DEVICES: Device[] = [
  {
    id: 1,
    publicId: "5c455705-0eac-48ae-9ffd-623740b38733",
    pekerjaId: 101,
    pekerjaName: "Fakhri Rasyad",
    macAddress: "d5:23:6a:16:fb:82",
    lastSeenAt: new Date(Date.now() - 15 * 1000).toISOString(),
    createdAt: "2025-01-12T08:30:00+08:00",
    updatedAt: new Date(Date.now() - 15 * 1000).toISOString(),
  },
  {
    id: 2,
    publicId: "1faf3b15-19c5-4e63-af7e-529b3413c755",
    pekerjaId: 102,
    pekerjaName: "Leonardo Aliyamin Nifinluri	",
    macAddress: "d5:8c:68:5d:5c:2f",
    lastSeenAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: "2025-02-03T09:00:00+08:00",
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    publicId: "39d060c2-6338-4c14-911c-48c57994d29a",
    pekerjaId: 103,
    pekerjaName: "Siti Nurhaliza",
    macAddress: "64:00:01:8b:8e:8e",
    lastSeenAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdAt: "2025-03-18T14:00:00+08:00",
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    publicId: "df026f36-2801-4581-963b-8bbc7b95b031",
    pekerjaId: 104,
    pekerjaName: "Nurfadillah Umar",
    macAddress: "9c:be:eb:a9:f1:d0",
    lastSeenAt: new Date(Date.now() - 45 * 1000).toISOString(),
    createdAt: "2025-04-22T10:15:00+08:00",
    updatedAt: new Date(Date.now() - 45 * 1000).toISOString(),
  },
];

// A device counts as "online" if it has sent a heartbeat within this window.
export const ONLINE_THRESHOLD_MS = 60 * 1000;

export function isOnline(lastSeenAt: string) {
  return Date.now() - new Date(lastSeenAt).getTime() <= ONLINE_THRESHOLD_MS;
}

export function formatRelativeTime(iso: string) {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return `${Math.floor(diffHour / 24)} hari lalu`;
}

export function getDeviceByPublicId(publicId: string): Device | undefined {
  return DUMMY_DEVICES.find((device) => device.publicId === publicId);
}