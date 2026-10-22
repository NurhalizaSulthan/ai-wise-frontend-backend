"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DUMMY_DEVICES,
  formatRelativeTime,
  isOnline,
  type Device,
} from "@/lib/devices";
import { ApiDevice } from "@/types/device";
import { ApiWorker, mapWorker } from "@/types/worker";
import { useWorkers } from "@/hooks/useWorkers";

export const ActiveDeviceList = () => {
  // Swap useState(DUMMY_DEVICES) for a real fetch (React Query / SWR / server action)
  // when the API is ready. Keeping it in state already makes it easy to later
  // re-fetch on an interval for "real-time" polling.

  // const onlineCount = useMemo(
  //   () => devices.filter((d) => isOnline(d.lastSeenAt)).length,
  //   [devices],
  // );

  const { data, isLoading, error } = useWorkers();

  const workers = useMemo(
    () => (data ? data.map((d) => mapWorker(d)) : null),
    [data],
  );

  const onlineCount = useMemo(
    () =>
      workers
        ? workers.filter((w) => w.device && w.device.status == "aktif").length
        : 0,
    [workers],
  );

  const workersWithDevice = useMemo(
    () => (workers ? workers.filter((w) => w.device != null) : []),
    [workers],
  );

  const deviceCount = useMemo(
    () => (workersWithDevice ? workersWithDevice?.length : 0),
    [workers],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Perangkat Aktif
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {onlineCount} dari {deviceCount} perangkat sedang online
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-auto">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Pekerja
              </th>
              <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                MAC Address
              </th>
              {/* <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Terakhir Aktif
              </th> */}
              <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Terdaftar Sejak
              </th>
              <th className="py-3 pl-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {devices.map((device) => {
              const online = isOnline(device.lastSeenAt); */}
            {workersWithDevice &&
              workersWithDevice?.map((worker) => {
                const online = worker.device
                  ? worker.device.status == "aktif"
                  : false;
                return (
                  <tr
                    // key={device.publicId}
                    key={worker.device?.public_id}
                    className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
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
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {/* {device.pekerjaName} */}
                        {worker.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {/* ID Pekerja: {device.pekerjaId} */}
                        ID Pekerja: {worker.public_id}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-sm text-gray-600 dark:text-gray-300">
                      {/* {device.macAddress} */}
                      {worker.device && worker.device.mac_address}
                    </td>
                    {/* <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(device.lastSeenAt)}
                      Kosong untuk sekarang
                    </td> */}
                    <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400">
                      {worker.device &&
                        new Date(worker.device.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Link
                        // href={`/monitoring/device/${device.publicId}`}
                        // href={`/monitoring/device/${worker.device?.public_id}`}
                        href={`/monitoring/worker/${worker.public_id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-green-500 hover:bg-green-50 hover:text-green-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-green-500 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                      >
                        Detail
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.5 4.5L13 10l-5.5 5.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {deviceCount === 0 && (
        <div className="py-10 text-center text-sm text-gray-400">
          Belum ada perangkat terdaftar.
        </div>
      )}
    </div>
  );
};
