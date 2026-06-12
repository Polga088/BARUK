import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const metadata: Metadata = {
  title: "BARUK — Restaurant & Expérience culinaire",
  description:
    "Découvrez BARUK : cuisine marocaine moderne, réservation en ligne et expérience immersive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${GeistSans.className} min-h-screen antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
