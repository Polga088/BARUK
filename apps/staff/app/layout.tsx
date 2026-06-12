import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "BARUK Staff",
  description: "Interface serveurs BARUK",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BARUK Staff",
  },
};

export const viewport: Viewport = {
  themeColor: "#b86318",
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
      <body className={`${GeistSans.className} min-h-screen bg-surface-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
