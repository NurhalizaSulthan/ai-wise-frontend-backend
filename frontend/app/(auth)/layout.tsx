import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-background z-1 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col sm:p-0 ">
        <div className="lg:w-1/2 w-full h-full lg:grid items-center hidden bg-primary">
          <div className="relative w-full h-full p-12 flex flex-col justify-center items-center z-1">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-background opacity-10 rounded-full"></div>

            {/* ICON BRAND AI WISE */}
            <div className="absolute top-12 left-12">
              <Link href="/" className="flex justify-center items-center gap-3 text-brand">
                <Icon icon="fa6-solid:helmet-safety" className="text-2xl" />
                <h1 className="text-2xl font-bold">AI <span className="text-tertiary">WISE</span></h1>
              </Link>
            </div>

            {/* HERO BANNER */}
            <div className="w-full px-10 py-14 text-brand">
              <h1 className="text-4xl--line-height font-bold mb-2.5 leading-tight">
                Sistem Pemantauan Wearable Keselamatan Kerja
              </h1>
              <p className="text-2xl">
                Monitoring real-time  Pekerja melalui sistem Wearable Keselamatan Kerja
              </p>
            </div>

          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
