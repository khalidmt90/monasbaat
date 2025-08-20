import Link from "next/link";
import Image from "next/image";
import { FadeIn, HoverLift, Stagger, Item, ParallaxBanner } from "@/components/Animated";

export default function Home() {
  return (
    <>
      {/* === HERO (Parallax) === */}
      <section className="section pt-6">
        <div className="container">
          <ParallaxBanner
            image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
            height="min-h-[65vh]"
          >
            <div className="flex items-center justify-center h-full text-center">
              <div className="max-w-2xl px-6">
                <FadeIn>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow">
                    كل ما تحتاجه لحفلٍ مثالي — في منصة واحدة
                  </h1>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <p className="mt-3 text-white/90 text-lg">
                    اكتشف القاعات، أضف الضيافة والديكور والتصوير والقهوة والشاي. تسعير واضح وتجربة سهلة.
                  </p>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Link className="btn btn-gold" href="/halls">
                      <i className="fa-solid fa-magnifying-glass" /> ابحث عن قاعة
                    </Link>
                    <Link className="btn btn-ghost" href="/corporate">
                      <i className="fa-solid fa-building" /> حلول الشركات
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </ParallaxBanner>
        </div>
      </section>

      {/* === QUICK SEARCH === */}
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

      {/* === SERVICE STRIP (icons + hover) === */}
      <section className="section section-muted">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">خدمات تكمل حفلِك</h2>
            <Link className="text-[#2563EB]" href="/catering">
              عرض جميع الخدمات
            </Link>
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
                      <div className="text-2xl">
                        <i className={`fa-solid ${s.icon}`} />
                      </div>
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

      {/* === FEATURED HALLS (cards with hover + lazy images) === */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">قاعات مميزة</h2>
            <Link className="text-[#2563EB]" href="/halls">
              عرض الكل
            </Link>
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

      {/* === TRUST / BADGES STRIP === */}
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
                    <div className="text-2xl">
                      <i className={`fa-solid ${b.icon}`} />
                    </div>
                    <h3 className="font-bold mt-2">{b.title}</h3>
                    <p className="text-gray-600 mt-1">{b.text}</p>
                  </div>
                </Item>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* === CTA BANNER === */}
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
