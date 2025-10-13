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

        // Jika tidak ada token → wajib login
        if (!token || !userData) {
            router.replace("/");
            return;
        }

        // Jika route punya role spesifik (misal admin)
        if (role && userData.role !== role) {
            router.replace(userData.role === "admin" ? "/admin" : "/driver");
            return;
        }

        setUser(userData);
        setLoading(false);
    }, [router, role]);

    return { user, loading };
}
