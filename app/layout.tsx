import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-plex-thai",
});

export const metadata: Metadata = {
  title: "Smart POS - ระบบจัดการหน้าร้าน",
  description: "ระบบจัดการหน้าร้านออนไลน์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${plexThai.variable} font-sans antialiased bg-gray-50 text-slate-800`}
        suppressHydrationWarning
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
