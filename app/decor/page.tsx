// app/decor/page.tsx
import { Stagger, Item, HoverLift } from "@/components/Animated";

export default function DecorPage() {
  const items = [
    { id: "dec-basic", title: "ديكور أساسي", price: 3500 },
    { id: "dec-gold", title: "ديكور ذهبي", price: 7500 },
    { id: "dec-lux", title: "ديكور فاخر", price: 12000 },
  ];
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-3">الديكور</h1>
        <Stagger>
          <div className="grid-3">
            {items.map((x) => (
              <Item key={x.id}>
                <HoverLift>
                  <div className="card p-5">
                    <h3 className="font-bold">{x.title}</h3>
                    <div className="text-gray-600 text-sm mt-1">حزم مسرح، طاولات، زهور</div>
                    <div className="mt-2">ابتداءً من <b>{x.price.toLocaleString("ar-SA")}</b> ر.س</div>
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
