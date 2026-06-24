"use client";

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "flatpickr/dist/flatpickr.min.css";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "@/components/atoms/ChartTab";

import type { ComponentType } from "react";
import type { Props as ApexProps } from "react-apexcharts";
import { Icon } from "@iconify/react";

const Chart = dynamic<ApexProps>(
  () =>
    import("react-apexcharts").then(
      (mod) => mod.default as unknown as ComponentType<ApexProps>
    ),
  { ssr: false }
);

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,

      // Jangan pakai static:true karena bisa bentrok dengan React/Iconify
      static: false,

      prevArrow: "‹",
      nextArrow: "›",
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []);

  const options = useMemo<ApexOptions>(
    () => ({
      legend: {
        show: false,
      },

      colors: ["#157138", "#fb8716"],

      chart: {
        fontFamily: "var(--font-sans)",
        height: 310,
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },

      stroke: {
        curve: "smooth",
        width: [3, 3],
      },

      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.35,
          opacityTo: 0.02,
        },
      },

      markers: {
        size: 0,
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },

      grid: {
        borderColor: "var(--border)",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },

      dataLabels: {
        enabled: false,
      },

      tooltip: {
        enabled: true,
        theme: "light",
      },

      xaxis: {
        type: "category",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            fontSize: "12px",
            colors: "var(--muted)",
            fontFamily: "var(--font-sans)",
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            colors: ["var(--muted)"],
            fontFamily: "var(--font-sans)",
          },
        },
        title: {
          text: "",
        },
      },
    }),
    []
  );

  const series = [
    {
      name: "Alerts",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Resolved",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];


  return (
    <div className="rounded-2xl border border-border bg-surface dark:bg-surface px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full min-w-0">
          <h3 className="text-lg font-semibold text-foreground">
            Statistics
          </h3>

          <p className="mt-1 text-sm text-muted">
            Target you ve set for each month
          </p>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />

          <div className="relative inline-flex items-center">
            <Icon
              icon="solar:calendar-linear"
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-muted lg:left-3 lg:translate-x-0"
            />
            <input
              ref={datePickerRef}
              className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-background text-sm font-medium text-transparent outline-none transitionplaceholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 lg:h-auto lg:w-40 lg:py-2 lg:pl-10 lg:pr-3 lg:text-foreground"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-180 xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}