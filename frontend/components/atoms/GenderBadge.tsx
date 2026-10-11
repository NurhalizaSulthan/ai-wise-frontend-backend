"use client";

interface GenderBadgeProps {
    gender: "L" | "P" | string;
}

const GenderBadge = ({ gender }: GenderBadgeProps) => {
    const isMale = gender === "L";

    return (
        <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-semibold ${isMale
                    ? "bg-primary/30 text-primary"
                    : "bg-danger/30 text-danger"
                }`}
        >
            {gender}
        </span>
    );
};

export default GenderBadge;