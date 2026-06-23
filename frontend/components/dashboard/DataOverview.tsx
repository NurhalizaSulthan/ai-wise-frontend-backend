"use client";
import React from "react";
import { GroupIcon } from "@/icons";

export const DataOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Metric Item */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-lg text-gray-500 dark:text-gray-400">
              Active Workers
            </span>

            <h2 className="mt-3 text-5xl font-bold text-black dark:text-white">
              10
            </h2>

            <span className="mt-4 block text-sm text-gray-400">
              On-site today
            </span>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 shadow">
            <GroupIcon className="size-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Metric Item */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-lg text-gray-500 dark:text-gray-400">
             Alert Count
            </span>

            <h2 className="mt-3 text-5xl font-bold text-black dark:text-white">
              50
            </h2>

            <span className="mt-4 block text-sm text-gray-400">
              Recorded today
            </span>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 shadow">
            <GroupIcon className="size-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Metric Item */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-lg text-gray-500 dark:text-gray-400">
              Most Frequent Alert
            </span>

            <h2 className="mt-3 text-5xl font-semibold text-black dark:text-white">
              Bad Posture
            </h2>

            <span className="mt-4 block text-sm text-gray-400">
              Highest risk today
            </span>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 shadow">
            <GroupIcon className="size-8 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};