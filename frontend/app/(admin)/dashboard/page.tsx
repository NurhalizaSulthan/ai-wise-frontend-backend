import { DataOverview } from "@/components/dashboard/DataOverview";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import PieChart from "@/components/dashboard/PieChart";

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
        <PieChart />
      </div>
    </div>
  );
}
