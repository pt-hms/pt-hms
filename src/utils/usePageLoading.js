"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook untuk menampilkan state loading global
 * selama transisi halaman di Next.js App Router.
 */
export default function usePageLoading() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Aktifkan loading saat route mulai berubah
        setLoading(true);

        // Simulasikan waktu transisi (halaman baru sedang render)
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 600); // durasi ideal 0.5–0.7 detik

        return () => clearTimeout(timeout);
    }, [pathname]);

    return loading;
}
