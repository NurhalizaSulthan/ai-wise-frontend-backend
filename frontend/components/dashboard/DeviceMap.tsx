"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { DivIcon } from "leaflet";
import { useDashboard } from "./DashboardProvider";
import { buildMapDevices } from "@/lib/dashboard";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

const DEFAULT_CENTER: [number, number] = [-5.1477, 119.4327];

export default function DeviceMap() {
  const { devices: rawDevices, telemetry } = useDashboard();
  const [icons, setIcons] = useState<{ active: DivIcon; inactive: DivIcon } | null>(null);

  const devices = useMemo(() => buildMapDevices(rawDevices, telemetry), [rawDevices, telemetry]);

  // Pusat peta = rata-rata koordinat semua perangkat (atau default jika kosong)
  const center = useMemo<[number, number]>(() => {
    if (devices.length === 0) return DEFAULT_CENTER;
    const lat = devices.reduce((s, d) => s + d.lat, 0) / devices.length;
    const lng = devices.reduce((s, d) => s + d.lng, 0) / devices.length;
    return [lat, lng];
  }, [devices]);

  useEffect(() => {
    let mounted = true;

    import("leaflet").then((L) => {
      if (!mounted) return;

      const buildIcon = (color: string) => {
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"
               style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.35));">
            <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5"/>
          </svg>
        `;
        return L.default.divIcon({
          className: "custom-device-marker",
          html: svg,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -34],
        });
      };

      setIcons({ active: buildIcon("#22C55E"), inactive: buildIcon("#9CA3AF") });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const withoutLocation = rawDevices.length - devices.length;

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Peta Lokasi Perangkat</h3>
          <p className="mt-1 text-sm text-muted">
            Status posisi perangkat secara real-time
            {withoutLocation > 0 && ` • ${withoutLocation} perangkat belum punya data lokasi`}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#22C55E]" />
            Aktif
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#9CA3AF]" />
            Tidak Aktif
          </div>
        </div>
      </div>

      <div className="h-105 w-full overflow-hidden rounded-xl">
        {icons ? (
          <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {devices.map((device) => (
              <Marker
                key={device.id}
                position={[device.lat, device.lng]}
                icon={device.status === "active" ? icons.active : icons.inactive}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{device.name}</p>
                    <p>Status: {device.status === "active" ? "Aktif" : "Tidak Aktif"}</p>
                    {device.lastActiveAt && <p>Pembaruan terakhir: {device.lastActiveAt}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            Memuat peta...
          </div>
        )}
      </div>
    </div>
  );
}