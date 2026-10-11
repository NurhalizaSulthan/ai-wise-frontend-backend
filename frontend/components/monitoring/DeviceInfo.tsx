// Suggested location in your project: components/monitoring/DeviceInfo.tsx
"use client";

import Link from "next/link";
import { formatRelativeTime, getDeviceByPublicId, isOnline } from "@/lib/devices";

interface DeviceInfoProps {
  publicId: string;
}

export const DeviceInfo = ({ publicId }: DeviceInfoProps) => {
  // Swap getDeviceByPublicId for a real fetch (e.g. GET /api/devices/[publicId])
  // once the endpoint is ready.
  const device = getDeviceByPublicId(publicId);

  if (!device) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Perangkat dengan ID tersebut tidak ditemukan.
        </p>
        <Link
          href="/monitoring"
          className="mt-3 inline-block text-sm font-medium text-green-600 hover:underline dark:text-green-400"
        >
          Kembali ke daftar perangkat
        </Link>
      </div>
    );
  }

  const online = isOnline(device.lastSeenAt);

  const details: { label: string; value: string }[] = [
    { label: "Public ID", value: device.publicId },
    { label: "MAC Address", value: device.macAddress },
    { label: "Nama Pekerja", value: device.pekerjaName },
    { label: "ID Pekerja", value: String(device.pekerjaId) },
    { label: "Terakhir Aktif", value: formatRelativeTime(device.lastSeenAt) },
    {
      label: "Terdaftar Sejak",
      value: new Date(device.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      label: "Terakhir Diperbarui",
      value: new Date(device.updatedAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <Link
        href="/monitoring"
        className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15.5L7 10l5.5-5.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Kembali ke daftar perangkat
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {device.pekerjaName}
          </h3>
          <p className="mt-1 font-mono text-sm text-gray-500 dark:text-gray-400">
            {device.macAddress}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            online
              ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              online ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {online ? "Online" : "Offline"}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {item.label}
            </dt>
            <dd className="mt-1 break-all text-sm text-gray-700 dark:text-gray-300">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};