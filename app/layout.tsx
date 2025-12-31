import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Familiada - Teleturniej",
  description: "Graj w Familiadę! Klasyczny teleturniej rodzinny w wersji online.",
  keywords: ["familiada", "teleturniej", "gra", "quiz", "rodzina"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${bebasNeue.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
