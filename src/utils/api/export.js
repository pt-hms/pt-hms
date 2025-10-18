import axiosInstance from "../axios";
import dayjs from "dayjs";

export async function downloadRitaseExcel(exportDate) {
    try {
        let url = "/export-ritase";
        let fileName = "laporan_ritase_pt_hms";

        // Jika rentang tanggal (2 tanggal)
        if (Array.isArray(exportDate) && exportDate[0] && exportDate[1]) {
            const start = dayjs(exportDate[0]).format("YYYY-MM-DD");
            const end = dayjs(exportDate[1]).format("YYYY-MM-DD");
            url += `?start=${start}&end=${end}`;
            fileName += `_${start}_${end}`;
        }
        // Jika hanya satu tanggal
        else if (exportDate[1] == null) {
            const date = dayjs(exportDate).format("YYYY-MM-DD");
            url += `?date=${date}`;
            fileName += `_${date}`;
        }
        else {
            throw new Error("Tanggal tidak valid");
        }

        // Ambil file Excel dari backend
        const res = await axiosInstance.get(url, {
            responseType: "blob",
        });

        // Unduh otomatis di browser
        const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.xlsx`;
        link.click();
        link.remove();

        return { success: true };
    } catch (err) {
        console.error("Gagal export Excel:", err);
        throw err;
    }
}
export async function downloadDriverExcel(exportDate) {
    try {
        let url = "/export-driver";
        let fileName = "data_driver_pt_hms";

        // Jika rentang tanggal (2 tanggal)
        if (Array.isArray(exportDate) && exportDate[0] && exportDate[1]) {
            const start = dayjs(exportDate[0]).format("YYYY-MM-DD");
            const end = dayjs(exportDate[1]).format("YYYY-MM-DD");
            url += `?start=${start}&end=${end}`;
            fileName += `_${start}_${end}`;
        }
        // Jika hanya satu tanggal
        else if (exportDate[1] == null) {
            const date = dayjs(exportDate).format("YYYY-MM-DD");
            url += `?date=${date}`;
            fileName += `_${date}`;
        }
        else {
            throw new Error("Tanggal tidak valid");
        }

        // Ambil file Excel dari backend
        const res = await axiosInstance.get(url, {
            responseType: "blob",
        });

        // Unduh otomatis di browser
        const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.xlsx`;
        link.click();
        link.remove();

        return { success: true };
    } catch (err) {
        console.error("Gagal export Excel:", err);
        throw err;
    }
}
