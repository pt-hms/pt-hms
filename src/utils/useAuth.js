import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "./axios";

// --- AUTH UTILS ---

export async function loginUser(no_pol, password) {
    const res = await axiosInstance.post("/login", { no_pol, password }, {
        headers: {
            "Content-Type": "application/json",
        }
    },);
    const data = res.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.driver));
    return data;
}

export async function registerUser(formData) {
    const res = await axiosInstance.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}


// --- HOOK UNTUK PROTEKSI ROUTE ---

export function useAuth(role = null) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = getUser();

        if (!token || !userData) {
            router.replace("/");
            return;
        }

        // Set user dulu agar UI bisa render
        setUser(userData);
        setLoading(false);

        // cek buktiTF async, tapi tidak block UI
        if (userData.role === "driver") {
            axiosInstance.get("/tf")
                .then(res => {
                    const buktiTF = res.data.tf;
                    if (!buktiTF) {
                        router.replace("/sij"); // redirect jika belum ada
                    }
                })
                .catch(err => {
                    console.error("Failed to check bukti_tf:", err);
                    router.replace("/");
                });
        }

        // cek role spesifik
        if (role && userData.role !== role) {
            router.replace(userData.role === "admin" ? "/admin" : "/driver");
        }
    }, [router, role]);

    return { user, loading };
}


export function useGuest() {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();

        if (user) {
            // Kalau sudah login → arahkan ke dashboard sesuai role
            if (user.role === "driver") {
                router.replace("/driver");
            } else if (user.role === "admin") {
                router.replace("/admin");
            }
        }
    }, [router]);
}