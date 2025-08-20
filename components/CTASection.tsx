import Link from "next/link";

export default function CTASection({
  title,
  subtitle,
  href,
  label,
}: { title: string; subtitle?: string; href: string; label: string }) {
  return (
    <div className="card p-6 md:p-8 bg-gradient-to-br from-ivory to-white">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-extrabold">{title}</h3>
          {subtitle ? <p className="text-gray-600 mt-1">{subtitle}</p> : null}
        </div>
        <Link href={href} className="btn btn-primary">{label}</Link>
      </div>
    </div>
  );
}
