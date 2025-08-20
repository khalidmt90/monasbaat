import Link from "next/link";
import { FadeIn } from "@/components/Animated";

export default function VendorsPage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <h1 className="text-2xl font-bold mb-2">انضم كمزود</h1>
          <p className="text-gray-600 mb-6">سواءً كنت صاحب قاعة، مطبخ ضيافة، شركة ديكور، تصوير، أو ضيافة قهوة وشاي — سجّل وابدأ باستقبال الطلبات.</p>
        </FadeIn>

        <div className="grid-4">
          {[
            {icon:"fa-hotel", title:"قاعات", desc:"أضف الطاقة الاستيعابية، الأسعار، والمعرض."},
            {icon:"fa-utensils", title:"الضيافة", desc:"قوائم لكل فرد، صور الأطباق، طاقم الخدمة."},
            {icon:"fa-wand-magic-sparkles", title:"الديكور", desc:"حزم المسرح، الطاولات، الزهور."},
            {icon:"fa-camera", title:"التصوير", desc:"رجال/نساء، فوتو+فيديو، أجهزة."},
          ].map((b,i)=>(
            <div key={i} className="card p-5">
              <div className="text-2xl"><i className={`fa-solid ${b.icon}`} /></div>
              <h3 className="font-bold mt-2">{b.title}</h3>
              <p className="text-gray-600 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/contact" className="btn btn-primary"><i className="fa-regular fa-paper-plane" /> سجّل اهتمامك</Link>
        </div>
      </div>
    </section>
  );
}
