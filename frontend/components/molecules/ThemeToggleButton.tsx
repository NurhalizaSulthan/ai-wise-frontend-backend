"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

export const ThemeToggleButton: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="flex h-11 items-center justify-start gap-2 px-3 text-muted transition-colors hover:text-primary"
      >
        <Icon icon="solar:moon-linear" className="size-7 shrink-0" />
        <span className="block whitespace-nowrap text-sm font-medium">
          Dark Mode
        </span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-11 items-center hover:bg-primary/10 rounded-xl justify-start gap-2 px-3 text-muted transition-colors cursor-pointer hover:text-primary"
    >
      <Icon
        icon={isDark ? "solar:sun-2-linear" : "solar:moon-linear"}
        className="size-7 shrink-0"
      />

      <span className="block whitespace-nowrap text-sm font-medium">
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
};