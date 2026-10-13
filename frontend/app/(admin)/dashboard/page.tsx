import { DataOverview } from "@/components/dashboard/DataOverview";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import PieChart from "@/components/dashboard/PieChart";
import DeviceMap from "@/components/dashboard/DeviceMap";
import PageTitle from "@/components/molecules/PageTitle";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <PageTitle
            title="Dashboard"
            description="Ringkasan real-time keselamatan pekerja dan pemantauan risiko."
          />
        </div>

        <div className="col-span-12">
          <DataOverview />
        </div>

        <div className="col-span-12 xl:col-span-8">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <PieChart />
        </div>

        <div className="col-span-12">
          <DeviceMap />
        </div>
      </div>
    </DashboardProvider>
  );
}