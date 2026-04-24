import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

const Layout = () => {
    return (
        <div className="bg-black min-h-screen font-['Plus_Jakarta_Sans']">
            <Navbar />
            <main className="pt-[64px] sm:pt-[80px]">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;