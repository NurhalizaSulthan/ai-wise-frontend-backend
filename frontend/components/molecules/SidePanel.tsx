"use client";

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    widthClassName?: string;
}

const SidePanel = ({
    isOpen,
    children,
    widthClassName = "w-96 sm:w-[420px]",
}: SidePanelProps) => {
    if (!isOpen) return null;

    return (
        <div
            className={`fixed top-16 right-0 bottom-0 z-30 ${widthClassName} overflow-y-auto border-l border-border bg-surface shadow-xl dark:bg-surface`}
        >
            {children}
        </div>
    );
};

export default SidePanel;