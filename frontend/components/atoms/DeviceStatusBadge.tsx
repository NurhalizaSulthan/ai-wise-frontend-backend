import Badge from "./Badge";

interface DeviceStatusBadgeProps {
    status: string;
}

const DeviceStatusBadge = ({ status }: DeviceStatusBadgeProps) => {
    const isActive = status === "aktif";

    return (
        <Badge
            variant="light"
            color={isActive ? "success" : "light"}
            startIcon={
                <span
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted"
                        }`}
                />
            }
        >
            {isActive ? "Aktif" : "Tidak Aktif"}
        </Badge>
    );
};

export default DeviceStatusBadge;