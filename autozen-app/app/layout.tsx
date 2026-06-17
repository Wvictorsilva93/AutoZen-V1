import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { PWARegister } from "@/components/pwa-register";
import { SplashScreen } from "@/components/splash-screen";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "AutoZen - Gestão Automotiva",
  description: "Tranquilidade e eficiência na gestão do seu negócio. Controle clientes, veículos, serviços, estoque, financeiro e operação.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AutoZen",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0f1c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("dark h-full antialiased font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SplashScreen />
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
