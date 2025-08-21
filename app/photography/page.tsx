// app/photography/page.tsx
import { Stagger, Item, HoverLift } from "@/components/Animated";

export default function PhotographyPage() {
  const items = [
    { id: "photo-men", title: "تصوير رجال", price: 2500 },
    { id: "photo-women", title: "تصوير نساء", price: 2800 },
    { id: "photo-both", title: "تصوير رجال + نساء", price: 5000 },
  ];
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-2xl font-bold mb-3">التصوير</h1>
        <Stagger>
          <div className="grid-3">
            {items.map((x) => (
              <Item key={x.id}>
                <HoverLift>
                  <div className="card p-5">
                    <h3 className="font-bold">{x.title}</h3>
                    <div className="text-gray-600 text-sm mt-1">فوتو + فيديو • 6 ساعات</div>
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
