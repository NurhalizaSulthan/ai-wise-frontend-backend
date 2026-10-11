"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../atoms/Dropdown";
import { Icon } from "@iconify/react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 hover:bg-primary/10 p-2 rounded-xl cursor-pointer text-muted hover:text-primary dark:text-muted dark:hover:text-primary"
      >
        <Icon icon="material-symbols:account-circle-outline" width={30} />
        <span className="block mr-1 font-medium text-theme-sm">
          Siti Nurhaliza
        </span>

        <Icon
          icon="solar:alt-arrow-down-linear"
          width={20}
          height={20}
          className={`
    text-muted transition-transform duration-200
    ${isOpen ? "rotate-180" : ""}
  `}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4.25 flex w-65 flex-col rounded-2xl border border-border bg-background p-3 shadow-theme-lg dark:border-border dark:bg-background"
      >
        <div>
          <span className="block text-foreground dark:text-foreground font-medium">
            Siti Nurhaliza
          </span>
          <span className="mt-0.5 block text-theme-xs text-muted dark:text-muted">
            sitinurhaliza@gmail.com
          </span>
        </div>

        <div className=" pt-1 pb-1 border-b border-border"></div>

        <Link
          href="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-muted rounded-lg group hover:bg-danger/10 hover:text-danger"
        >
          <Icon icon="stash:signout" />
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
