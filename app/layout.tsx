// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Link from "next/link";
import ClientTransition from "@/components/ClientTransition";
import { CartProvider } from "@/components/CartProvider";
import MiniCartButton from "@/components/CartDrawer";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Monasbaat | مناسبات — منصة القاعات والخدمات",
  description:
    "منصة سعودية لاكتشاف وحجز قاعات الأفراح وربط العملاء بمزودي الخدمات (الضيافة، الديكور، التصوير، القهوة والشاي).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body className="text-ink bg-white antialiased">
        <CartProvider>
          {/* NAVBAR */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="container">
              <div className="flex items-center justify-between min-h-[68px]">
                <Link href="/" className="flex items-center gap-2 font-bold text-ink">
                  <span className="text-gold">✦</span>
                  <span className="text-lg">مناسبات</span>
                  <span className="text-sm text-gray-500">Monasbaat</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-2">
                  <Link className="nav-link" href="/halls">القاعات</Link>
                  <Link className="nav-link" href="/catering">الضيافة</Link>
                  <Link className="nav-link" href="/decor">الديكور</Link>
                  <Link className="nav-link" href="/photography">التصوير</Link>
                  <Link className="nav-link" href="/corporate">الشركات</Link>
                  <Link className="nav-link" href="/vendors">لأصحاب القاعات والخدمات</Link>
                  <Link className="btn-gold" href="/halls">احجز الآن</Link>
                  {/* Cart */}
                  <MiniCartButton />
                </nav>

                {/* Mobile */}
                <div className="md:hidden flex items-center gap-2">
                  <MiniCartButton />
                  <details>
                    <summary className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <i className="fa-solid fa-bars" />
                    </summary>
                    <div className="absolute right-4 mt-2 w-[260px] rounded-xl shadow-xl border bg-white p-2 flex flex-col">
                      <Link className="mob-link" href="/halls">القاعات</Link>
                      <Link className="mob-link" href="/catering">الضيافة</Link>
                      <Link className="mob-link" href="/decor">الديكور</Link>
                      <Link className="mob-link" href="/photography">التصوير</Link>
                      <Link className="mob-link" href="/corporate">الشركات</Link>
                      <Link className="mob-link" href="/vendors">انضم كمزود</Link>
                      <Link className="btn-gold mt-2 text-center" href="/halls">احجز الآن</Link>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </header>

          {/* Page transitions */}
          <ClientTransition>
            <main>{children}</main>
          </ClientTransition>

          {/* FOOTER */}
          <footer className="bg-[#0f1220] text-[#eaeaea] mt-8">
            <div className="container">
              <div className="grid gap-6 md:grid-cols-4 py-9">
                <div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-gold">✦</span>
                    <span className="text-white">مناسبات</span>
                    <span className="text-sm text-gray-300">Monasbaat</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    منصتك لاكتشاف وحجز القاعات والخدمات المكملة للفعاليات في السعودية.
                  </p>
                </div>
                <div>
                  <h4 className="foot-title">روابط</h4>
                  <ul className="space-y-1">
                    <li><Link href="/" className="foot-link">الرئيسية</Link></li>
                    <li><Link href="/halls" className="foot-link">القاعات</Link></li>
                    <li><Link href="/catering" className="foot-link">الضيافة</Link></li>
                    <li><Link href="/decor" className="foot-link">الديكور</Link></li>
                    <li><Link href="/photography" className="foot-link">التصوير</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="foot-title">الشركة</h4>
                  <ul className="space-y-1">
                    <li><Link href="/about" className="foot-link">من نحن</Link></li>
                    <li><Link href="/corporate" className="foot-link">حلول الشركات</Link></li>
                    <li><Link href="/vendors" className="foot-link">انضم كمزود</Link></li>
                    <li><Link href="/faq" className="foot-link">الأسئلة الشائعة</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="foot-title">قانوني</h4>
                  <ul className="space-y-1">
                    <li><Link href="/terms" className="foot-link">الشروط والأحكام</Link></li>
                    <li><Link href="/privacy" className="foot-link">سياسة الخصوصية</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/10 py-3 text-gray-400 text-sm">
                © {new Date().getFullYear()} Monasbaat — جميع الحقوق محفوظة
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
