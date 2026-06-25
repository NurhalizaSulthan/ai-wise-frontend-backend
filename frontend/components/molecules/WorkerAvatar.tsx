"use client";

interface WorkerAvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
}

const WorkerAvatar = ({
    name,
    size = "md",
}: WorkerAvatarProps) => {
    const initials = name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const sizeClasses = {
        sm: "h-8 w-8 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
    };

    return (
        <div
            className={`
                flex items-center justify-center
                rounded-full
                bg-secondary/10
                font-semibold
                text-primary
                ${sizeClasses[size]}
            `}
        >
            {initials}
        </div>
    );
};

export default WorkerAvatar;