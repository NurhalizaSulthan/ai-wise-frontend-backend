"use client";

import React from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import Backdrop from "@/components/layout/Backdrop";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/contex/SidebarContex";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered } = useSidebar();

  const isSidebarLarge = isExpanded || isHovered;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Backdrop untuk mobile sidebar */}
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`
          min-h-screen
          min-w-0
          overflow-x-hidden
          transition-all
          duration-300
          ease-in-out
          lg:ml-22.5
          ${isSidebarLarge ? "xl:ml-72.5" : "xl:ml-22.5"}
        `}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main
          className="
            min-w-0
            px-4
            pb-6
            pt-22
            sm:px-5
            md:px-6
            lg:px-8
          "
        >
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}