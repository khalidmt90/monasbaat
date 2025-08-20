// app/halls/page.tsx
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FiltersBar from "@/components/FiltersBar";
import Pagination from "@/components/Pagination";
import Stars from "@/components/Stars";
import { halls } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function HallsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Number(searchParams.page || 1);
  const pageSize = 12;

  const city = (searchParams.city as string) || "";
  const session = (searchParams.session as string) || "";
  const men = Number(searchParams.men || 0);
  const women = Number(searchParams.women || 0);

  let results = halls.filter(
    (h) =>
      (!city || h.city === city) &&
      (!session || h.sessions.includes(session as any)) &&
      (men ? h.menCapacity >= men : true) &&
      (women ? h.womenCapacity >= women : true)
  );

  const total = results.length;
  results = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "القاعات" }]} />
        <h1 className="text-2xl font-bold mb-4">القاعات — النتائج</h1>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <FiltersBar />

          <div>
            <div className="grid-3">
              {results.map((h) => (
                <article key={h.id} className="card group">
                  <div
                    className="h-40 bg-center bg-cover group-hover:scale-[1.02] transition-transform"
                    style={{ backgroundImage: `url(${h.images[0]})` }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{h.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {h.city} • {h.area} • سعة {h.menCapacity + h.womenCapacity}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      {h.rating ? <Stars value={h.rating} /> : null}
                      {h.reviewsCount ? <span className="text-gray-500">({h.reviewsCount})</span> : null}
                    </div>
                    <div className="mt-2">
                      ابتداءً من <b>{formatPrice(h.basePrice)}</b> ر.س
                    </div>
                    <Link href={`/halls/${h.id}`} className="btn btn-ghost mt-3">
                      عرض التفاصيل
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <Pagination page={page} total={total} pageSize={pageSize} />
          </div>
        </div>
      </div>
    </section>
  );
}
