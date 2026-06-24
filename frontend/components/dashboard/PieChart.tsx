"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Dropdown } from "../atoms/Dropdown";
import { DropdownItem } from "../atoms/DropdownItem";
import { Icon } from "@iconify/react";
// import { MoreDotIcon } from "@/icons";

const ReactECharts = dynamic(
  () => import("echarts-for-react"),
  { ssr: false }
);

export default function PieChart() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const data = [
    {
      value: 20,
      name: "Risiko Jatuh",
      itemStyle: {
        color: "#46C0D9",
      },
    },
    {
      value: 15,
      name: "Postur Kerja Berbahaya",
      itemStyle: {
        color: "#F5AE4B",
      },
    },
    {
      value: 35,
      name: "Kelelahan",
      itemStyle: {
        color: "#7C6CF5",
      },
    },
    {
      value: 30,
      name: "Paparan Panas",
      itemStyle: {
        color: "#F38A84",
      },
    },
  ];

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{d}% ({c})",
    },

    legend: {
      orient: "vertical",
      bottom: 10,
      left: 20,

      itemWidth: 14,
      itemHeight: 14,

      textStyle: {
        fontSize: 15,
        color: "#6B7280",
      },
    },

    series: [
      {
        type: "pie",

        radius: "65%",

        center: ["50%", "42%"],

        data,

        avoidLabelOverlap: true,

        label: {
          show: true,
          position: "outside",

          formatter: "{d}%",

          fontSize: 14,
          color: "#6B7280",
        },

        labelLine: {
          show: true,

          length: 18,
          length2: 25,

          smooth: false,
        },

        emphasis: {
          scale: false,
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-border bg-surface dark:border-border dark:bg-surface">
      <div className="px-5 pt-5 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
            Distribusi Jenis Risiko
          </h3>

          <div className="relative inline-block">
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle"
            >
              <Icon
                icon="solar:menu-dots-bold"
                className="size-5 text-muted transition-colors hover:text-primary"
              />
            </button>

            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full rounded-lg text-left font-normal text-muted hover:text-muted"
              >
                Refresh
              </DropdownItem>

              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full rounded-lg text-left font-normal text-muted hover:bg-muted hover:text-muted"
              >
                Download
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Chart */}
        <div>
          <ReactECharts
            option={option}
            style={{
              height: "450px",
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}