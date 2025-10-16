import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getDashboard(tanggal) {
    const res = await axiosInstance.get("/dashboard", tanggal, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return res.data;
}
