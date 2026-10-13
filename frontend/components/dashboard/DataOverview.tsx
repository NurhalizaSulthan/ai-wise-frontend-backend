"use client";

import React, { useMemo } from "react";
import { Icon } from "@iconify/react";
import { useDashboard } from "./DashboardProvider";
import { ALERT_META, countByType, isActive, isToday } from "@/lib/dashboard";

export const DataOverview = () => {
  const { devices, alerts, loading, error } = useDashboard();

  const stats = useMemo(() => {
    // Pekerja aktif = jumlah perangkat berstatus aktif
    const activeDevices = devices.filter(isActive);

    // Jika alert punya created_at -> hitung hari ini, jika tidak -> total
    const hasDate = alerts.some((a) => a.created_at);
    const alertsToday = hasDate ? alerts.filter((a) => isToday(a.created_at)) : alerts;

    const counts = countByType(alertsToday);
    const topKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      workers: activeDevices.length,
      totalDevices: devices.length,
      alertCount: alertsToday.length,
      topAlert: topKey ? ALERT_META[topKey]?.label ?? "-" : "-",
    };
  }, [devices, alerts]);

  const show = (v: number | string) => (loading ? "…" : v);

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">
          Sebagian data gagal dimuat: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pekerja Aktif */}
        <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-base font-medium text-muted">Pekerja Aktif</span>
              <h2 className="mt-3 text-4xl font-bold text-foreground">{show(stats.workers)}</h2>
              <span className="mt-4 block text-sm text-muted">
                {loading ? "…" : `dari ${stats.totalDevices} perangkat terdaftar`}
              </span>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
              <Icon icon="mdi:account-hard-hat-outline" className="size-8" />
            </div>
          </div>
        </div>

        {/* Jumlah Peringatan */}
        <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-base font-medium text-muted">Jumlah Peringatan</span>
              <h2 className="mt-3 text-4xl font-bold text-foreground">{show(stats.alertCount)}</h2>
              <span className="mt-4 block text-sm text-muted">Tercatat hari ini</span>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary shadow-soft">
              <Icon icon="solar:bell-bing-linear" className="size-8" />
            </div>
          </div>
        </div>

        {/* Peringatan Tersering */}
        <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-base font-medium text-muted">Peringatan Tersering</span>
              <h2 className="mt-3 truncate text-4xl font-bold text-foreground">{show(stats.topAlert)}</h2>
              <span className="mt-4 block text-sm text-muted">Risiko tertinggi hari ini</span>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger shadow-soft">
              <Icon icon="solar:shield-warning-linear" className="size-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};