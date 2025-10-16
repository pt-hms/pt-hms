import axiosInstance from "../axios";

export async function uploadRitase(ss_order) {
    const res = await axiosInstance.post("/ritase-upload", ss_order, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function getMyRitase() {
    const res = await axiosInstance.get(`/ritase-saya`);
    return res.data;
}

