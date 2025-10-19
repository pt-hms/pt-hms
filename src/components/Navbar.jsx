"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/driver/history", icon: "material-symbols:history-rounded", label: "Riwayat" },
    { href: "/driver", icon: "material-symbols:print-outline-rounded", label: "Cetak" },
    { href: "/driver/ritase", icon: "material-symbols:upload", label: "Unggah" },
    { href: "/driver/profile", icon: "iconamoon:profile-fill", label: "Akun" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-2 border-t border-gray-200 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200"
          >
            <div className="relative flex flex-col items-center">
              {/* Icon */}
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                  isActive ? "text-[#e10b16]" : "text-gray-500"
                }`}
              >
                <Icon
                  icon={item.icon}
                  width={28}
                  height={28}
                />
              </div>

              {/* Highlight circle bawah icon aktif */}
              {isActive && (
                <div className="absolute -bottom-[6px] w-2 h-2 bg-[#e10b16] rounded-full"></div>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-[11px] font-medium transition-colors duration-200 ${
                isActive ? "text-[#e10b16]" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
