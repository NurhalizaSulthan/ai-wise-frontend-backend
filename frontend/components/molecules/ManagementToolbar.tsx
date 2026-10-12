"use client";

import { Icon } from "@iconify/react";
import Button from "../atoms/Button";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";

const tabs = [
    {
        label: "Manajemen Pekerja",
        icon: "healthicons:factory-worker-outline",
        path: routes.workers,
    },
    {
        label: "Manajemen Perangkat",
        icon: "solar:cpu-linear",
        path: routes.devices,
    }
];

const ManagementToolbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="flex gap-6">
            {
                tabs.map((tab) => (
                    <Button key={tab.path} onClick={() => router.push(tab.path)} active={pathname === tab.path} startIcon={<Icon icon={tab.icon} className="size-7" />}>{tab.label}</Button>
                ))
            }
        </div>
    )
}

export default ManagementToolbar;