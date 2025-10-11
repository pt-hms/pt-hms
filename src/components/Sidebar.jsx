"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const pathname = usePathname();

  // Daftar menu statis
  const menus = [
      { label: "Driver", icon: "mdi:account-outline", path: "/admin/driver" },
      { label: "SDA", icon: "mdi:view-dashboard-outline", path: "/admin/sda" },
    { label: "Riwayat Ritase", icon: "mdi:file-document-outline", path: "/admin/order" },
  ];

  return (
    <aside className="min-w-64 h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Image
          src="/logo.png" // ganti dengan path logo kamu (misal public/logo.png)
          alt="KJHMS Logo"
          width={90}
          height={90}
          className="object-contain"
        />
      </div>

      {/* Section Title */}
      <div className="px-4 text-xs font-semibold text-gray-500 tracking-wider">
        LAPORAN
      </div>

      <hr className="my-2 border-gray-200" />

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="flex flex-col">
          {menus.map((menu) => {
            const active = pathname === menu.path;
            return (
              <li key={menu.label}>
                <Link
                  href={menu.path}
                  className={`flex items-center gap-3 relative px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-green-100 text-green-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                    {active && <div className="absolute h-full w-1 right-0 bg-[#3FA83A] rounded-l-2xl"></div>}
                  <Icon icon={menu.icon} width={20} height={20} />
                  {menu.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
