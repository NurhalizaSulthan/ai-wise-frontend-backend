import { Icon } from "@iconify/react";
import Button from "../atoms/Button";

type PanelHeaderProps = {
    icon: string;
    title: string;
    subtitle?: string;
    onClose: () => void;
};

const PanelHeader = ({ icon, title, subtitle, onClose }: PanelHeaderProps) => (
    <>
        <div className="flex shrink-0 mt-1 items-start justify-between gap-2 px-4 pt-5 pb-4 sm:px-6 sm:pt-6">
            <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/60 text-background sm:size-12">
                    <Icon icon={icon} className="size-7" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
                    {subtitle && (
                        <p className="text-xs leading-relaxed text-muted sm:text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <Button
                size="icon"
                variant="ghost"
                rounded="full"
                onClick={onClose}
                startIcon={<Icon icon="iconamoon:close-duotone" className="size-5 sm:size-6" />}
            />
        </div>

        <div className="shrink-0 border-t border-border" />
    </>
);

export default PanelHeader;