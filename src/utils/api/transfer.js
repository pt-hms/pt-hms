import axiosInstance from "../axios";

export async function uploadTF(bukti) {
    const res = await axiosInstance.post("/tf", bukti, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function getTF() {
    const res = await axiosInstance.get("/tf");
    return res.data;
}