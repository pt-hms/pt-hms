"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Upload, User } from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/driver/history", icon: <History size={24} /> },
    { href: "/driver", icon: <Upload size={28} /> },
    { href: "/driver/profile", icon: <User size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#AE8B56] flex justify-around items-center py-2 z-50 shadow-inner">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;

        if (index === 1) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-5 bg-[#AE8B56] rounded-full p-4 shadow-lg flex flex-col items-center text-white"
            >
              <div className="bg-white rounded-full p-4 shadow-md">
                <div className="text-[#AE8B56]">{item.icon}</div>
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-white ${isActive ? "opacity-100" : "opacity-70"}`}
          >
            <div className="bg-white rounded-full p-2">
              <div className="text-[#AE8B56]">{item.icon}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
