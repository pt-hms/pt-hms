import "@mantine/core/styles.css";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata = {
   title: "KJMHS",
   description: "KJMHS Order App",
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
               {children}
            </MantineProvider>
         </body>
      </html>
   );
}
