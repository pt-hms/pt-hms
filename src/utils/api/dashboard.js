import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getDashboard(tanggal) {
    const res = await axiosInstance.get(`/dashboard?tanggal=${tanggal}`)
    return res.data;
}
