import Link from "next/link";

export type CardItem = {
  href?: string;
  title: string;
  subtitle?: string;
  image?: string;   // background image url
  icon?: string;    // font-awesome class e.g. "fa-camera"
  meta?: string;    // small line under title
  footer?: string;  // small action text
};

export default function CardGrid({ items, cols = 3 }: { items: CardItem[]; cols?: 2 | 3 | 4 }) {
  const gridClass =
    cols === 4 ? "grid-4" : cols === 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "grid-3";

  return (
    <div className={gridClass}>
      {items.map((it, i) => {
        const Wrapper: any = it.href ? Link : "div";
        const wrapperProps: any = it.href ? { href: it.href } : {};
        return (
          <Wrapper key={i} {...wrapperProps} className="card group overflow-hidden">
            {it.image ? (
              <div
                className="h-44 bg-center bg-cover group-hover:scale-[1.02] transition-transform"
                style={{ backgroundImage: `url(${it.image})` }}
              />
            ) : null}
            <div className="p-4">
              <div className="flex items-center gap-2">
                {it.icon ? <i className={`fa-solid ${it.icon} text-lg`} /> : null}
                <h3 className="font-bold">{it.title}</h3>
              </div>
              {it.subtitle ? <p className="text-gray-600 mt-1">{it.subtitle}</p> : null}
              {it.meta ? <div className="text-sm text-gray-500 mt-1">{it.meta}</div> : null}
              {it.footer ? (
                <div className="mt-3 text-sm text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                  {it.footer} <i className="fa-solid fa-arrow-left-long" />
                </div>
              ) : null}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}

