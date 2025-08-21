// app/catering/page.tsx
import Link from "next/link";
import { Stagger, Item, HoverLift } from "@/components/Animated";

export default function CateringPage() {
  const items = [
    { id: "cat-gold", title: "باقة ذهبية", price: 95, desc: "قائمة رجال/نساء — 95 ر.س/فرد" },
    { id: "cat-silver", title: "باقة فضية", price: 75, desc: "قائمة رجال/نساء — 75 ر.س/فرد" },
    { id: "cat-premium", title: "باقة مميزة", price: 130, desc: "أطباق مميزة وخدمة كاملة" },
  ];
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-3">الضيافة / الكيترنغ</h1>
        <Stagger>
          <div className="grid-3">
            {items.map((x) => (
              <Item key={x.id}>
                <HoverLift>
                  <div className="card p-5">
                    <h3 className="font-bold">{x.title}</h3>
                    <div className="text-gray-600 text-sm mt-1">{x.desc}</div>
                    <div className="mt-2">ابتداءً من <b>{x.price}</b> ر.س/فرد</div>
                    <button className="btn btn-ghost mt-3">إضافة للسلة</button>
                  </div>
                </HoverLift>
              </Item>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
