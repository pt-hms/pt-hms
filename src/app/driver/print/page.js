"use client";
import { useState } from "react";

export default function PrintPage() {
   const [status, setStatus] = useState("Belum terhubung");

   const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      if (/android/i.test(ua)) return "android";
      if (/iphone|ipad|ipod/i.test(ua)) return "ios";
      return "desktop";
   };

   const connectPrinter = async () => {
      const deviceType = detectDevice();
      setStatus(`Mendeteksi perangkat: ${deviceType}`);

      try {
         if (deviceType === "desktop") {
            // === Web Serial API === (untuk Laptop / PC)
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            const writer = port.writable.getWriter();

            const text = "KJHMS\n15\nJUTA\n";
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(text + "\n\n\n"));

            writer.releaseLock();
            await port.close();
            setStatus("✅ Berhasil mencetak di desktop!");
         } else {
            // === Web Bluetooth === (untuk Android/iOS)
            const device = await navigator.bluetooth.requestDevice({
               acceptAllDevices: true,
               optionalServices: [0xffe0], // Service umum untuk printer bluetooth
            });

            setStatus(`🔗 Terhubung ke ${device.name || "Printer"}`);

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(0xffe0);
            const characteristic = await service.getCharacteristic(0xffe1);

            const text = "KJHMS\n15\nJUTA\n";
            const encoder = new TextEncoder();
            await characteristic.writeValue(encoder.encode(text + "\n\n\n"));

            setStatus("✅ Berhasil mencetak via Bluetooth!");
         }
      } catch (err) {
         console.error(err);
         setStatus("❌ Gagal mencetak: " + err.message);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
         <h1 className="text-2xl font-bold mb-4">🖨️ Tes Print Universal</h1>
         <button onClick={connectPrinter} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Hubungkan & Cetak
         </button>
         <p className="mt-4">{status}</p>
      </div>
   );
}
