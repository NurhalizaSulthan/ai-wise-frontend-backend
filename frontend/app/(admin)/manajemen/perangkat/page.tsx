"use client";

import { useCallback, useState } from "react";
import PageTitle from "@/components/molecules/PageTitle";
import ListDevicesTable from "@/components/organisms/ListDevicesTable";
import SidePanel from "@/components/molecules/SidePanel";
import DeviceFormPanel from "@/components/organisms/DeviceFormPanel";
import { useDevicesPagination } from "@/hooks/useDevices";
import type { Device } from "@/types/device";
import DeviceDetailPanel from "@/components/organisms/DeviceDetailPanel";
type PanelState =
    | { mode: "add" }
    | { mode: "edit"; device: Device }
    | { mode: "view"; device: Device }
    | null;

const DeviceManagementPage = () => {
    const [panel, setPanel] = useState<PanelState>(null);
    const pagination = useDevicesPagination();

    const closePanel = useCallback(() => setPanel(null), []);
    const openAdd = useCallback(() => setPanel({ mode: "add" }), []);
    const openView = useCallback(
        (device: Device) => setPanel({ mode: "view", device }),
        [],
    );
    const openEdit = useCallback(
        (device: Device) => setPanel({ mode: "edit", device }),
        [],
    );

    return (
        <div className={`transition-all duration-300 ${panel ? "sm:mr-105" : ""}`}>
            <div className="flex flex-col gap-7">
                <PageTitle
                    title="Perangkat"
                    description="Lihat, kelola, dan tambah data perangkat wearable beserta status keaktifannya"
                />
                <ListDevicesTable
                    pagination={pagination}
                    onAddDevice={openAdd}
                    onViewDevice={openView}
                    onEditDevice={openEdit}
                />
            </div>

            <SidePanel isOpen={panel !== null} onClose={closePanel}>
                {panel?.mode === "view" && (
                    <DeviceDetailPanel
                        key={`view-${panel.device.public_id}`}
                        publicId={panel.device.public_id}
                        onClose={closePanel}
                    />
                )}
                {panel && panel.mode !== "view" && (
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