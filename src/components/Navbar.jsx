"use client"
import Link from "next/link";
import { usePathname, useRouter  } from "next/navigation";
import { Icon } from "@iconify/react";

export default function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/driver/history", icon: <Icon icon="material-symbols:history-rounded" width={26} height={26} />, label: "Riwayat" },
    { href: "/driver", icon: <Icon width={28} height={28} icon="material-symbols:upload"/>, label:"Unggah" },
    { href: "/driver/profile", icon: <Icon icon="iconamoon:profile-fill" width={26} height={26} />, label: "Akun"}, 
  ];

  const handleUploadClick = () => {
    if (pathname == "/driver") {
      window.dispatchEvent(new Event("trigger-upload"));
    } else {
      router.push("/driver");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#AE8B56] flex justify-around items-center z-50 shadow-inner">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;

        if (index === 1) {
          return (
            <Link
              key={item.href}
              onClick={handleUploadClick}
              href={item.href}
              className="relative -top-5 flex flex-col items-center text-white "
            >
            <div className="bg-[#AE8B56] rounded-full p-4 shadow-lg">
              <div className="bg-white rounded-full p-4 shadow-md">
                <div className="text-[#AE8B56]">{item.icon}</div>
              </div>
            </div>
            <span className="text-[12px] mt-1 font-semibold text-white">{item.label}</span>
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
             <span className="text-[12px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
