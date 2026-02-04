import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/assets/styles/firework.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firework Display - Next.js",
  description: "Beautiful firework display built with Next.js and React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/fscreen%401.0.1.js"></script>
        <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/Stage%400.1.4.js"></script>
        <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/MyMath.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
