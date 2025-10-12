"use client"
import { AppShell } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import Sidebar from '@/components/dashboard/Sidebar'
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import Head from "next/head";
import { usePathname } from 'next/navigation'

export default function Dashboard({ children, title }) {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();

    const pageTitle = {
        "/admin": "Dashboard",
        "/admin/driver": "Driver",
        "/admin/sij": "Surat Izin Jalan",
        "/admin/order": "Riwayat Ritase",
    }[pathname] || "KJHMS";
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

            >
                <Sidebar />
            </AppShell.Navbar>

            <AppShell.Main
                className={`bg-slate-100 min-h-screen p-6`}
            >
                <Head title={title} />
                <div className="w-full h-12 bg-white rounded-xl !shadow-normal flex justify-between items-center mb-5 transition duration-200">
                    <DashboardNavbar
                        toggle={toggle}
                        opened={opened}
                    />
                </div>
                <h1 className="text-xl font-medium mb-5">{pageTitle}</h1>
                <div className="bg-white rounded-xl shadow p-6">
                    {children}
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
