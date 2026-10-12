import { Icon } from "@iconify/react";

type AlertVariant = "error" | "success" | "info";

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    onClose?: () => void;
}

const STYLES: Record<AlertVariant, { box: string; icon: string; name: string }> = {
    error: { box: "border-danger/30 bg-danger/10 text-danger", icon: "material-symbols:error-outline-rounded", name: "Gagal" },
    success: { box: "border-success/30 bg-success/10 text-success", icon: "material-symbols:check-circle-outline-rounded", name: "Berhasil" },
    info: { box: "border-primary/30 bg-primary/10 text-primary", icon: "material-symbols:info-outline-rounded", name: "Info" },
};

const Alert = ({ variant = "error", title, children, onClose }: AlertProps) => {
    const s = STYLES[variant];
    return (
        <div role="alert" className={`flex items-start gap-3 rounded-lg border p-3 ${s.box}`}>
            <Icon icon={s.icon} className="mt-0.5 size-5 shrink-0" />
            <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{title ?? s.name}</p>
                <p className="mt-0.5 text-foreground/80">{children}</p>
            </div>
            {onClose && (
                <button type="button" onClick={onClose} className="shrink-0 cursor-pointer opacity-70 hover:opacity-100">
                    <Icon icon="iconamoon:close-duotone" className="size-4" />
                </button>
            )}
        </div>
    );
};

export default Alert;