import { Icon } from "@iconify/react";

const Card = ({
    title,
    icon,
    right,
    children,
}: {
    title: string;
    icon: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) => (
    <section className="rounded-xl bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Icon icon={icon} className="size-5 text-muted" />
                {title}
            </h2>
            {right}
        </div>
        <div className="p-5">{children}</div>
    </section>
);

export default Card;