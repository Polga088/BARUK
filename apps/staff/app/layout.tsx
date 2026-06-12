import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Cormorant_Garamond } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "BARUK Staff",
  description: "Interface serveurs — commandes et pointage",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#c4694a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${GeistSans.className} ${display.variable} min-h-screen bg-warm-900 text-cream-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
