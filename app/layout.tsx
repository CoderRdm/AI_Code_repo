import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YourProduct: practice AI-assisted debugging rounds",
  description:
    "Fix real bugs in a real repo with an AI helper, then get a report on how you worked. Join the early-access list.",
  openGraph: {
    title: "YourProduct: practice AI-assisted debugging rounds",
    description: "Fix real bugs in a real repo with an AI helper. Join the early-access list.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
