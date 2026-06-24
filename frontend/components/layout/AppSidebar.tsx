"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useSidebar } from "../contex/SidebarContex";

type NavItem = {
    name: string;
    icon: string;
    path?: string;
    subItems?: {
        name: string;
        path: string;
    }[];
};

const navItems: NavItem[] = [
    {
        name: "Dashboard",
        icon: "solar:home-2-linear",
        path: "/dashboard",
    },
    {
        name: "Worker",
        icon: "mdi:worker",
        path: "/workers",
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } =
        useSidebar();

    const pathname = usePathname();

    const isSidebarOpen = isExpanded || isMobileOpen;

    const [openSubmenu, setOpenSubmenu] = useState<{
        index: number;
    } | null>(null);

    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => pathname === path || pathname.startsWith(`${path}/`),
        [pathname]
    );

    const handleToggle = () => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const handleLinkClick = () => {
        if (isMobileOpen) {
            toggleMobileSidebar();
        }
    };

    const handleSubmenuToggle = (index: number) => {
        setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
    };

    useEffect(() => {
        const matchedIndex = navItems.findIndex((nav) =>
            nav.subItems?.some((item) => isActive(item.path))
        );

        if (matchedIndex !== -1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenSubmenu({ index: matchedIndex });
        } else {
            setOpenSubmenu(null);
        }
    }, [pathname, isActive]);

    useEffect(() => {
        if (!openSubmenu) return;

        const key = `main-${openSubmenu.index}`;
        const submenu = subMenuRefs.current[key];

        if (submenu) {
            setSubMenuHeight((prev) => ({
                ...prev,
                [key]: submenu.scrollHeight,
            }));
        }
    }, [openSubmenu]);

    const renderMenuItems = (items: NavItem[]) => (
        <ul className="flex flex-col gap-2">
            {items.map((nav, index) => {
                const isSubmenuOpen = openSubmenu?.index === index;

                if (nav.subItems) {
                    return (
                        <li key={nav.name}>
                            <button
                                type="button"
                                onClick={() => handleSubmenuToggle(index)}
                                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-7 text-sm font-medium transition
									${isSubmenuOpen
                                        ? "bg-primary text-foreground shadow-md shadow-primary/25"
                                        : "text-muted hover:bg-primary/10 hover:text-primary"
                                    }
									${isSidebarOpen ? "justify-start" : "justify-center"}
								`}
                            >
                                <Icon icon={nav.icon} className="size-5 shrink-0" />

                                {isSidebarOpen && (
                                    <>
                                        <span>{nav.name}</span>

                                        <Icon
                                            icon="solar:alt-arrow-down-linear"
                                            className={`ml-auto size-5 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </>
                                )}
                            </button>

                            {isSidebarOpen && (
                                <div
                                    ref={(el) => {
                                        subMenuRefs.current[`main-${index}`] = el;
                                    }}
                                    className="overflow-hidden transition-all duration-300"
                                    style={{
                                        height: isSubmenuOpen
                                            ? `${subMenuHeight[`main-${index}`] || 0}px`
                                            : "0px",
                                    }}
                                >
                                    <ul className="ml-6 mt-2 space-y-1 border-l border-border pl-4">
                                        {nav.subItems.map((subItem) => (
                                            <li key={subItem.name}>
                                                <Link
                                                    href={subItem.path}
                                                    onClick={handleLinkClick}
                                                    className={`block rounded-xl px-3 py-3 text-sm transition ${isActive(subItem.path)
                                                            ? "bg-primary/10 font-medium text-primary"
                                                            : "text-muted hover:bg-primary/10 hover:text-primary"
                                                        }`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    );
                }

                if (!nav.path) return null;

                return (
                    <li key={nav.name}>
                        <Link
                            href={nav.path}
                            onClick={handleLinkClick}
                            className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition
								${isActive(nav.path)
                                    ? "bg-primary text-background dark:text-foreground shadow-md shadow-primary/25"
                                    : "text-muted hover:bg-primary/10 hover:text-primary"
                                }
								${isSidebarOpen ? "justify-start" : "justify-center"}
							`}
                        >
                            <Icon icon={nav.icon} className="size-5 shrink-0" />

                            {isSidebarOpen && <span>{nav.name}</span>}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {isMobileOpen && (
                <button
                    type="button"
                    onClick={toggleMobileSidebar}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
                    aria-label="Close sidebar overlay"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-surface dark:bg-background px-5 py-5 text-muted shadow-sm transition-all duration-300
					${isSidebarOpen ? "w-72" : "w-22"}
					${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
				`}
            >
                {/* Header Sidebar */}
                <div className="relative mb-8 flex h-14 items-center">
                    {isSidebarOpen ? (
                        <div className="relative flex w-full items-center gap-3">
                            <Link
                                href="/dashboard"
                                onClick={handleLinkClick}
                                className="flex min-w-0 items-center gap-3"
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-background dark:text-foreground shadow-md shadow-primary/20">
                                    <Icon icon="fa6-solid:helmet-safety" className="text-xl" />
                                </div>

                                <h1 className="truncate text-xl font-bold text-primary">
                                    AI <span className="text-tertiary">WISE</span>
                                </h1>
                            </Link>

                            <button
                                type="button"
                                onClick={handleToggle}
                                className="absolute right-0 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl text-muted transition hover:bg-primary/10 hover:text-primary"
                                aria-label="Collapse sidebar"
                            >
                                <Icon icon="mynaui:sidebar" className="size-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex w-full justify-center">
                            <button
                                type="button"
                                onClick={handleToggle}
                                className="group flex size-11 cursor-pointer items-center justify-center rounded-2xl text-primary transition hover:bg-primary/10"
                                aria-label="Expand sidebar"
                            >
                                <Icon
                                    icon="fa6-solid:helmet-safety"
                                    className="size-6 transition group-hover:hidden"
                                />

                                <Icon
                                    icon="mynaui:sidebar"
                                    className="hidden size-5 text-muted group-hover:block"
                                />
                            </button>
                        </div>
                    )}
                </div>

                <nav className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
                    {isSidebarOpen && (
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted/70">
                            Menu
                        </h2>
                    )}

                    {renderMenuItems(navItems)}
                </nav>
            </aside>
        </>
    );
};

export default AppSidebar;