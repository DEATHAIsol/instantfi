import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from './components/Header'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstantFi",
  description: "DeFi lending and borrowing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js" />
      </head>
      <body className={`${inter.className} bg-[#1B1E27] text-white min-h-screen`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
