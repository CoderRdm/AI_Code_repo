import type { Metadata, Viewport } from "next";
import { Archivo, Jersey_10, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const pixel = Jersey_10({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const terminal = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

const print = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-print",
  display: "swap",
});

export const metadata: Metadata = {
  title: "cuckyouleet: practice the debugging round",
  description:
    "Practice the coding rounds LeetCode doesn't cover. Fix real bugs in a real repo with an AI helper, then get a report on how you worked. Join the early-access list.",
};

export const viewport: Viewport = {
  themeColor: "#eef3e2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${terminal.variable} ${print.variable}`}>
      <body>{children}</body>
    </html>
  );
}
