"use client";

import { TextInput, Button, Paper, Container, Title, Text, Center, Group } from "@mantine/core";

export default function print() {
   const handleConnectAndPrint = () => {
      if (typeof PrintPlugin === "undefined") {
         console.error("PrintPlugin is not loaded yet.");
         document.getElementById("status").textContent = "Error: Printing library not loaded.";
         return;
      }

      let printer = new PrintPlugin("58mm");

      printer.connectToPrint({
         onReady: async (print) => {
            try {
               document.getElementById("status").textContent = "Printing...";

               await print.writeText("PT HMS", { align: "center", bold: true });
               await print.writeText("Bandara Soekarno-Hatta", { align: "center" });
               await print.writeDashLine();
               await print.writeText("Jumat 10/10/25 22:40:24", { align: "center" });
               await print.writeText("001", { align: "center", bold: true, size: "double" });
               await print.writeDashLine();
               await print.writeText("Berikut nomor antrean anda", { align: "center" });
               await print.writeLineBreak();
               await print.writeLineBreak();
               await print.writeLineBreak();

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
      <>
         {/* <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Bluetooth Print</h1>
            <button id="connect" onClick={handleConnectAndPrint}>
               Connect and Print
            </button>
            <p id="status"></p>
         </main> */}

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
                        001
                     </Text>
                  </Paper>
               </Center>

               <Button fullWidth color="#E9AC50" variant="filled" size="lg" radius="md" onClick={handleConnectAndPrint}>
                  Cetak
               </Button>
               {/* <p id="status"></p> */}
            </Paper>
         </Container>
      </>
   );
}
