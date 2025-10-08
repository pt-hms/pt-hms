import BottomNavbar from "@/components/Navbar";

export default function DriverLayout({ children }) {


    return (
        <html lang="id">
            <body className="bg-[#FFF9F0] max-h-screen">
                {children}
                <BottomNavbar />
            </body>
        </html>
    );
}
