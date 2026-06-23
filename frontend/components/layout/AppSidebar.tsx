"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/contex/SidebarContex";

import {
  ChevronDownIcon,
  HorizontaLDots,
  TableIcon,
  UserCircleIcon,
  HouseIcon,
} from "@/icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <HouseIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "Worker",
    path: "/Worker",
  },
  {
    icon: <TableIcon />,
    name: "Tables",
    subItems: [
      {
        name: "Basic Tables",
        path: "/basic-tables",
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } =
    useSidebar();

  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems?.some((item) => isActive(item.path))) {
        setOpenSubmenu({ index });
        submenuMatched = true;
      }
    });

    if (!submenuMatched) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;

      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group w-full ${
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } ${isExpanded ? "lg: justify-start" : "lg: justify-center"}`}
              >
                <span
                  className={
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }
                >
                  {nav.icon}
                </span>

                {isExpanded && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>

                    <ChevronDownIcon
                      className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {isExpanded && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`main-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`main-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 ml-9 space-y-1">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${isExpanded ? "justify-start" : "justify-center"}`}
              >
                <span
                  className={
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }
                >
                  {nav.icon}
                </span>

                {isExpanded && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900
      ${isExpanded || isMobileOpen ? "w-72.5" : "w-22.5"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Header Sidebar */}
      <div
        className={`flex items-center ${
          isExpanded ? "justify-between" : "justify-center"
        }`}
      >
        {isExpanded && (
          <Link href="/">
            <Image src="/LogoHeader.svg" alt="Logo" width={150} height={40} />
          </Link>
        )}

        <button
          onClick={handleToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg  text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          aria-label="Toggle Sidebar"
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          ) : (
            <Image src="/LogoHeader.svg" alt="Logo" width={28} height={28} />
          )}
        </button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <nav className="mb-6">
          <h2
            className={`mb-4 flex text-xs uppercase leading-5 text-gray-400 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            {isExpanded ? "Menu" : <HorizontaLDots />}
          </h2>

          {renderMenuItems(navItems)}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
