"use client";

import { getProfile } from "@/utils/api/profil";
import { getLastSIJ } from "@/utils/api/sij";
import { getTF } from "@/utils/api/transfer";
import axiosInstance from "@/utils/axios";
import { TextInput, Button, Paper, Container, Title, Text, Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { notifications } from "@mantine/notifications";

dayjs.locale("id"); // pakai bahasa Indonesia

export default function print() {
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState(null);
    const [buktiTF, setBuktiTF] = useState(null);
    const [loading, setLoading] = useState(false)

    const now = dayjs();
    const formatted = now.format("dddd DD/MM/YY HH:mm:ss");

    console.log(formatted);
    // Contoh output: "Jumat 10/10/25 22:40:24"

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Ambil nomor SIJ terakhir
                const sijData = await getLastSIJ();
                setData(sijData);

                // 2. Ambil profile driver
                const profileRes = await getProfile(); // endpoint profile sesuai backend
                setProfile(profileRes.driver);

                // 3. Ambil bukti_tf
                const tfRes = await getTF();
                setBuktiTF(tfRes.tf); // tf.id nanti ada di sini
            } catch (err) {
                console.error("Gagal ambil data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const lastSij = data?.no_sij || "000"; // fallback
    const nextNumber = Number(lastSij) + 1;
    const nextSij = String(nextNumber).padStart(3, "0");


    const handleConnectAndPrint = async () => {
        const statusElement = document.getElementById("status");

        if (!PrintPlugin) {
            statusElement.style.color = "#333";
            statusElement.textContent = "Error: Printing library not loaded.";
            return;
        }

        let printer = new PrintPlugin("58mm");

        printer.connectToPrint({
            onReady: async (print) => {
                try {
                    statusElement.style.color = "#e10b16";
                    statusElement.textContent = "Printing...";

                    // Cetak text
                    await print.writeText("Surat Ijin Jalan", { align: "center", bold: true });
                    await print.writeText("PT HMS (Helmi Mandiri Sukses)", { align: "center", bold: true });
                    await print.writeText("Grabcar Airport", { align: "center" });
                    await print.writeText("Bandara Soekarno - Hatta", { align: "center" });
                    await print.writeText(`Nama: ${profile?.nama}`, { align: "center" });
                    await print.writeText(`No Pol: ${profile?.no_pol}`, { align: "center" });
                    await print.writeText(`Kategori: ${profile?.kategori}`, { align: "center" });
                    await print.writeDashLine();
                    await print.writeText(`${formatted}`, { align: "center" });
                    await print.writeText(`${nextSij}`, { align: "center", bold: true, size: "double" });
                    await print.writeDashLine();
                    await print.writeText("DISIPLIN & PATUHI SOP", { align: "center" });
                    await print.writeLineBreak();
                    await print.writeText("Terima Kasih", { align: "center" });
                    await print.writeLineBreak();
                    await print.writeLineBreak();
                    await print.writeLineBreak();

                    // POST ke /sij-print dengan tf.id
                    await axiosInstance.post("/sij-print", {
                        tf_id: buktiTF?.id,
                        no_sij: nextSij,
                    }, {
                        headers: { "Content-Type": "application/json" }
                    });

                    statusElement.style.color = "#e10b16";
                    statusElement.textContent = "Print successful!";
                    const newSij = await getLastSIJ();
                    setData(newSij);

                    statusElement.style.color = "#e10b16";
                    statusElement.textContent = "Harap matikan bluetooth jika sudah selesai.";

                    notifications.show({
                        title: "Cetak selesai",
                        message: "Harap matikan bluetooth jika sudah selesai.",
                        color: "green",
                        autoClose: 3000,
                    });

                } catch (error) {
                    console.error("Printing failed:", error);
                    statusElement.style.color = "#333";
                    statusElement.textContent = `Printing failed: ${error.message}`;
                }
            },
            onFailed: (message) => {
                console.error("Printer connection failed:", message);
                statusElement.style.color = "#333";
                statusElement.textContent = `Failed: ${message}`;
            },
        });
    };


    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
                <Loader size="lg" color="red" />
            </div>
        );
    }

    console.log(data);

    return (
        <Container size="xs" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Paper withBorder shadow="md" p="xl" radius="md" style={{ width: "100%" }}>
                <Title
                    order={2}
                    ta="center"
                    mb="lg"
                    style={{ color: "#e10b16" }} // Diubah ke Merah
                >
                    Cetak Nomor SIJ
                </Title>

                <Center>
                    <Paper withBorder p="xl" radius="md" ta="center" mb="xl" bg="gray.0">
                        <Text size="lg" c="dimmed">
                            Nomor Berikutnya
                        </Text>
                        <Text
                            fz={60}
                            fw={700}
                            style={{ color: "#e10b16" }} // Diubah ke Merah
                        >
                            {nextSij}
                        </Text>
                    </Paper>
                </Center>

                <Button
                    fullWidth
                    color="#e10b16" // Diubah ke Merah
                    variant="filled"
                    size="lg"
                    radius="md"
                    onClick={handleConnectAndPrint}
                >
                    Cetak
                </Button>
                {/* ID 'status' akan diwarnai melalui JavaScript, jadi kita hapus class yang tidak berfungsi (color-[#E9AC50]) */}
                <Center mt="md">
                    <p id="status"></p>
                </Center>
            </Paper>
        </Container>
    );
}