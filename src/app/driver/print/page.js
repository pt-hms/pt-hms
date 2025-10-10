"use client";

import { useState, useEffect } from "react";
import { Button, Paper, Container, Title, Text, Center } from "@mantine/core";

export default function SimpleQueuePage() {
   // State untuk data aplikasi
   const [queueNumber, setQueueNumber] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [status, setStatus] = useState("Siap untuk mencetak...");

   // Mengambil nomor terakhir dari localStorage saat halaman dimuat
   useEffect(() => {
      const savedQueueNumber = parseInt(localStorage.getItem("currentQueueNumber")) || 0;
      setQueueNumber(savedQueueNumber);
   }, []);

   const formatDateTime = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
   };

   // Fungsi utama untuk mencetak
   const handlePrint = () => {
      if (typeof PrintPlugin === "undefined") {
         setStatus("Error: Pustaka printer belum siap.");
         return;
      }

      setIsLoading(true);

      // Tetapkan nilai judul, subjudul, dan footer langsung di sini
      const title = "AYAM RADIT";
      const subtitle = "Depan Lippo";
      const footer = "Terima kasih sudah mengantri";

      // Logika nomor antrean tetap sama
      const newQueueNumber = queueNumber + 1;
      localStorage.setItem("currentQueueNumber", newQueueNumber);
      setQueueNumber(newQueueNumber);

      setStatus(`Mencetak nomor ${String(newQueueNumber).padStart(3, "0")}...`);

      const now = new Date();
      const formattedDateTime = formatDateTime(now);
      const formattedQueueNumber = String(newQueueNumber).padStart(3, "0");

      let printer = new PrintPlugin("58mm");
      printer.connectToPrint({
         onReady: async (print) => {
            try {
               await print.writeText(title.toUpperCase(), { align: "center", bold: true, size: "double" });
               await print.writeText(subtitle, { align: "center" });
               await print.writeDashLine();
               await print.writeText(formattedDateTime, { align: "center" });
               await print.writeText(formattedQueueNumber, { align: "center", bold: true, size: "4x" });
               await print.writeDashLine();
               await print.writeText(footer, { align: "center" });
               await print.writeLineBreak(3);

               setStatus(`Nomor ${formattedQueueNumber} berhasil dicetak.`);
            } catch (e) {
               console.error("Gagal saat mencetak:", e);
               setStatus(`Gagal saat proses cetak: ${e.message}`);
            } finally {
               setIsLoading(false);
            }
         },
         onFailed: (message) => {
            console.log(message);
            setStatus(`Gagal terhubung ke printer: ${message}`);
            setIsLoading(false);
         },
      });
   };

   const handleReset = () => {
      if (confirm("Yakin ingin mereset nomor antrean kembali ke 0?")) {
         localStorage.setItem("currentQueueNumber", "0");
         setQueueNumber(0);
         setStatus("Nomor antrean berhasil direset.");
      }
   };

   return (
      <Container size="xs" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
         <Paper withBorder shadow="md" p="xl" radius="md" style={{ width: "100%" }}>
            <Title order={2} ta="center" mb="lg" style={{ color: "#E9AC50" }}>
               Cetak Antrean
            </Title>

            <Center>
               <Paper withBorder p="xl" radius="md" ta="center" mb="xl" bg="gray.0">
                  <Text size="lg" c="dimmed">
                     Nomor Berikutnya
                  </Text>
                  <Text fz={60} fw={700} style={{ color: "#E9AC50" }}>
                     {String(queueNumber + 1).padStart(3, "0")}
                  </Text>
               </Paper>
            </Center>

            <Button fullWidth color="#E9AC50" variant="filled" size="lg" radius="md" loading={isLoading} onClick={handlePrint}>
               Cetak
            </Button>

            {/* <Button fullWidth variant="outline" color="gray" size="sm" radius="md" mt="lg" onClick={handleReset}>
               Reset Antrean
            </Button> */}

            <Text ta="center" c="dimmed" mt="md" size="sm">
               {status}
            </Text>
         </Paper>
      </Container>
   );
}
