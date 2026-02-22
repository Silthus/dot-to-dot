import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Punkt-zu-Punkt | Malen nach Zahlen für Kinder",
  description: "Generiere Punkt-zu-Punkt Bilder zum Ausdrucken. Verbinde die Zahlen und entdecke das Bild!",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
