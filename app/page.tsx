// app/page.tsx (converted to server component for feature flag SSR)
import Link from "next/link";
import Image from "next/image";
import { loadFeatureFlags } from "@/lib/featureFlags";
import { loadHomeContent, t, HomeContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import FallbackImage from "@/components/FallbackImage";
import Section from "@/components/Section";
import { AutoStagger } from "@/components/AutoStagger";
import { HoverLift, Item } from "@/components/Animated";
import { ScrollReveal } from "@/components/ScrollReveal";
// (No client-only animation on this simplified hero)

// (Removed heavy dynamic components for lean Phase 0 landing)

// (Hero simplified; TypeReveal not used to reduce bundle size)

// (Metrics removed for Phase 0 focus)

/* -------------------------
   Dual Parallax Banners
-------------------------- */

export default async function Home() {
  const prismaAny = prisma as any;
  const [flags, content, cities, featuredHalls] = await Promise.all([
    loadFeatureFlags(),
    loadHomeContent(),
    prismaAny.city.findMany({ where:{ active:true }, select:{ id:true, code:true, nameAr:true, nameEn:true } }),
    prismaAny.hall.findMany({ where:{ isActive:true, isVerified:true }, orderBy:{ createdAt:'desc' }, take:6, select:{ slug:true, name:true, nameAr:true, city:true, basePrice:true, images:true } })
  ]);
  const hallsEnabled = flags.services.halls.enabled;
  const dhabaehEnabled = flags.services.dhabaeh.enabled;
  const hero = content.hero || {};
  const lang:'ar'|'en' = 'ar';

  return (
    <>
      {/* Hero replaced with simpler static hero if dynamic component not loaded */}
      <section className="section pt-8">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
              {hallsEnabled && ( 
              <Link href="/halls" className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] md:aspect-[5/4] flex">
                <Image fill priority src={hero.halls?.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop'} alt={t(hero.halls?.headline,lang)} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end text-white">
                  <h2 className="text-xl md:text-2xl font-bold leading-snug">{t(hero.halls?.headline,lang)}</h2>
                  <div className="mt-3 inline-flex items-center gap-2 btn btn-gold !px-4 w-max"><i className="fa-solid fa-magnifying-glass" /> {t(hero.halls?.cta,lang)}</div>
                </div>
              </Link>
            )}
            {dhabaehEnabled && (
              <Link href="/dhabaeh" className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] md:aspect-[5/4] flex">
                <Image fill src={hero.dhabaeh?.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop'} alt={t(hero.dhabaeh?.headline,lang)} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end text-white">
                  <h2 className="text-xl md:text-2xl font-bold leading-snug">{t(hero.dhabaeh?.headline,lang)}</h2>
                  <div className="mt-3 inline-flex items-center gap-2 btn btn-primary !px-4 w-max"><i className="fa-solid fa-drumstick-bite" /> {t(hero.dhabaeh?.cta,lang)}</div>
                </div>
              </Link>
            )}
            </div>
          </div>
        </section>

        <Section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-6">What we offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/95 rounded-xl p-6 shadow-card-md"> 
                  <h3 className="font-semibold text-lg">Event Catering</h3>
                  <p className="mt-2 text-sm text-gray-700">Custom menus, full setup and on-site service for weddings, corporate, and private events.</p>
                </div>
                <div className="bg-white/95 rounded-xl p-6 shadow-card-md translate-y-6"> 
                  <h3 className="font-semibold text-lg">Dhabaeh Collections</h3>
                  <p className="mt-2 text-sm text-gray-700">Curated regional flavors, available for pickup or delivery.</p>
                </div>
              </div>

              <div className="bg-brand-berkeley-500 text-white rounded-xl p-8 shadow-card-lg">
                <h3 className="font-bold text-xl">Book a Hall</h3>
                <p className="mt-3 text-sm">Spacious halls with modern AV, flexible layouts and dedicated staff.</p>
                <div className="mt-6">
                  <Link href="/reserve" className="btn btn-primary">Reserve Now</Link>
                </div>
              </div>
            </div>
          </div>
  </Section>

      {/* === QUICK SEARCH (kept as is, wrapped with subtle fade) === */}
    <section className="section">
        <div className="container">
      <ScrollReveal>
            <form action="/halls" className="card p-4 grid gap-3 md:grid-cols-2">
              <label className="field">
                <span className="label">المدينة</span>
                <select className="select" required defaultValue="">
                  <option value="" disabled>اختر المدينة</option>
                  {cities.map((c:any)=> <option key={c.id} value={c.code}>{c.nameAr}</option>)}
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
          </ScrollReveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2 className="font-bold text-lg mb-6">{lang==='ar'? 'كيف تعمل المنصة':'How it Works'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-bold mb-3">{lang==='ar'? 'حجز القاعات':'Halls'}</h3>
              <ol className="space-y-2 text-sm counter-decimal list-inside">
                {(content.how?.halls?.steps||[]).map((s: any, i: number)=>(<li key={i}>{t(s.text,lang)}</li>))}
              </ol>
            </div>
            <div className="card p-5">
              <h3 className="font-bold mb-3">{lang==='ar'? 'الذبايح':'Dhabaeh'}</h3>
              <ol className="space-y-2 text-sm list-inside">
                {(content.how?.dhabaeh?.steps||[]).map((s: any,i: number)=>(<li key={i}>{t(s.text,lang)}</li>))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICEABLE CITIES */}
      <section className="section">
        <div className="container">
          <h2 className="font-bold text-lg mb-4">{t(content.cities?.tagline,lang) || (lang==='ar'? 'المدن':'Cities')}</h2>
          <div className="flex flex-wrap gap-3">
            {cities.map((c: any)=> <div key={c.id} className="px-4 py-2 rounded-full bg-gray-100 text-sm">{lang==='ar'? c.nameAr : (c.nameEn||c.nameAr)}</div>)}
            {cities.length===0 && <div className="text-xs text-gray-500">—</div>}
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="section">
        <div className="container">
          <h2 className="font-bold text-lg mb-6">{lang==='ar'? 'لماذا نحن':'Why Us'}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(content.trust?.signals||[]).map((s: any,i: number)=>(
              <div key={i} className="card p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 font-semibold"><span className="text-primary">{s.icon? <i className={`fa-solid fa-${s.icon}`} />: '★'}</span>{t(s.title,lang)}</div>
                {s.desc && <p className="text-gray-600 leading-relaxed text-xs">{t(s.desc,lang)}</p>}
              </div>
            ))}
            {(content.trust?.signals||[]).length===0 && <div className="text-xs text-gray-500">—</div>}
          </div>
        </div>
      </section>

      {/* === FEATURED HALLS (as you had) === */}
  <section className="section">
        <div className="container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">قاعات مميزة</h2>
            <Link className="text-[#2563EB]" href="/halls">عرض الكل</Link>
          </div>

          <AutoStagger className="grid-3">
                  {featuredHalls.map((h:any, i:number) => (
                <Item key={i}>
                  <HoverLift>
                    <Link href={`/halls/${h.slug}`} className="card block">
                      <div className="relative h-44">
                        <div className="absolute inset-0">
                          {/* use fallback image to avoid dead-looking cards if remote images fail */}
                          <FallbackImage
                            src={(Array.isArray(h.images)&&h.images[0]) || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop'}
                            alt={h.nameAr || h.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            priority={i === 0}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{h.nameAr || h.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{h.city}</p>
                        <div className="mt-2">
                          ابتداءً من <b>{(h.basePrice||0).toLocaleString('ar-SA')}</b> ر.س
                        </div>
                        <div className="mt-3 btn btn-ghost w-max">
                          <i className="fa-regular fa-eye" /> عرض التفاصيل
                        </div>
                      </div>
                    </Link>
                  </HoverLift>
                </Item>
        ))}
      </AutoStagger>
        </div>
      </section>



  {/* CTA replaced with focused dual action already in hero (Phase 0) */}
    </>
  );
}
