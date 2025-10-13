import axios from "axios";

// Base URL backend kamu
const axiosInstance = axios.create({
    baseURL: "https://api-pt-hms.vercel.app/api",
});

// Tambahkan token otomatis jika ada
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosInstance;
