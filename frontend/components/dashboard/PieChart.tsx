"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { Dropdown } from "../atoms/Dropdown";
import { DropdownItem } from "../atoms/DropdownItem";
import { Icon } from "@iconify/react";
import { useDashboard } from "./DashboardProvider";
import { ALERT_META, countByType } from "@/lib/dashboard";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function PieChart() {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, loading } = useDashboard();

  const toggleDropdown = () => setIsOpen((v) => !v);
  const closeDropdown = () => setIsOpen(false);

  const data = useMemo(
    () =>
      Object.entries(countByType(alerts)).map(([key, value]) => ({
        value,
        name: ALERT_META[key].label,
        itemStyle: { color: ALERT_META[key].color },
      })),
    [alerts]
  );

  const option = useMemo(
    () => ({
      tooltip: { trigger: "item", formatter: "{b}<br/>{d}% ({c})" },
      legend: {
        orient: "vertical",
        bottom: 10,
        left: 20,
        itemWidth: 14,
        itemHeight: 14,
        textStyle: { fontSize: 15, color: "#6B7280" },
      },
      series: [
        {
          type: "pie",
          radius: "65%",
          center: ["50%", "42%"],
          data,
          avoidLabelOverlap: true,
          label: { show: true, position: "outside", formatter: "{d}%", fontSize: 14, color: "#6B7280" },
          labelLine: { show: true, length: 18, length2: 25, smooth: false },
          emphasis: { scale: false },
        },
      ],
    }),
    [data]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface dark:border-border dark:bg-surface">
      <div className="px-5 pt-5 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
            Distribusi Jenis Risiko
          </h3>

          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <Icon
                icon="solar:menu-dots-bold"
                className="size-5 text-muted transition-colors hover:text-primary"
              />
            </button>

            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full rounded-lg text-left font-normal text-muted hover:text-foreground"
              >
                Muat Ulang
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full rounded-lg text-left font-normal text-muted hover:text-foreground"
              >
                Unduh
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Chart */}
        <div>
          {loading ? (
            <div className="flex h-112.5 items-center justify-center text-sm text-muted">
              Memuat...
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-112.5 items-center justify-center text-sm text-muted">
              Belum ada data peringatan
            </div>
          ) : (
            <ReactECharts option={option} style={{ height: "450px", width: "100%" }} />
          )}
        </div>
      </div>
    </div>
  );
}