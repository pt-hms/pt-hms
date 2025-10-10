"use client";

export default function PrintPage() {
   const handlePrint = async () => {
      try {
         // Minta user pilih printer yang sudah terhubung via Bluetooth (pair dulu dari OS)
         const port = await navigator.serial.requestPort();
         await port.open({ baudRate: 9600 });

         const writer = port.writable.getWriter();
         const encoder = new TextEncoder();

         // Isi tiket
         const text = `
KJHMS

15

JUTA



\n\n\n`; // newline ekstra biar panjang

         await writer.write(encoder.encode(text));

         writer.releaseLock();
         await port.close();

         alert("✅ Tiket berhasil dikirim ke printer!");
      } catch (err) {
         console.error("Print error:", err);
         alert("Gagal mencetak: " + err.message);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
         <h1 className="text-2xl font-bold mb-6">Cetak Tiket</h1>
         <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            🖨️ Print Tiket
         </button>
      </div>
   );
}
