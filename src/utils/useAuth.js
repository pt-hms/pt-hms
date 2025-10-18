"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "./axios";

// ======================
// AUTH UTILS
// ======================

// Fungsi login user dan simpan token di cookie
export async function loginUser(no_pol, password) {
    const res = await axiosInstance.post(
        "/login",
        { no_pol, password },
        {
            headers: { "Content-Type": "application/json" },
        }
    );

    const data = res.data;
    const token = data.token;
    const user = data.driver;

    // Hitung waktu menuju tengah malam (jam 00:00)
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    // Simpan token ke cookie
    Cookies.set("token", token, {
        expires: new Date(midnight),
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // hanya aktif di HTTPS
        path: "/",
    });

    // Simpan user ke cookie
    Cookies.set("user", JSON.stringify(user), {
        expires: new Date(midnight),
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return data;
}

// Fungsi register user
export async function registerUser(formData) {
    const res = await axiosInstance.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

// Fungsi logout
export function logoutUser() {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });
}

// Ambil data user dari cookie
export function getUser() {
    if (typeof window === "undefined") return null;
    const userCookie = Cookies.get("user");
    return userCookie ? JSON.parse(userCookie) : null;
}

// ======================
// HOOK PROTEKSI ROUTE
// ======================

export function useAuth(role = null) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🧠 Cek login dan role
    useEffect(() => {
        const token = Cookies.get("token");
        const userData = getUser();

        if (!token || !userData) {
            router.replace("/");
            return;
        }

        const checkBuktiTF = async () => {
            try {
                const res = await axiosInstance.get(`/tf`);
                const buktiTF = res.data.tf;

                if (userData.role === "driver" && !buktiTF) {
                    router.replace("/sij");
                    return;
                }

                if (role && userData.role !== role) {
                    router.replace(userData.role === "admin" ? "/admin" : "/driver");
                    return;
                }

                setUser(userData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to check bukti_tf:", err);
                router.replace("/");
            }
        };

        checkBuktiTF();
    }, [router, role]);

    // 🕛 Auto logout jam 00:00
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                logoutUser();
                router.replace("/");
            }
        }, 60 * 1000); // cek setiap 1 menit

        return () => clearInterval(interval);
    }, [router]);

    // 💤 Auto logout setelah 30 menit tidak aktif
    useEffect(() => {
        let idleTimer;

        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                logoutUser();
                router.replace("/");
            }, 30 * 60 * 1000); // 30 menit idle → logout
        };

        const activityEvents = ["mousemove", "keydown", "scroll", "click"];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetIdleTimer);
        });

        resetIdleTimer(); // Jalankan saat pertama load

        return () => {
            clearTimeout(idleTimer);
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetIdleTimer);
            });
        };
    }, [router]);

    return { user, loading };
}

// ======================
// HOOK UNTUK GUEST
// ======================

export function useGuest() {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (user) {
            if (user.role === "driver") router.replace("/driver");
            else if (user.role === "admin") router.replace("/admin");
        }
    }, [router]);
}
