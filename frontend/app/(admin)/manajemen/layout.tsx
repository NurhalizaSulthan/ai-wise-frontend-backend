// import ManagementToolbar from "@/components/molecules/ManagementToolbar";
import React from "react";

const ManagementLayoutPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex flex-col gap-7">
            {children}
        </main>
    )
}


export default ManagementLayoutPage;