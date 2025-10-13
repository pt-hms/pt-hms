import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Script from "next/script";
import { ModalsProvider } from "@mantine/modals";
import GlobalLoader from "@/components/GlobalLoader";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata = {
   title: "PT HMS",
   description: "PT HMS App",
   manifest: "/manifest.json",
   icons: {
      icon: "/icons/icon-192x192.png",
      apple: "/icons/icon-512x512.png",
   },
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <MantineProvider
               defaultColorScheme="light"
               withGlobalStyles
               withNormalizeCSS
            >
               <Notifications />
               <ModalsProvider>
                  <GlobalLoader />
                  {children}
               </ModalsProvider>
            </MantineProvider>
            <Script src="https://cdn.jsdelivr.net/npm/bluetooth-print-js@1.0/index.min.js" strategy="beforeInteractive" />
         </body>
      </html>
   );
}
