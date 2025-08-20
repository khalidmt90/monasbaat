import { formatPrice } from "@/lib/utils";

export default function PriceWidget({
  base,
  cateringEstimate = 0,
  platformFeePct = 5,
  vatPct = 15,
}: {
  base: number;
  cateringEstimate?: number;
  platformFeePct?: number;
  vatPct?: number;
}) {
  const platform = Math.round((base + cateringEstimate) * (platformFeePct / 100));
  const subtotal = base + cateringEstimate + platform;
  const vat = Math.round(subtotal * (vatPct / 100));
  const total = subtotal + vat;

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-2">ملخص التكلفة</h3>
      <div className="space-y-1 text-sm">
        <Row label="إيجار القاعة" value={`${formatPrice(base)} ر.س`} />
        <Row label="الضيافة (تقديري)" value={`${formatPrice(cateringEstimate)} ر.س`} />
        <Row label={`رسوم المنصة (${platformFeePct}%)`} value={`${formatPrice(platform)} ر.س`} />
        <Row label={`الضريبة (${vatPct}%)`} value={`${formatPrice(vat)} ر.س`} />
        <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
          <span>الإجمالي التقريبي</span>
          <b>{formatPrice(total)} ر.س</b>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span>{label}</span><span>{value}</span></div>;
}
