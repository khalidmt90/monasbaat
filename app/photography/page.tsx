import HeroBanner from "@/components/HeroBanner";
import Section from "@/components/Section";
import CardGrid, { CardItem } from "@/components/CardGrid";

export default function PhotographyPage() {
  const packages: CardItem[] = [
    {
      href: "#",
      title: "تصوير رجال — فوتو",
      subtitle: "مصور محترف، تسليم جميع الصور عالية الدقة.",
      icon: "fa-camera",
      meta: "ابتداءً من 1,500 ر.س",
    },
    {
      href: "#",
      title: "تصوير نساء — فوتو",
      subtitle: "فريق نسائي كامل، غرفة خاصة، تسليم سريع.",
      icon: "fa-camera-rotate",
      meta: "ابتداءً من 1,800 ر.س",
    },
    {
      href: "#",
      title: "فيديو — مونتاج احترافي",
      subtitle: "كاميرات 4K + مونتاج وتسليم ملف نهائي.",
      icon: "fa-video",
      meta: "ابتداءً من 2,500 ر.س",
    },
    {
      href: "#",
      title: "باقة شاملة (رجال/نساء)",
      subtitle: "فوتو + فيديو + ألبوم مطبوع.",
      icon: "fa-gem",
      meta: "ابتداءً من 4,900 ر.س",
    },
  ];

  const vendors: CardItem[] = [
    {
      href: "#",
      title: "استوديو لقطات",
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
      subtitle: "رجال/نساء — فوتو وفيديو",
      footer: "عرض الملف",
    },
    {
      href: "#",
      title: "عدسة نور",
      image: "https://images.unsplash.com/photo-1526178610571-3e4ce14f8468?q=80&w=1600&auto=format&fit=crop",
      subtitle: "تصوير نسائي فقط",
      footer: "عرض الملف",
    },
    {
      href: "#",
      title: "ستوديو فوكاس",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop",
      subtitle: "فيديو + مونتاج",
      footer: "عرض الملف",
    },
  ];

  return (
    <>
      <HeroBanner
        image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop"
        title="التصوير — رجال / نساء"
        subtitle="احفظ لحظاتك بأفضل جودة. اختر بين فوتو، فيديو، أو باقات شاملة."
        ctas={[
          { href: "/contact", label: "اطلب عرض سعر", icon: "fa-paper-plane" },
          { href: "/halls", label: "ابحث عن قاعة", icon: "fa-magnifying-glass", variant: "ghost" },
        ]}
      />

      <Section>
        <h2 className="font-bold text-lg mb-4">باقات شائعة</h2>
        <CardGrid items={packages} cols={4} />
      </Section>

      <Section muted>
        <h2 className="font-bold text-lg mb-4">شركات تصوير مميزة</h2>
        <CardGrid items={vendors} cols={3} />
      </Section>

      <Section>
        <div className="card p-6 md:p-8 bg-gradient-to-br from-ivory to-white">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-extrabold">هل أنت مصور/شركة تصوير؟</h3>
              <p className="text-gray-600 mt-1">انضم إلى منصة مناسبات وابدأ باستقبال الطلبات اليوم.</p>
            </div>
            <a href="/vendors" className="btn btn-primary">
              <i className="fa-solid fa-store" /> انضم كمزود
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
