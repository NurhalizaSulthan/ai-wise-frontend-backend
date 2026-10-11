"use client";

import React from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

const ThemedToaster = () => {
    const { resolvedTheme } = useTheme();
    return (
        <Toaster
            theme={resolvedTheme as "light" | "dark"}
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{ duration: 4000 }}
        />
    );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="ai-wise-theme"
        >
            {children}
            <ThemedToaster />
        </ThemeProvider>
    );
};

export default Providers;