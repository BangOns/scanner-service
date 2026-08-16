import type { Metadata } from "next";
import { Providers } from "@/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scanner Platform — Hardware Bridge & Product Hub",
  description: "Next.js Monolith for managing Windows TWAIN/WIA Scanner Agent distribution and configuration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
