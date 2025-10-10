"use client";

export default function HomePage() {
   // This function will be called when the button is clicked
   const handleConnectAndPrint = () => {
      // Check if the PrintPlugin is available on the window object
      if (typeof PrintPlugin === "undefined") {
         console.error("PrintPlugin is not loaded yet.");
         // You could update a state here to show an error message to the user
         document.getElementById("status").textContent = "Error: Printing library not loaded.";
         return;
      }

      let printer = new PrintPlugin("80mm");

      printer.connectToPrint({
         onReady: async (print) => {
            try {
               document.getElementById("status").textContent = "Printing...";

               // Print Header
               await print.writeText("SADIGIT", {
                  align: "center",
                  bold: true,
                  size: "double",
               });
               await print.writeText("Jl. Kutamaya No.Ruko A, Kotakulon, Kec. Sumedang Sel., Kabupaten Sumedang, Jawa Barat 45311", { align: "center" });
               await print.writeText("0852-2299-9699", { align: "center" });
               await print.writeLineBreak();
               await print.writeText("No.Transaksi: SDGT-ONL-0001", {
                  align: "center",
               });
               await print.writeText("Kasir: Otongsuke", { align: "center" });
               await print.writeText("2024-10-23 10:20:18", { align: "center" });

               // Print Items
               await print.writeDashLine();
               for (let i = 0; i < 5; i++) {
                  await print.writeText("Item Sample-" + i, { align: "left" });
                  await print.writeTextWith2Column("1 pcs x 10.000", "10.000");
               }
               await print.writeDashLine();

               // Print Total
               await print.writeTextWith2Column("Total :", "50.000");
               await print.writeTextWith2Column("Bayar :", "100.000");
               await print.writeTextWith2Column("Kembali :", "50.000");
               await print.writeTextWith2Column("Metode :", "Tunai");

               // Print Footer
               await print.writeLineBreak();
               await print.writeText("Terimakasih sudah mencoba Follow IG @sadigit.id", { align: "center" });
               await print.writeLineBreak(3);

               document.getElementById("status").textContent = "Print successful!";
            } catch (error) {
               console.error("Printing failed:", error);
               document.getElementById("status").textContent = `Printing failed: ${error.message}`;
            }
         },
         onFailed: (message) => {
            console.log(message);
            document.getElementById("status").textContent = `Failed: ${message}`;
         },
      });
   };

   return (
      <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
         <h1>Bluetooth Print</h1>
         <button id="connect" onClick={handleConnectAndPrint}>
            Connect and Print
         </button>
         <p id="status"></p>
      </main>
   );
}
