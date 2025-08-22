// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import { FadeIn, HoverLift, Stagger, Item, ParallaxBanner } from "@/components/Animated";

/* -------------------------
   Sticky hero (shrinks on scroll)
-------------------------- */
function StickyHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"], // when hero ends, animation done
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <section ref={ref} className="section pt-6">
      <div className="container">
        <motion.div style={{ scale, opacity, y }} className="rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.22)]">
          <div className="h-[68vh] md:h-[82vh] relative">
            <div className="absolute inset-0 -z-10">
              <Image
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
                alt="Hero background"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>
            <div className="relative h-full grid place-items-center text-center text-white px-6">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  منصة سعودية — حجوزات القاعات والخدمات
                </motion.div>

                <motion.h1
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="text-3xl md:text-5xl font-extrabold drop-shadow mt-4 leading-[1.15]"
                >
                  كل ما تحتاجه لحفلٍ مثالي — في منصة واحدة
                </motion.h1>

                <motion.p
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.16 }}
                  className="mt-3 text-white/90 text-lg"
                >
                  اكتشف القاعات، أضف الضيافة والديكور والتصوير والقهوة والشاي. تسعير واضح وتجربة سهلة.
                </motion.p>

                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.24 }}
                  className="mt-6 flex items-center justify-center gap-3"
                >
                  <Link className="btn btn-gold" href="/halls">
                    <i className="fa-solid fa-magnifying-glass" /> ابحث عن قاعة
                  </Link>
                  <Link className="btn btn-ghost" href="/corporate">
                    <i className="fa-solid fa-building" /> حلول الشركات
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* soft gradient to page */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------
   Animated counters (metrics)
-------------------------- */
function Metric({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controls = animate(0, value, {
      duration: 1.1,
      delay,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("ar-SA");
      },
    });
    return () => controls.stop();
  }, [value, delay]);
  return (
    <div className="card p-5 text-center">
      <div className="text-3xl font-extrabold text-ink">
        <span ref={ref} />+
      </div>
      <div className="text-gray-600 mt-1">{label}</div>
    </div>
  );
}

function MetricsStrip() {
  return (
    <section className="section section-muted">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric value={320} label="قاعات متاحة" />
          <Metric value={140} label="مزودو خدمات" delay={0.05} />
          <Metric value={5200} label="حجوزات ناجحة" delay={0.1} />
          <Metric value={47} label="متوسط تقييم ×10" delay={0.15} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Dual Parallax Banners
-------------------------- */
function ParallaxCards() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4">
          <ParallaxBanner
            image="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
            height="h-60 md:h-80"
          >
            <div className="p-5 md:p-6 text-white drop-shadow">
              <h3 className="font-bold text-xl">ابحث عن القاعة المثالية</h3>
              <p className="text-white/90 mt-1">فلترة بالمدينة، الفترة، السعة (رجال/نساء)، مع تسعير فوري وحاسبة تكاليف.</p>
              <Link href="/halls" className="btn btn-primary mt-3">تصفح القاعات</Link>
            </div>
          </ParallaxBanner>

          <ParallaxBanner
            image="https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=2000&auto=format&fit=crop"
            height="h-60 md:h-80"
          >
            <div className="p-5 md:p-6 text-white drop-shadow">
              <h3 className="font-bold text-xl">أكمل التفاصيل في سلة واحدة</h3>
              <p className="text-white/90 mt-1">أضف ديكور، تصوير (رجال/نساء)، ضيافة، قهوة — ثم أكّد الطلب دفعة واحدة.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Link href="/decor" className="btn btn-ghost">الديكور</Link>
                <Link href="/photography" className="btn btn-ghost">التصوير</Link>
                <Link href="/catering" className="btn btn-ghost">الضيافة</Link>
              </div>
            </div>
          </ParallaxBanner>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Vendor marquee (infinite)
-------------------------- */
function VendorMarquee() {
  const items = ["🎥 التصوير", "🎀 الديكور", "🍽️ الضيافة", "☕ القهوة", "🎤 الصوتيات", "🚗 الفاليه"];
  return (
    <section className="py-10 bg-[#0f1220] text-white overflow-hidden">
      <div className="container">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">شركاؤنا من مزودي الخدمات</h3>
          <p className="text-gray-300">أفضل مزودي التصوير، الضيافة، الديكور، القهوة…</p>
        </div>
        <div className="relative">
          <div className="marquee flex whitespace-nowrap gap-6 text-2xl opacity-90">
            {items.concat(items).map((l, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* === STICKY HERO (shrink on scroll) === */}
      <StickyHero />

      {/* === QUICK SEARCH (kept as is, wrapped with subtle fade) === */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <form action="/halls" className="card p-4 grid gap-3 md:grid-cols-2">
              <label className="field">
                <span className="label">المدينة</span>
                <select className="select" required>
                  <option>الرياض</option>
                  <option>جدة</option>
                  <option>الدمام</option>
                  <option>مكة</option>
                </select>
              </label>

              <label className="field">
                <span className="label">التاريخ</span>
                <input type="date" className="input" required />
              </label>

              <label className="field">
                <span className="label">الفترة</span>
                <select className="select" required>
                  <option>مسائية</option>
                  <option>صباحية</option>
                  <option>يوم كامل</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="field">
                  <span className="label">رجال</span>
                  <input type="number" className="input" min={0} placeholder="0" />
                </label>
                <label className="field">
                  <span className="label">نساء</span>
                  <input type="number" className="input" min={0} placeholder="0" />
                </label>
              </div>

              <button className="btn btn-primary md:col-span-2">
                <i className="fa-solid fa-magnifying-glass" /> بحث سريع
              </button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* === METRICS (animated counters) === */}
      <MetricsStrip />

      {/* === SERVICE STRIP (as you had, with subtle lift) === */}
      <section className="section section-muted">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">خدمات تكمل حفلِك</h2>
            <Link className="text-[#2563EB]" href="/catering">عرض جميع الخدمات</Link>
          </div>

          <Stagger>
            <div className="grid-4">
              {[
                { href: "/catering", icon: "fa-utensils", title: "الضيافة / الكيترنغ", desc: "قوائم لكل فرد (رجال/نساء)." },
                { href: "/decor", icon: "fa-wand-magic-sparkles", title: "الديكور", desc: "حزم المسرح والطاولات والزهور." },
                { href: "/photography", icon: "fa-camera", title: "التصوير", desc: "رجال / نساء — فوتو + فيديو." },
                { href: "/catering", icon: "fa-mug-hot", title: "قهوة وشاي", desc: "طاقم ضيافة محترف." },
              ].map((s, i) => (
                <Item key={i}>
                  <HoverLift>
                    <Link href={s.href} className="card p-5 block group">
                      <div className="text-2xl"><i className={`fa-solid ${s.icon}`} /></div>
                      <h3 className="font-bold mt-2">{s.title}</h3>
                      <p className="text-gray-600 mt-1">{s.desc}</p>
                      <div className="mt-3 text-sm text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                        استكشاف <i className="fa-solid fa-arrow-left-long" />
                      </div>
                    </Link>
                  </HoverLift>
                </Item>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* === PARALLAX BANNERS (2 cards) === */}
      <ParallaxCards />

      {/* === FEATURED HALLS (as you had) === */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">قاعات مميزة</h2>
            <Link className="text-[#2563EB]" href="/halls">عرض الكل</Link>
          </div>

          <Stagger>
            <div className="grid-3">
              {[
                {
                  slug: "al-yakout",
                  city: "الرياض",
                  name: "قاعة الياقوت",
                  price: 12000,
                  img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
                },
                {
                  slug: "al-fayrouz",
                  city: "جدة",
                  name: "قاعة الفيروز",
                  price: 9500,
                  img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
                },
                {
                  slug: "al-massa",
                  city: "مكة",
                  name: "قاعة الماسة",
                  price: 14000,
                  img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
                },
              ].map((h, i) => (
                <Item key={i}>
                  <HoverLift>
                    <Link href={`/halls/${h.slug}`} className="card block">
                      <div className="relative h-44">
                        <Image
                          src={h.img}
                          alt={h.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{h.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{h.city} • سعة 500+</p>
                        <div className="mt-2">
                          ابتداءً من <b>{h.price.toLocaleString("ar-SA")}</b> ر.س
                        </div>
                        <div className="mt-3 btn btn-ghost w-max">
                          <i className="fa-regular fa-eye" /> عرض التفاصيل
                        </div>
                      </div>
                    </Link>
                  </HoverLift>
                </Item>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* === VENDOR MARQUEE (infinite loop) === */}
      <VendorMarquee />

      {/* === TRUST STRIP (as you had) === */}
      <section className="section section-muted">
        <div className="container">
          <Stagger>
            <div className="grid-4">
              {[
                { icon: "fa-shield-halved", title: "موثوقة", text: "تحقق إداري + مراجعات بعد المناسبة." },
                { icon: "fa-receipt", title: "تسعير واضح", text: "تفصيل القاعة + الضيافة + الإضافات." },
                { icon: "fa-bolt", title: "سريعة", text: "بحث، تصفية، وحجز بخطوات قليلة." },
                { icon: "fa-mobile-screen", title: "متوافقة مع الجوال", text: "تجربة ممتازة على الشاشات الصغيرة." },
              ].map((b, i) => (
                <Item key={i}>
                  <div className="card p-5">
                    <div className="text-2xl"><i className={`fa-solid ${b.icon}`} /></div>
                    <h3 className="font-bold mt-2">{b.title}</h3>
                    <p className="text-gray-600 mt-1">{b.text}</p>
                  </div>
                </Item>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* === CTA BANNER (as you had) === */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="card p-6 md:p-8 bg-gradient-to-br from-ivory to-white">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-extrabold">لديك قاعة أو خدمة وتريد عملاء أكثر؟</h3>
                  <p className="text-gray-600 mt-1">انضم إلى منصة مناسبات وابدأ باستقبال الطلبات اليوم.</p>
                </div>
                <Link href="/vendors" className="btn btn-primary">
                  <i className="fa-solid fa-store" /> انضم كمزود
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
