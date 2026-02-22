import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Punkt-zu-Punkt Generator",
  description:
    "Erstelle Punkt-zu-Punkt Raetsel fuer Kinder zum Ausdrucken als PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${fredoka.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
