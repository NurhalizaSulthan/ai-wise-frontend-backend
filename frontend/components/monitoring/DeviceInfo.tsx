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

// if the data structure different, just change this to match the arrived one
interface SensorData {
  acc_x: number;
  acc_y: number;
  acc_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  pitch: number;
  roll: number;
  yaw: number;
  status: "JATUH" | "AMAN";
  // latitude: number | null;
  // longitude: number | null;
  received_at: number; // waktu pesan diterima di client
}

// Base URL WITHOUT the "/ws" suffix: the path below already adds /ws/mobile/...
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";
const MAX_RETRIES = 10; // after this many failed attempts -> "disconnected"
const BASE_DELAY = 1000; // ms, doubles on each retry
const MAX_DELAY = 10000; // ms
const TIME_ZONE = "Asia/Makassar"; // fixed so server and client render the same

function useSensorSocket(
  macAddress: string | undefined,
  publicId: string | undefined,
) {
  const [data, setData] = useState<SensorData | null>(null);
  const [state, setState] = useState<ConnectionState>("connecting");
  const [retryCount, setRetryCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retriesRef = useRef(0);
  const stoppedRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!macAddress) return;

    stoppedRef.current = false;
    retriesRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRetryCount(0);
    setData(null);

    const url = `${WS_URL}/api/v1/ws/mobile/${encodeURIComponent(macAddress)}`;

    const connect = () => {
      if (stoppedRef.current) return;
      setState(retriesRef.current === 0 ? "connecting" : "reconnecting");

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retriesRef.current = 0;
        setRetryCount(0);
        setState("connected");
      };

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          const m = raw?.data ?? raw;

          if (typeof m.x !== "number") return;

          setData({
            acc_x: m.x,
            acc_y: m.y,
            acc_z: m.z,
            gyro_x: m.gx,
            gyro_y: m.gy,
            gyro_z: m.gz,
            pitch: m.pitch,
            roll: m.roll,
            yaw: m.yaw,
            status:
              String(m.Status ?? m.status).toUpperCase() === "JATUH"
                ? "JATUH"
                : "AMAN",
            // latitude: typeof m.latitude === "number" ? m.latitude : null,
            // longitude: typeof m.longitude === "number" ? m.longitude : null,
            received_at: Date.now(),
          });
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
  }, [macAddress, publicId]);

  // Manual retry, shown after automatic retries are exhausted
  const reconnect = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    retriesRef.current = 0;
    setRetryCount(0);
    connectRef.current();
  }, []);

  return { data, state, retryCount, reconnect };
}

/**
 * Returns null during SSR and the first client render (so both match),
 * then the current timestamp, refreshed every `intervalMs`.
 * Anything that depends on "now" must only be rendered when this is non-null.
 */
function useClientNow(intervalMs = 5000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);

  return now;
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
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
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

const fmt = (n: number | null | undefined, digits = 2) =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(digits) : "-";

const formatDateTime = (value: string | number | Date) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });

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
  const { data, state, retryCount, reconnect } = useSensorSocket(
    device?.macAddress,
    publicId,
  );
  const now = useClientNow();
  const mounted = now !== null;

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

  // Depends on "now", so it is only computed on the client after mount.
  // Server and first client render both show "Offline" / "-" -> no mismatch.
  const online = mounted && isOnline(device.lastSeenAt);
  const lastSeenText = mounted ? formatRelativeTime(device.lastSeenAt) : "-";
  const conn = CONNECTION_STYLES[state];
  const fell = data?.status === "JATUH";

  const details: { label: string; value: string }[] = [
    { label: "Public ID", value: device.publicId },
    { label: "MAC Address", value: device.macAddress },
    { label: "Nama Pekerja", value: device.pekerjaName },
    { label: "ID Pekerja", value: String(device.pekerjaId) },
    { label: "Terakhir Aktif", value: lastSeenText },
    { label: "Terdaftar Sejak", value: formatDateTime(device.createdAt) },
    { label: "Terakhir Diperbarui", value: formatDateTime(device.updatedAt) },
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
            title={`${WS_URL}api/v1/ws/mobile/${device.macAddress}`}
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
              {new Date(data.received_at).toLocaleTimeString("id-ID", {
                timeZone: TIME_ZONE,
              })}
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

            {/* {data.latitude !== null && data.longitude !== null && (
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
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};
