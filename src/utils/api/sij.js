import axiosInstance from "../axios";

// Ambil semua SIJ
export async function getSIJ() {
    const res = await axiosInstance.get("/sij");
    return res.data;
}

export async function getLastSIJ() {
    const res = await axiosInstance.get("/sij-last");
    return res.data;
}

// Ambil SIJ berdasarkan ID
export async function getSIJById(id) {
    const res = await axiosInstance.get(`/sij/${id}`);
    return res.data;
}

// Buat SIJ baru
export async function createSIJ(formData) {
    const res = await axiosInstance.post("/sij", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

// Update SIJ
export async function updateSIJ(id, formData) {
    const res = await axiosInstance.put(`/sij/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

// Hapus SIJ
export async function deleteSIJ(id) {
    const res = await axiosInstance.delete(`/sij/${id}`);
    return res.data;
}

