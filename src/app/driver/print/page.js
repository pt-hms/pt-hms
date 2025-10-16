"use client";

import { getLastSIJ } from "@/utils/api/sij";
import { TextInput, Button, Paper, Container, Title, Text, Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

export default function print() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getLastSIJ();
                setData(data);
            } catch (err) {
                console.error("Gagal ambil data driver:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
                <Loader size="lg" color="red" />
            </div>
        );
    }

    console.log(data);

    const handleConnectAndPrint = () => {
        // --- Perubahan Warna Status ---
        // Mendapatkan elemen status
        const statusElement = document.getElementById("status");

        if (typeof PrintPlugin === "undefined") {
            console.error("PrintPlugin is not loaded yet.");
            // Teks status diubah menjadi abu-abu
            statusElement.style.color = "#333333";
            statusElement.textContent = "Error: Printing library not loaded.";
            return;
        }

        let printer = new PrintPlugin("58mm");

        printer.connectToPrint({
            onReady: async (print) => {
                try {
                    // Teks status diubah menjadi merah saat memproses
                    statusElement.style.color = "#e10b16";
                    statusElement.textContent = "Printing...";

                    await print.writeText("Surat Ijin Jalan", { align: "center", bold: true });
                    await print.writeText("PT HMS (Helmi Mandiri Sukses)", { align: "center", bold: true });
                    await print.writeText("Grabcar Airport", { align: "center" });
                    await print.writeText("Bandara Soekarno - Hatta", { align: "center" });
                    await print.writeText("Nama: Aldop", { align: "center" }); // nama diambil dari data driver
                    await print.writeText("No Pol: B 1720 EDT", { align: "center" }); // no_pol diambil dari data driver
                    await print.writeDashLine();
                    await print.writeText("Jumat 10/10/25 22:40:24", { align: "center" }); // tanggal diambil dari tanggal hari ini
                    await print.writeText(`${data.no_sij}`, { align: "center", bold: true, size: "double" });
                    await print.writeDashLine();
                    await print.writeText("DISIPLIN & PATUHI SOP", { align: "center" });
                    await print.writeText("Terima Kasih", { align: "center" });
                    await print.writeLineBreak();
                    await print.writeLineBreak();
                    await print.writeLineBreak();

                    // Teks status diubah menjadi merah saat sukses
                    statusElement.style.color = "#e10b16";
                    statusElement.textContent = "Print successful!";
                } catch (error) {
                    console.error("Printing failed:", error);
                    // Teks status diubah menjadi abu-abu/hitam saat gagal
                    statusElement.style.color = "#333333";
                    statusElement.textContent = `Printing failed: ${error.message}`;
                }
            },
            onFailed: (message) => {
                console.log(message);
                // Teks status diubah menjadi abu-abu/hitam saat gagal
                statusElement.style.color = "#333333";
                statusElement.textContent = `Failed: ${message}`;
            },
        });
    };

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
                            {data.no_sij}
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