import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

// favicon updated: 2026-03-19
export const metadata: Metadata = {
  title: "경성대 멋쟁이사자처럼",
  description: "상상을 실행으로, 결과로 증명하다",
  icons: {
    icon: "https://i.ibb.co/N6fYNjgK/634089595-17846193915688735-2807885536104229796-n-1.png?v=20260319",
    shortcut: "https://i.ibb.co/N6fYNjgK/634089595-17846193915688735-2807885536104229796-n-1.png?v=20260319",
    apple: "https://i.ibb.co/N6fYNjgK/634089595-17846193915688735-2807885536104229796-n-1.png?v=20260319",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
