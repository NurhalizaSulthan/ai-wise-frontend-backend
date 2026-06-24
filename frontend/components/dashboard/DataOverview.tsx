"use client";

import React from "react";
import { Icon } from "@iconify/react";

export const DataOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Active Workers */}
      <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-base font-medium text-muted">
              Active Workers
            </span>

            <h2 className="mt-3 text-4xl font-bold text-foreground">
              10
            </h2>

            <span className="mt-4 block text-sm text-muted">
              On-site today
            </span>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
            <Icon icon="mdi:account-hard-hat-outline" className="size-8" />
          </div>
        </div>
      </div>

      {/* Alert Count */}
      <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-base font-medium text-muted">
              Alert Count
            </span>

            <h2 className="mt-3 text-4xl font-bold text-foreground">
              50
            </h2>

            <span className="mt-4 block text-sm text-muted">
              Recorded today
            </span>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary shadow-soft">
            <Icon icon="solar:bell-bing-linear" className="size-8" />
          </div>
        </div>
      </div>

      {/* Most Frequent Alert */}
      <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-base font-medium text-muted">
              Most Frequent Alert
            </span>

            <h2 className="mt-3 truncate text-4xl font-bold text-foreground">
              Bad Posture
            </h2>

            <span className="mt-4 block text-sm text-muted">
              Highest risk today
            </span>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger shadow-soft">
            <Icon icon="solar:shield-warning-linear" className="size-8" />
          </div>
        </div>
      </div>
    </div>
  );
};