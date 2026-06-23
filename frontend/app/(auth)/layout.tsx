import { ThemeProvider } from "@/components/contex/ThemeContex";
import ThemeTogglerTwo from "@/components/atoms/ThemeTogglerTwo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative w-full h-full p-12 flex flex-col justify-center items-center z-1">
              <div className="absolute -top-20 -left-20 w-96 h-96 bg-white opacity-10 rounded-full pointer-events-none"></div>

              <div className="absolute top-12 left-12">
                <Link href="/" className="block">
                  <Image
                    width={231}
                    height={48}
                    src="/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
              </div>

              <div className="w-full max-w-lg text-start">
                <h1 className="text-4xl text-gray-200 font-bold mb-6 leading-tight">
                  Safety Wearable Monitoring System
                </h1>

                <p className="text-lg text-gray-200">
                  Real-time worker monitoring through a Safety
                  <br />
                  Wearable System
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
