"use client";

import { useCallback, useState } from "react";
import PageTitle from "@/components/molecules/PageTitle";
import ListWorkersTable from "@/components/organisms/ListWorkersTable";
import SidePanel from "@/components/molecules/SidePanel";
import WorkerFormPanel from "@/components/organisms/WorkerFormPanel";
import { useWorkersPagination } from "@/hooks/useWorkers";
import type { Worker } from "@/types/worker";

type PanelState = { mode: "add" } | { mode: "edit"; worker: Worker } | null;

const WorkerManagementPage = () => {
    const [panel, setPanel] = useState<PanelState>(null);
    const pagination = useWorkersPagination();

    const closePanel = useCallback(() => setPanel(null), []);
    const openAdd = useCallback(() => setPanel({ mode: "add" }), []);
    const openEdit = useCallback(
        (worker: Worker) => setPanel({ mode: "edit", worker }),
        [],
    );

    return (
        <div className={`transition-all duration-300 ${panel ? "sm:mr-105" : ""}`}>
            <div className="flex flex-col gap-7">
                <PageTitle
                    title="Pekerja"
                    description="Lihat, kelola, dan tambah data pekerja termasuk profil dan status keaktifan yang terhubung dengan perangkat wearable"
                />
                <ListWorkersTable
                    pagination={pagination}
                    onAddWorker={openAdd}
                    onEditWorker={openEdit}
                />
            </div>

            <SidePanel isOpen={panel !== null} onClose={closePanel}>
                {panel && (
                    <WorkerFormPanel
                        // key me-reset form dan flatpickr saat pindah tambah/edit atau antar pekerja
                        key={panel.mode === "edit" ? panel.worker.public_id : "add"}
                        worker={panel.mode === "edit" ? panel.worker : undefined}
                        isOpen
                        onClose={closePanel}
                        onSaved={panel.mode === "edit" ? pagination.retry : pagination.refresh}
                    />
                )}
            </SidePanel>
        </div>
    );
};

export default WorkerManagementPage;