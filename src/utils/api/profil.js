import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getProfile() {
    const res = await axiosInstance.get("/profile");
    return res.data;
}
