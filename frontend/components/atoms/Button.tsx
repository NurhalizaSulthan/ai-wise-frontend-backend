import React, { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "icon";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  rounded?: "lg" | "full";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  active?: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  rounded = "lg",
  startIcon,
  endIcon,
  onClick,
  active,
  activeClassName = "bg-primary/30 text-primary shadow-lg",
  inactiveClassName = "bg-background text-foreground hover:bg-muted/30",
  className = "",
  disabled = false,
}) => {
  const sizeClasses = {
    sm: "h-10 px-3 text-sm",
    md: "h-12 px-4 text-base",
    lg: "h-13 px-5 text-lg",
    icon: "size-10 p-0",
  };

  const variantClasses = {
    primary:
      "bg-primary text-background shadow-lg hover:bg-secondary disabled:bg-muted",
    secondary:
      "bg-muted/20 text-foreground hover:bg-muted/30 hover:text-primary disabled:bg-muted",
    outline:
      "border-2 border-muted/50 text-muted",
    ghost:
      "text-muted hover:bg-muted/10 hover:text-danger",
  };

  const roundedClasses = {
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const stateClasses =
    active === undefined
      ? variantClasses[variant]
      : active
        ? activeClassName
        : inactiveClassName;

  return (
    <button
      className={`inline-flex items-center justify-center font-semibold gap-2 cursor-pointer tracking-widest transition ${roundedClasses[rounded]} ${className} ${sizeClasses[size]} ${stateClasses} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;