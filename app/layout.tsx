// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Providers from "./providers";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import ClientTransition from "@/components/ClientTransition";
import RouteProgress from "@/components/RouteProgress";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Monasbaat | مناسبات",
  description: "منصة سعودية لاكتشاف وحجز قاعات وخدمات الأفراح.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body className="bg-white text-gray-900 antialiased">
        <Providers>
          <AuthProvider>
            <RouteProgress />
            <Header />
            <main className="pt-20">{/* offset for fixed header */}
              <ClientTransition>{children}</ClientTransition>
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
