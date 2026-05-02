import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AURANEWS | AI-Powered News Dashboard",
  description: "Información seleccionada en tiempo real impulsada por procesamiento de alta velocidad.",
};

import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}

