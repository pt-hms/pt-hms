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
      { label: "Dashboard", icon: "material-symbols:dashboard-outline-rounded", path: "/admin" },
      { label: "Driver", icon: "mdi:account-outline", path: "/admin/driver" },
      { label: "SIJ", icon: "solar:ticket-linear", path: "/admin/sij" },
    { label: "Riwayat Ritase", icon: "lets-icons:order-light", path: "/admin/order" },
  ];

  return (
    <aside className="min-w-64 h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Image
          src="/icon.png"
          alt="PT HMS Logo"
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
                      ? "bg-red-100 text-red-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                    {active && <div className="absolute h-full w-1 right-0 bg-[#e10b16] rounded-l-2xl"></div>}
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
