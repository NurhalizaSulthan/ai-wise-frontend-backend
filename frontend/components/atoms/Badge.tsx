import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded-full font-medium";

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const variants: Record<BadgeVariant, Record<BadgeColor, string>> = {
    light: {
      primary: "bg-primary/10 text-primary",
      success: "bg-success/10 text-success",
      danger: "bg-danger/10 text-danger",
      warning: "bg-warning/10 text-warning",
      info: "bg-tertiary/10 text-tertiary",
      light: "bg-surface text-muted border border-border",
      dark: "bg-foreground/10 text-foreground",
    },
    solid: {
      primary: "bg-primary text-white",
      success: "bg-success text-white",
      danger: "bg-danger text-white",
      warning: "bg-warning text-white",
      info: "bg-tertiary text-white",
      light: "bg-surface text-foreground border border-border",
      dark: "bg-foreground text-background",
    },
  };

  const sizeClass = sizeStyles[size];
  const colorClass = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorClass} ${className}`}>
      {startIcon && <span className="inline-flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="inline-flex items-center">{endIcon}</span>}
    </span>
  );
};

export default Badge;