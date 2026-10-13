"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getAlerts,
  getDevices,
  getTelemetry,
  type AlertDTO,
  type DeviceDTO,
  type TelemetryDTO,
} from "@/lib/dashboard";

type DashboardState = {
  devices: DeviceDTO[];
  alerts: AlertDTO[];
  telemetry: TelemetryDTO[];
  loading: boolean;
  error: string | null;
};

const initial: DashboardState = {
  devices: [],
  alerts: [],
  telemetry: [],
  loading: true,
  error: null,
};

const DashboardContext = createContext<DashboardState>(initial);

export const useDashboard = () => useContext(DashboardContext);

const REFRESH_MS = 10_000;

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initial);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [d, a, t] = await Promise.allSettled([getDevices(), getAlerts(), getTelemetry()]);
      if (!mounted) return;

      const failed = [d, a, t].find((r) => r.status === "rejected") as
        | PromiseRejectedResult
        | undefined;

      setState({
        devices: d.status === "fulfilled" ? d.value : [],
        alerts: a.status === "fulfilled" ? a.value : [],
        telemetry: t.status === "fulfilled" ? t.value : [],
        loading: false,
        error: failed ? String(failed.reason?.message ?? failed.reason) : null,
      });
    };

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return <DashboardContext.Provider value={state}>{children}</DashboardContext.Provider>;
}