"use client";

import { useState } from "react";
import PageTitle from "@/components/molecules/PageTitle";
import ListDevicesTable from "@/components/organisms/ListDevicesTable";
import SidePanel from "@/components/molecules/SidePanel";
import DeviceFormPanel from "@/components/organisms/DeviceFormPanel";
import { useDevicesPagination } from "@/hooks/useDevices";
import type { Device } from "@/types/device";

type PanelState = { mode: "add" } | { mode: "edit"; device: Device } | null;

const DeviceManagementPage = () => {
    const [panel, setPanel] = useState<PanelState>(null);
    const pagination = useDevicesPagination();

    const closePanel = () => setPanel(null);

    return (
        <div className={`transition-all duration-300 ${panel ? "sm:mr-105" : ""}`}>
            <div className="flex flex-col gap-7">
                <PageTitle
                    title="Perangkat"
                    description="Lihat, kelola, dan tambah data perangkat wearable beserta status keaktifannya"
                />
                <ListDevicesTable
                    pagination={pagination}
                    onAddDevice={() => setPanel({ mode: "add" })}
                    onEditDevice={(device) => setPanel({ mode: "edit", device })}
                />
            </div>

            <SidePanel isOpen={panel !== null} onClose={closePanel}>
                {panel && (
                    <DeviceFormPanel
                        key={panel.mode === "edit" ? panel.device.public_id : "add"}
                        device={panel.mode === "edit" ? panel.device : undefined}
                        onClose={closePanel}
                        onSaved={panel.mode === "edit" ? pagination.retry : pagination.refresh}
                    />
                )}
            </SidePanel>
        </div>
    );
};

export default DeviceManagementPage;