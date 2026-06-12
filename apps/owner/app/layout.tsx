import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

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
      <body className={`${GeistSans.className} min-h-screen bg-surface-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
