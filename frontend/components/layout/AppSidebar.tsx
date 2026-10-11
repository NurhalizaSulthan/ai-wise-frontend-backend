"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useSidebar } from "../context/SidebarContex";

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
        name: "Monitoring",
        icon: "carbon:cloud-monitoring",
        path: "/monitoring",
    },
    {
        name: "Manajemen",
        icon: "solar:users-group-rounded-linear",
        path: "/manajemen/pekerja",
        subItems: [
            { name: "Pekerja", path: "/manajemen/pekerja" },
            { name: "Perangkat", path: "/manajemen/perangkat" },
        ],
    },
];

type FlyoutPos = { top: number; left: number };

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } =
        useSidebar();

    const pathname = usePathname();

    const isSidebarOpen = isExpanded || isMobileOpen;

    const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(
        null
    );
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );

    const [openFlyout, setOpenFlyout] = useState<{
        index: number;
        pos: FlyoutPos;
    } | null>(null);
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const itemRefs = useRef<Record<number, HTMLLIElement | null>>({});
    const flyoutRef = useRef<HTMLDivElement | null>(null);
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => pathname === path || pathname.startsWith(`${path}/`),
        [pathname]
    );

    const isParentActive = useCallback(
        (nav: NavItem) => {
            if (nav.subItems) {
                return nav.subItems.some((sub) => isActive(sub.path));
            }
            return nav.path ? isActive(nav.path) : false;
        },
        [isActive]
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
        setOpenFlyout(null);
    };

    const handleSubmenuToggle = (index: number) => {
        setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
    };

    const computePos = (index: number): FlyoutPos | null => {
        const el = itemRefs.current[index];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.right + 8 };
    };

    const openFlyoutFor = (index: number) => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        const pos = computePos(index);
        if (pos) setOpenFlyout({ index, pos });
    };

    const handleItemClick = (index: number, hasSubItems: boolean) => {
        if (!hasSubItems) return;
        if (openFlyout?.index === index) {
            setOpenFlyout(null);
        } else {
            openFlyoutFor(index);
        }
    };

    const scheduleClose = () => {
        closeTimeout.current = setTimeout(() => setOpenFlyout(null), 200);
    };

    const cancelClose = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };

    useEffect(() => {
        if (!openFlyout) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const triggerEl = itemRefs.current[openFlyout.index];
            if (
                flyoutRef.current?.contains(target) ||
                triggerEl?.contains(target)
            ) {
                return;
            }
            setOpenFlyout(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openFlyout]);

    useEffect(() => {
        if (!openFlyout) return;

        const reposition = () => {
            const pos = computePos(openFlyout.index);
            if (pos) setOpenFlyout((prev) => (prev ? { ...prev, pos } : prev));
        };

        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        return () => {
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [openFlyout]);

    const [prevPathname, setPrevPathname] = useState(pathname);
    const [prevIsSidebarOpen, setPrevIsSidebarOpen] = useState(isSidebarOpen);

    if (prevPathname !== pathname || prevIsSidebarOpen !== isSidebarOpen) {
        if (prevPathname !== pathname) {
            const matchedIndex = navItems.findIndex((nav) =>
                nav.subItems?.some((item) => isActive(item.path))
            );
            setOpenSubmenu(matchedIndex !== -1 ? { index: matchedIndex } : null);
        }

        setPrevPathname(pathname);
        setPrevIsSidebarOpen(isSidebarOpen);

        if (openFlyout !== null) {
            setOpenFlyout(null);
        }
    }

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
                const parentActive = isParentActive(nav);
                const hasSubItems = !!nav.subItems?.length;
                const isFlyoutOpen = !isSidebarOpen && openFlyout?.index === index;

                return (
                    <li
                        key={nav.name}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        className="relative"
                        onMouseEnter={() =>
                            !isSidebarOpen && hasSubItems && openFlyoutFor(index)
                        }
                        onMouseLeave={() => hasSubItems && scheduleClose()}
                    >
                        {hasSubItems ? (
                            isSidebarOpen ? (
                                <button
                                    type="button"
                                    onClick={() => handleSubmenuToggle(index)}
                                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${parentActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted hover:bg-primary/10 hover:text-primary"
                                        }`}
                                >
                                    <Icon icon={nav.icon} className="size-5 shrink-0" />
                                    <span>{nav.name}</span>
                                    <Icon
                                        icon="solar:alt-arrow-down-linear"
                                        className={`ml-auto size-4 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleItemClick(index, true)}
                                    className={`flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition ${parentActive || isFlyoutOpen
                                        ? "bg-primary text-brand shadow-md shadow-primary/25"
                                        : "text-muted hover:bg-primary/10 hover:text-primary"
                                        }`}
                                    aria-label={nav.name}
                                    aria-expanded={isFlyoutOpen}
                                >
                                    <Icon icon={nav.icon} className="size-5 shrink-0" />
                                </button>
                            )
                        ) : (
                            <Link
                                href={nav.path ?? "#"}
                                onClick={handleLinkClick}
                                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition
                                    ${parentActive
                                        ? "bg-primary text-brand shadow-md shadow-primary/25"
                                        : "text-muted hover:bg-primary/10 hover:text-primary"
                                    }
                                    ${isSidebarOpen ? "justify-start" : "justify-center"}
                                `}
                            >
                                <Icon icon={nav.icon} className="size-5 shrink-0" />
                                {isSidebarOpen && <span>{nav.name}</span>}
                            </Link>
                        )}

                        {hasSubItems && isSidebarOpen && (
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
                                    {nav.subItems!.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link
                                                href={subItem.path}
                                                onClick={handleLinkClick}
                                                className={`block rounded-xl px-3 py-3 text-sm transition ${isActive(subItem.path)
                                                    ? "bg-primary font-medium text-brand"
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
            })}
        </ul>
    );

    const activeFlyoutItem =
        openFlyout && !isSidebarOpen ? navItems[openFlyout.index] : null;

    const flyoutPortal =
        activeFlyoutItem && openFlyout && typeof document !== "undefined"
            ? createPortal(
                <div
                    ref={flyoutRef}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    style={{
                        position: "fixed",
                        top: openFlyout.pos.top,
                        left: openFlyout.pos.left,
                        zIndex: 9999,
                    }}
                    className="w-52 rounded-2xl border border-border bg-surface p-2 shadow-card"
                >
                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                        {activeFlyoutItem.name}
                    </p>
                    <ul className="space-y-1">
                        {activeFlyoutItem.subItems!.map((subItem) => (
                            <li key={subItem.name}>
                                <Link
                                    href={subItem.path}
                                    onClick={handleLinkClick}
                                    className={`block rounded-xl px-3 py-2.5 text-sm transition ${isActive(subItem.path)
                                        ? "bg-primary font-medium text-brand"
                                        : "text-muted hover:bg-primary/10 hover:text-primary"
                                        }`}
                                >
                                    {subItem.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )
            : null;

    return (
        <>
            {isMobileOpen && (
                <button
                    type="button"
                    onClick={toggleMobileSidebar}
                    className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[1px] lg:hidden"
                    aria-label="Close sidebar overlay"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-surface px-5 py-5 text-muted shadow-soft transition-all duration-300
                    ${isSidebarOpen ? "w-72" : "w-22"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <div className="relative mb-8 flex h-14 items-center">
                    {isSidebarOpen ? (
                        <div className="relative flex w-full items-center gap-3">
                            <Link
                                href="/dashboard"
                                onClick={handleLinkClick}
                                className="flex min-w-0 items-center gap-3"
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-brand shadow-md shadow-primary/20">
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
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                            Menu
                        </h2>
                    )}

                    {renderMenuItems(navItems)}
                </nav>
            </aside>

            {flyoutPortal}
        </>
    );
};

export default AppSidebar;