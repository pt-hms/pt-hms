import BottomNavbar from "@/components/Navbar";
import { Poppins } from "next/font/google"

const fontPoppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: "400"
});

export default function DriverLayout({ children }) {


    return (
        <div className={`bg-[#ECECED] max-h-screen ${fontPoppins.variable}`}>
            {children}
            <BottomNavbar />
        </div>
    )
}
