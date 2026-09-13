// Suggested location in your project:
// app/(admin)/dashboard/device/[publicId]/page.tsx
import PageTitle from "@/components/molecules/PageTitle";
import { DeviceInfo } from "@/components/monitoring/DeviceInfo";

interface DeviceDetailPageProps {
  // Next.js 15+: params is a Promise. If you're on Next.js 14 or earlier,
  // change this to `{ publicId: string }` and drop the `await` below.
  params: Promise<{ publicId: string }>;
}

export default async function DeviceDetail({ params }: DeviceDetailPageProps) {
  const { publicId } = await params;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <PageTitle
          title="Detail Perangkat"
          description="Monitoring real-time perangkat yang sedang digunakan."
        />
      </div>

      <div className="col-span-12">
        <DeviceInfo publicId={publicId} />
      </div>
    </div>
  );
}