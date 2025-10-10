"use client";

import { useState, useEffect } from "react";

export default function SimpleQueuePage() {
   // State untuk data aplikasi (tidak ada perubahan di sini)
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

   // Fungsi utama untuk mencetak (tidak ada perubahan logika)
   const handlePrint = () => {
      if (typeof PrintPlugin === "undefined") {
         setStatus("Error: Pustaka printer belum siap.");
         return;
      }

      setIsLoading(true);

      const title = "PT HMS";
      const subtitle = "Bandara Soekarno-Hatta";
      const footer = "Berikut kode antrean anda";

      const newQueueNumber = queueNumber + 1;
      localStorage.setItem("currentQueueNumber", newQueueNumber);
      setQueueNumber(newQueueNumber);

      setStatus(`Mencetak nomor ${String(newQueueNumber).padStart(3, "0")}...`);

      const now = new Date();
      const formattedDateTime = formatDateTime(now);
      const formattedQueueNumber = String(newQueueNumber).padStart(3, "0");

      let printer = new PrintPlugin("80mm");
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
      <div className="card">
         <h1>Cetak Antrean</h1>

         <div className="queue-display">
            <h2>Nomor Berikutnya</h2>
            <p className="queue-number">{String(queueNumber + 1).padStart(3, "0")}</p>
         </div>

         <button className="print-button" onClick={handlePrint} disabled={isLoading}>
            {isLoading ? "Mencetak..." : "Cetak"}
         </button>

         <button className="reset-button" onClick={handleReset}>
            Reset Antrean
         </button>

         <p className="status">{status}</p>
      </div>
   );
}
