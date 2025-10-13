"use client"
import BottomNavbar from "@/components/Navbar";
import { logoutUser, useAuth } from "@/utils/useAuth";
import { Poppins } from "next/font/google"
import { Button, Loader } from "@mantine/core"
import { useRouter } from "next/navigation";

const fontPoppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: "400"
});


export default function DriverLayout({ children }) {
    const { user, loading } = useAuth("driver");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader color="red" />
            </div>
        );
    }

    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        router.push("/");
    };

    return (
        <div className={`bg-[#ECECED] min-h-screen ${fontPoppins.variable} relative w-full`}>
            <div className="fixed right-2 top-2 z-2">
                <Button size="sm" color="#e10b16" onClick={handleLogout}>Keluar</Button>
            </div>
            <div className="lg:py-8 bg-gray-50">
                {children}
            </div>
            <BottomNavbar />
        </div>
    )
}
