"use client"
import { AppShell } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import DashboardNavbar from '@/components/DashboardNavbar'
import Sidebar from '@/components/Sidebar'
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import Head from "next/head";

export default function Dashboard({ children, title }) {
    const [opened, { toggle }] = useDisclosure();
    // const [darkMode, setDarkMode] = useState(false);
    // useHotkeys([["ctrl+k", () => setDarkMode((prev) => !prev)]]);

    // const theme = localStorage.getItem("theme");
    // useEffect(() => {
    //     setDarkMode(theme ? true : false);
    // }, []);
    // useEffect(() => {
    //     localStorage.setItem("theme", darkMode ? 1 : "");
    // }, [darkMode]);
    return (
        <AppShell
            padding="md"
            withBorder={false}
            transitionDuration={400}
            navbar={{
                width: 256,
                breakpoint: "sm",
                collapsed: { mobile: !opened, desktop: opened },
            }}
        >

            <AppShell.Navbar
                // transitionDuration={"2000ms"}
                visibleFrom="sm"
                withBorder={false}
            // className={`${darkMode ? "dark" : ""}`}
            >
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main
                className="bg-slate-100 min-h-screen p-6"
            // className={`${darkMode ? "dark bg-dashboard-dark" : "bg-dashboard"
            //     }`}
            >
                <Head title={title} />
                <div className="w-full h-12 bg-white rounded-xl !shadow-normal flex justify-between items-center mb-5 dark:bg-slate-800 dark:text-white transition duration-200">
                    <DashboardNavbar
                        toggle={toggle}
                        opened={opened}
                    // setDarkMode={setDarkMode}
                    // darkMode={darkMode}
                    />
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    {children}
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
