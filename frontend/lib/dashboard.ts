import apiFetch from "@/lib/api/client";



// Jika NEXT_PUBLIC_BACKEND_URL di .env.local sudah berisi /api/v1,
// ganti jadi: const PREFIX = "";
const PREFIX = "/api/v1";

type Envelope<T> = { data: T | null };

// Membuka envelope { status, message, data }. data bisa null jika kosong.
const getList = async <T>(path: string): Promise<T[]> => {
  const res = await apiFetch<Envelope<T[]>>(`${PREFIX}${path}`);
  return res?.data ?? [];
};



export type DeviceDTO = {
  public_id: string;
  pekerja_id: number | null;
  nama: string;
  mac_address: string;
  status: string; // "aktif" | ...
};


export type AlertDTO = {
  public_id: string;
  device_id?: number;
  device_public_id?: string;
  jenis_alert: string;
  tingkat_alert?: string;
  status?: string; 
  created_at?: string;
};

export type TelemetryDTO = {
  public_id: string;
  device_id?: number;
  device_public_id?: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

/* ---------- Fetchers ---------- */

export const getDevices = () => getList<DeviceDTO>("/device");
export const getAlerts = () => getList<AlertDTO>("/alert");
export const getTelemetry = () => getList<TelemetryDTO>("/telemetry");

/* ---------- Tipe jenis alert ---------- */

export const ALERT_META: Record<string, { label: string; color: string }> = {
  fall: { label: "Fall Risk", color: "#46C0D9" },
  posture: { label: "Bad Posture", color: "#F5AE4B" },
  other: { label: "Other", color: "#9CA3AF" },
};

// Menormalkan "Jatuh", "jatuh", "Postur Tubuh", "postur_tubuh", "Cuaca Ekstrem", dst.
export function alertKey(jenis: string): keyof typeof ALERT_META {
  const v = (jenis ?? "").toLowerCase();
  if (v.includes("jatuh") || v.includes("fall")) return "fall";
  if (v.includes("postur") || v.includes("posture")) return "posture";
  if (v.includes("cuaca") || v.includes("weather")) return "weather";
  return "other";
}

export function countByType(alerts: AlertDTO[]) {
  const counts: Record<string, number> = {};
  for (const a of alerts) {
    const k = alertKey(a.jenis_alert);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

/* ---------- Util tanggal ---------- */

export function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

/* ---------- Statistik bulanan (tahun berjalan) ---------- */

export function monthlySeries(alerts: AlertDTO[]) {
  const year = new Date().getFullYear();
  const total = Array(12).fill(0) as number[];
  const resolved = Array(12).fill(0) as number[];
  const hasStatus = alerts.some((a) => a.status !== undefined);

  for (const a of alerts) {
    if (!a.created_at) continue;
    const d = new Date(a.created_at);
    if (d.getFullYear() !== year) continue;
    total[d.getMonth()] += 1;
    const s = (a.status ?? "").toLowerCase();
    if (s === "resolved" || s === "selesai") resolved[d.getMonth()] += 1;
  }
  return { total, resolved, hasStatus };
}

/* ---------- Data untuk peta ---------- */

export type MapDevice = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "active" | "inactive";
  lastActiveAt?: string;
};

// Lokasi = telemetry terbaru milik device tersebut.
// ASUMSI: telemetry punya `device_public_id`. Jika tidak ada, device tidak bisa dicocokkan
// dan peta kosong sampai backend menambahkan penanda device di telemetry.
export function buildMapDevices(devices: DeviceDTO[], telemetry: TelemetryDTO[]): MapDevice[] {
  const result: MapDevice[] = [];

  for (const d of devices) {
    const mine = telemetry
      .filter(
        (t) =>
          t.device_public_id === d.public_id &&
          Number.isFinite(t.latitude) &&
          Number.isFinite(t.longitude)
      )
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

    const latest = mine[0];
    if (!latest) continue;

    result.push({
      id: d.public_id,
      name: d.nama,
      lat: latest.latitude,
      lng: latest.longitude,
      status: d.status.toLowerCase() === "aktif" ? "active" : "inactive",
      lastActiveAt: new Date(latest.created_at).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      }),
    });
  }
  return result;
}