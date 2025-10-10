"use client"
import Link from "next/link";
import { usePathname, useRouter  } from "next/navigation";
import { Icon } from "@iconify/react";

export default function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/driver/history", icon: <Icon icon="material-symbols:history-rounded" width={26} height={26} />, label: "Riwayat" },
    { href: "/driver/print", icon: <Icon icon="material-symbols:print-outline-rounded" width={26} height={26} />, label: "Print"}, 
    { href: "/driver", icon: <Icon width={26} height={26} icon="material-symbols:upload"/>, label:"Unggah" },
    { href: "/driver/profile", icon: <Icon icon="iconamoon:profile-fill" width={26} height={26} />, label: "Akun"}, 
  ];


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#AE8B56] flex justify-around items-center z-50 shadow-inner">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-white w-18 ${isActive ? "opacity-100 relative -top-4" : "opacity-70 text-white "}`}
          >
            {isActive? 
            <div className="flex flex-col items-center gap-1">
            <div className="bg-[#AE8B56] rounded-full p-3 shadow-lg">
              <div className="bg-white rounded-full p-3 shadow-md">
                <div className="text-[#AE8B56]">{item.icon}</div>
              </div>
              </div>
              <span className={`text-[14px] font-semibold text-white`}>{item.label}</span>
            </div>
            :
            <div className="flex flex-col items-center gap-1">
              <div className={`text-[#AE8B56]" : "text-white`}>{item.icon}</div>
             <span className={`text-[14px] font-semibold text-white`}>{item.label}</span>
             </div>
            }
          </Link>
        );
      })}
    </nav>
  );
}
