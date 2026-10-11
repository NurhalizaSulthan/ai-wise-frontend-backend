import { ActiveDeviceList } from "@/components/monitoring/ActiveDeviceList";
import PageTitle from "@/components/molecules/PageTitle";

export default function Monitoring() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <PageTitle
          title="Monitoring"
          description="Monitoring real-time perangkat yang sedang digunakan."
        />
      </div>

      <div className="col-span-12">
        <ActiveDeviceList />
      </div>
    </div>
  );
}
