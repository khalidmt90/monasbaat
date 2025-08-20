export default function Stars({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="text-[#F59E0B] text-sm">
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(Math.max(0, empty))}
    </span>
  );
}
