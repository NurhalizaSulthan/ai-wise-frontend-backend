// Suggested location in your project: components/monitoring/DeviceInfo.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatRelativeTime,
  getDeviceByPublicId,
  isOnline,
} from "@/lib/devices";

/* ----------------------------- WebSocket hook ----------------------------- */

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

  // if the data structure different, just change this with the correct name as the arrived one
interface SensorData {
  acc_x: number;
  acc_y: number;
  acc_z: number;
  created_at: string;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  latitude: number;
  longitude: number;
  pitch: number;
  public_id: string;
  roll: number;
  yaw: number;
  status: "JATUH" | "AMAN";
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";
const MAX_RETRIES = 10; // after this many failed attempts -> "disconnected"
const BASE_DELAY = 1000; // ms, doubles on each retry
const MAX_DELAY = 10000; // ms

function useSensorSocket(publicId: string) {
  const [data, setData] = useState<SensorData | null>(null);
  const [state, setState] = useState<ConnectionState>("connecting");
  const [retryCount, setRetryCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retriesRef = useRef(0);
  const stoppedRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  useEffect(() => {
    stoppedRef.current = false;
    retriesRef.current = 0;
    setRetryCount(0);
    setData(null);

    const connect = () => {
      if (stoppedRef.current) return;
      setState(retriesRef.current === 0 ? "connecting" : "reconnecting");

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        retriesRef.current = 0;
        setRetryCount(0);
        setState("connected");
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as SensorData;
          // The server broadcasts every device to every client, so only
          // keep messages that belong to the device shown on this page.
          if (parsed.public_id !== publicId) return;
          setData(parsed);
        } catch {
          console.error("Pesan WebSocket tidak valid:", event.data);
        }
      };

      ws.onerror = () => ws.close();

      ws.onclose = () => {
        if (stoppedRef.current) return;

        if (retriesRef.current >= MAX_RETRIES) {
          setState("disconnected");
          return;
        }

        const delay = Math.min(BASE_DELAY * 2 ** retriesRef.current, MAX_DELAY);
        retriesRef.current += 1;
        setRetryCount(retriesRef.current);
        setState("reconnecting");
        timerRef.current = setTimeout(connect, delay);
      };
    };

    connectRef.current = connect;
    connect();

    return () => {
      stoppedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);

      const ws = wsRef.current;
      if (!ws) return;

      // Detach handlers so a late "close" from this old socket can't
      // trigger a reconnect after a Strict Mode remount.
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;

      if (ws.readyState === WebSocket.CONNECTING) {
        // Closing a socket that is still connecting causes the browser
        // warning "connection was interrupted while the page was loading".
        // Wait until it opens, then close it.
        ws.onopen = () => ws.close();
      } else {
        ws.close();
      }
    };
  }, [publicId]);

  // Manual retry, shown after automatic retries are exhausted
  const reconnect = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    retriesRef.current = 0;
    setRetryCount(0);
    connectRef.current();
  }, []);

  return { data, state, retryCount, reconnect };
}

/* --------------------------------- Helpers -------------------------------- */

const CONNECTION_STYLES: Record<
  ConnectionState,
  { label: string; badge: string; dot: string }
> = {
  connected: {
    label: "Terhubung",
    badge:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    dot: "bg-green-500",
  },
  connecting: {
    label: "Menghubungkan...",
    badge:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    dot: "bg-blue-500 animate-pulse",
  },
  reconnecting: {
    label: "Menghubungkan ulang...",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    dot: "bg-amber-500 animate-pulse",
  },
  disconnected: {
    label: "Terputus",
    badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-500",
  },
};

const fmt = (n: number, digits = 2) => n.toFixed(digits);

const Metric = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) => (
  <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
    <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
    <p className="mt-0.5 font-mono text-sm text-gray-800 dark:text-gray-200">
      {value}
      {unit && (
        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
          {unit}
        </span>
      )}
    </p>
  </div>
);

const SensorGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {title}
    </h4>
    <div className="grid grid-cols-3 gap-2">{children}</div>
  </div>
);

/* -------------------------------- Component ------------------------------- */

interface DeviceInfoProps {
  publicId: string;
}

export const DeviceInfo = ({ publicId }: DeviceInfoProps) => {
  // Swap getDeviceByPublicId for a real fetch (e.g. GET /api/devices/[publicId])
  // once the endpoint is ready.
  const device = getDeviceByPublicId(publicId);

  // Hooks must run before any early return
  const { data, state, retryCount, reconnect } = useSensorSocket(publicId);

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
  const conn = CONNECTION_STYLES[state];
  const fell = data?.status === "JATUH";

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

        <div className="flex flex-wrap items-center gap-2">
          {/* Device online badge (from device.lastSeenAt) */}
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

          {/* WebSocket connection badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${conn.badge}`}
            title={WS_URL}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${conn.dot}`} />
            WebSocket: {conn.label}
            {state === "reconnecting" && ` (${retryCount}/${MAX_RETRIES})`}
          </span>

          {state === "disconnected" && (
            <button
              type="button"
              onClick={reconnect}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Hubungkan ulang
            </button>
          )}
        </div>
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

      {/* ------------------------- Live sensor data ------------------------- */}
      <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Data Sensor Real-time
          </h4>
          {data && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Diperbarui{" "}
              {new Date(data.created_at).toLocaleTimeString("id-ID")}
            </span>
          )}
        </div>

        {!data ? (
          <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:bg-white/[0.04] dark:text-gray-400">
            {state === "connected"
              ? "Menunggu data dari perangkat..."
              : "Belum ada data. Menunggu koneksi WebSocket."}
          </p>
        ) : (
          <div className="space-y-5">
            {/* Fall status */}
            <div
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                fell
                  ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              }`}
            >
              <span className="text-sm font-medium">Status Pekerja</span>
              <span
                className={`text-sm font-bold ${fell ? "animate-pulse" : ""}`}
              >
                {fell ? "JATUH" : "AMAN"}
              </span>
            </div>

            <SensorGroup title="Akselerometer">
              <Metric label="X" value={fmt(data.acc_x, 3)} unit="g" />
              <Metric label="Y" value={fmt(data.acc_y, 3)} unit="g" />
              <Metric label="Z" value={fmt(data.acc_z, 3)} unit="g" />
            </SensorGroup>

            <SensorGroup title="Giroskop">
              <Metric label="X" value={fmt(data.gyro_x)} unit="°/s" />
              <Metric label="Y" value={fmt(data.gyro_y)} unit="°/s" />
              <Metric label="Z" value={fmt(data.gyro_z)} unit="°/s" />
            </SensorGroup>

            <SensorGroup title="Orientasi">
              <Metric label="Pitch" value={fmt(data.pitch)} unit="°" />
              <Metric label="Roll" value={fmt(data.roll)} unit="°" />
              <Metric label="Yaw" value={fmt(data.yaw)} unit="°" />
            </SensorGroup>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Lokasi
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Latitude" value={fmt(data.latitude, 6)} />
                <Metric label="Longitude" value={fmt(data.longitude, 6)} />
              </div>
              <a
                href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-green-600 hover:underline dark:text-green-400"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};