import axiosInstance from "../axios";

export async function getDriver() {
    const res = await axiosInstance.get("/drivers");
    return res.data;
}

export async function createDriver(formData) {
    const res = await axiosInstance.post("/drivers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}