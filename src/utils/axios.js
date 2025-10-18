import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: "https://api-pt-hms.vercel.app/api",
});

// Tambahkan token dari cookie secara otomatis
axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosInstance;
