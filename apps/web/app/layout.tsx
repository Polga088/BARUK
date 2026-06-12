import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Allura } from "next/font/google";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-family-sans",
});

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-family-display",
});

const brand = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-family-brand",
});

export const metadata: Metadata = {
  title: "BARUK — Fast Food du Cœur",
  description:
    "Baruk Casablanca : hummus, pita, pidde, bowls. Cuisine levantine premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${sans.className} ${display.variable} ${brand.variable} min-h-screen bg-white antialiased`}
      >
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
