"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { ThemeToggleButton } from "@/components/molecules/ThemeToggleButton";
import NotificationDropdown from "@/components/molecules/NotificationDropdown";
import UserDropdown from "@/components/molecules/UserDropdown";
import { useSidebar } from "@/components/contex/SidebarContex";

const AppHeader: React.FC = () => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

    const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } =
        useSidebar();

    const handleToggle = () => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen((prev) => !prev);
    };

    return (
        <header
            className={`fixed right-0 top-0 z-40 border-b border-border bg-surface dark:bg-background shadow-sm transition-all duration-300
				left-0
				${isExpanded ? "lg:left-72" : "lg:left-22"}
			`}
        >
            <div className="flex min-h-16 w-full flex-col lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                <div className="flex h-16 w-full items-center justify-between gap-3 px-4 lg:hidden">
                    <button
                        type="button"
                        onClick={handleToggle}
                        aria-label="Toggle sidebar"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-muted transition hover:bg-background hover:text-primary"
                    >
                        <Icon
                            icon={
                                isMobileOpen
                                    ? "solar:close-circle-linear"
                                    : "solar:sidebar-minimalistic-linear"
                            }
                            className="size-6"
                        />
                    </button>

                    <Link href="/dashboard" className="flex justify-center items-center gap-3">
                        <Icon icon="fa6-solid:helmet-safety" className="text-2xl text-primary"  />
                        <h1 className="text-2xl text-primary font-bold">AI <span className="text-tertiary">WISE</span></h1>
                    </Link>

                    <button
                        type="button"
                        onClick={toggleApplicationMenu}
                        aria-label="Toggle application menu"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-muted transition hover:bg-background hover:text-primary"
                    >
                        <Icon icon="solar:menu-dots-bold" className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:block" />

                <div
                    className={`${isApplicationMenuOpen ? "flex" : "hidden"
                        } w-full items-center justify-between gap-4 border-t border-border bg-surface px-4 py-3 lg:flex lg:w-auto lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-0`}
                >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggleButton />
                        <NotificationDropdown />
                    </div>

                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default AppHeader;