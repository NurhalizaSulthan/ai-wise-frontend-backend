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
    publicId: "b6d1f2b0-2f3a-4b9a-9d3f-3f1a2f4b5c6d",
    pekerjaId: 101,
    pekerjaName: "Andi Saputra",
    macAddress: "24:6F:28:AB:3C:11",
    lastSeenAt: new Date(Date.now() - 15 * 1000).toISOString(),
    createdAt: "2025-01-12T08:30:00+08:00",
    updatedAt: new Date(Date.now() - 15 * 1000).toISOString(),
  },
  {
    id: 2,
    publicId: "a1e2c3d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    pekerjaId: 102,
    pekerjaName: "Budi Santoso",
    macAddress: "3C:71:BF:0A:9E:22",
    lastSeenAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: "2025-02-03T09:00:00+08:00",
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    publicId: "d4c3b2a1-6e5f-4d3c-8b7a-0f9e8d7c6b5a",
    pekerjaId: 103,
    pekerjaName: "Citra Lestari",
    macAddress: "A0:B1:C2:D3:E4:F5",
    lastSeenAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdAt: "2025-03-18T14:00:00+08:00",
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    publicId: "f7e6d5c4-3b2a-1908-7f6e-5d4c3b2a1908",
    pekerjaId: 104,
    pekerjaName: "Dewi Anggraini",
    macAddress: "5C:CF:7F:11:22:33",
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