"use client";

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "flatpickr/dist/flatpickr.min.css";
import type { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id";
import type { ComponentType } from "react";
import type { Props as ApexProps } from "react-apexcharts";
import { Icon } from "@iconify/react";
import { useDashboard } from "./DashboardProvider";
import { monthlySeries } from "@/lib/dashboard";

const Chart = dynamic<ApexProps>(
  () =>
    import("react-apexcharts").then(
      (mod) => mod.default as unknown as ComponentType<ApexProps>
    ),
  { ssr: false }
);

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);
  const { alerts } = useDashboard();

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      locale: { ...Indonesian, rangeSeparator: " - " },
      monthSelectorType: "static",
      dateFormat: "d M",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      static: false,
      prevArrow: "‹",
      nextArrow: "›",
      // TODO: nanti dipakai untuk memfilter grafik
      // onChange: (selectedDates) => { ... },
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };
  }, []);

  const options = useMemo<ApexOptions>(
    () => ({
      legend: { show: false },
      colors: ["#157138", "#fb8716"],
      chart: {
        fontFamily: "var(--font-sans)",
        height: 310,
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: false },
      },
      stroke: { curve: "smooth", width: [3, 3] },
      fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
      markers: {
        size: 0,
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: { size: 6 },
      },
      grid: {
        borderColor: "var(--border)",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      dataLabels: { enabled: false },
      tooltip: { enabled: true, theme: "light" },
      xaxis: {
        type: "category",
        categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
        labels: {
          style: { fontSize: "12px", colors: "var(--muted)", fontFamily: "var(--font-sans)" },
        },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          style: { fontSize: "12px", colors: ["var(--muted)"], fontFamily: "var(--font-sans)" },
          formatter: (v: number) => String(Math.round(v)),
        },
        title: { text: "" },
      },
    }),
    []
  );

  const series = useMemo(() => {
    const { total, resolved, hasStatus } = monthlySeries(alerts);
    const s = [{ name: "Peringatan", data: total }];
    // Seri "Selesai" hanya muncul jika backend mengirim field status pada alert
    if (hasStatus) s.push({ name: "Selesai", data: resolved });
    return s;
  }, [alerts]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface px-5 pb-5 pt-5 dark:bg-surface sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Statistik</h3>
          <p className="mt-1 text-sm text-muted">
            Tren peringatan keselamatan ({new Date().getFullYear()}), per bulan
          </p>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <div className="relative inline-flex items-center">
            <Icon
              icon="solar:calendar-linear"
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-muted lg:left-3 lg:translate-x-0"
            />
            <input
              ref={datePickerRef}
              className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-background text-sm font-medium text-transparent outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 lg:h-auto lg:w-44 lg:py-2 lg:pl-10 lg:pr-3 lg:text-foreground"
              placeholder="Pilih tanggal"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full flex-1 overflow-x-auto custom-scrollbar">
        <div className="h-full min-w-180 xl:min-w-full">
          <Chart options={options} series={series} type="area" height="100%" />
        </div>
      </div>
    </div>
  );
}