"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
// [DIUBAH] renderToStaticMarkup & Icon dari @iconify/react DIHAPUS —
// Icon Iconify fetch data secara async (via useEffect), tidak kompatibel
// dengan renderToStaticMarkup yang berjalan sinkron. Diganti SVG path statis.
import type { DivIcon } from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export type Device = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "active" | "inactive";
  lastActiveAt?: string;
};

const devices: Device[] = [
  {
    id: "dev-1",
    name: "Alat 1 - Zona A",
    lat: -5.1477,
    lng: 119.4327,
    status: "active",
  },
  {
    id: "dev-2",
    name: "Alat 2 - Zona B",
    lat: -5.1500,
    lng: 119.4360,
    status: "inactive",
    lastActiveAt: "24 Agustus 2026, 14:20",
  },
  {
    id: "dev-3",
    name: "Alat 3 - Zona C",
    lat: -5.1450,
    lng: 119.4300,
    status: "active",
  },
];

export default function DeviceMap() {
  const center = useMemo<[number, number]>(() => [-5.1477, 119.4327], []);

  const [icons, setIcons] = useState<{ active: DivIcon; inactive: DivIcon } | null>(null);

  useEffect(() => {
    let mounted = true;

    import("leaflet").then((L) => {
      if (!mounted) return;

      // [DITAMBAHKAN] Path SVG asli ikon "mdi:map-marker" (Material Design Icons),
      // ditulis langsung sebagai string statis — tidak perlu fetch API, pasti render.
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

      setIcons({
        active: buildIcon("#22C55E"),
        inactive: buildIcon("#9CA3AF"),
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Peta Lokasi Alat
          </h3>
          <p className="mt-1 text-sm text-muted">
            Status posisi perangkat secara real-time
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
                    <p>
                      Status:{" "}
                      {device.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </p>
                    {device.status === "inactive" && device.lastActiveAt && (
                      <p className="text-muted">
                        Terakhir aktif: {device.lastActiveAt}
                      </p>
                    )}
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