import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETG — Gestion des Membres",
  description: "Application de gestion des membres de l'Église Terre de Grâce",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "10px", fontSize: "14px" },
            success: { iconTheme: { primary: "#1a3a8f", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
