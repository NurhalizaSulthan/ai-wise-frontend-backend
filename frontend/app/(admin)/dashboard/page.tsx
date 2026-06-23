import type { Metadata } from "next";
import { DataOverview } from "@/components/dashboard/DataOverview";
import React from "react";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import PieChart from "@/components/dashboard/PieChart";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Baris 1 */}
      <div className="col-span-12">
        <DataOverview />
      </div>

      {/* Baris 2 */}
      <div className="col-span-12 xl:col-span-8">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <PieChart/>
      </div>
    </div>
  );
}
