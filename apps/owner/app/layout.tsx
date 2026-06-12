import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";

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

export const metadata: Metadata = {
  title: "BARUK Owner",
  description: "Espace propriétaire BARUK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${sans.className} ${display.variable} min-h-screen bg-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
