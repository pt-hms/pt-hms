"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook reusable untuk mendeteksi dan menangani event pergantian halaman.
 * 
 * @param {Function} onComplete - Fungsi yang dijalankan setelah route selesai berpindah.
 */
export default function useRouteLoading(onComplete) {
    const router = useRouter();

    useEffect(() => {
        if (!router?.events) return; // Safety untuk app router

        const handleComplete = () => {
            if (typeof onComplete === "function") onComplete();
        };

        router.events.on("routeChangeComplete", handleComplete);

        return () => {
            router.events.off("routeChangeComplete", handleComplete);
        };
    }, [router, onComplete]);
}
