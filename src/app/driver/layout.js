import BottomNavbar from "@/components/Navbar";

export default function DriverLayout({ children }) {


    return (
        <div className="bg-[#FFF9F0] max-h-screen">
            {children}
            <BottomNavbar />
        </div>
    )
}
