import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-gray-500 mb-3" aria-label="breadcrumb">
      <ol className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {it.href ? <Link href={it.href} className="hover:underline">{it.label}</Link> : <span>{it.label}</span>}
            {i < items.length - 1 ? <span className="text-gray-400">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
