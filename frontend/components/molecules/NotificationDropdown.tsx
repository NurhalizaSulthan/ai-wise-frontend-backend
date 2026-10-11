"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Dropdown } from "../atoms/Dropdown";
import { DropdownItem } from "../atoms/DropdownItem";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="
          flex h-11 items-center gap-2 rounded-xl px-3 cursor-pointer
          text-muted transition-colors
          hover:bg-primary/10 hover:text-primary
          dark:hover:bg-primary/15
        "
      >
        {/* Icon Wrapper */}
        <span className="relative inline-flex items-center justify-center">
          {notifying && (
            <span className="absolute -right-0.5 -top-0.5 z-10 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-error" />
            </span>
          )}

          <Icon
            icon="solar:bell-bing-linear"
            className="size-7 shrink-0"
          />
        </span>

        <span className="hidden whitespace-nowrap text-sm font-medium sm:block">
          Alert
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="
          absolute right-0 z-50 mt-3 flex w-[320px] flex-col
          rounded-2xl border border-border bg-card p-3
          shadow-xl
          sm:w-90
        "
      >
        <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
          <div>
            <h5 className="text-base font-semibold text-foreground">
              Notifications
            </h5>
            <p className="text-xs text-muted">
              Latest safety alerts
            </p>
          </div>

          <button
            type="button"
            onClick={closeDropdown}
            className="
              flex size-9 items-center justify-center rounded-full
              text-muted transition-colors
              hover:bg-foreground/10 hover:text-foreground
            "
            aria-label="Close notification"
          >
            <Icon icon="solar:close-circle-linear" className="size-6" />
          </button>
        </div>

        <ul className="flex max-h-100 flex-col overflow-y-auto custom-scrollbar">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="
                flex gap-3 rounded-xl border-b border-border p-3
                transition-colors hover:bg-primary/10
              "
            >
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon icon="solar:danger-triangle-linear" className="size-5" />

                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-orange-400" />
              </span>

              <span className="block min-w-0">
                <span className="mb-1 block text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    Bad Posture Detected
                  </span>{" "}
                  alert from worker area.
                </span>

                <span className="flex items-center gap-2 text-xs text-muted">
                  <Icon icon="solar:clock-circle-linear" className="size-4" />
                  <span>5 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="
                flex gap-3 rounded-xl border-b border-border p-3
                transition-colors hover:bg-primary/10
              "
            >
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                <Icon icon="solar:fire-linear" className="size-5" />

                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-warning" />
              </span>

              <span className="block min-w-0">
                <span className="mb-1 block text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    Heat Exposure Warning
                  </span>{" "}
                  requires attention.
                </span>

                <span className="flex items-center gap-2 text-xs text-muted">
                  <Icon icon="solar:clock-circle-linear" className="size-4" />
                  <span>10 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="
                flex gap-3 rounded-xl border-b border-border p-3 
                transition-colors hover:bg-primary/10
              "
            >
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                <Icon icon="solar:shield-warning-linear" className="size-5" />

                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-error" />
              </span>

              <span className="block min-w-0">
                <span className="mb-1 block text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    Fall Risk Alert
                  </span>{" "}
                  detected today.
                </span>

                <span className="flex items-center gap-2 text-xs text-muted">
                  <Icon icon="solar:clock-circle-linear" className="size-4" />
                  <span>15 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>
        </ul>

        <Link
          href="/alerts"
          className="
            mt-3 flex items-center justify-center gap-2 rounded-xl
            border border-border bg-background px-4 py-2.5
            text-sm font-medium text-foreground transition-colors
            hover:bg-primary hover:text-background
          "
        >
          View All Notifications
          <Icon icon="solar:arrow-right-linear" className="size-4" />
        </Link>
      </Dropdown>
    </div>
  );
}