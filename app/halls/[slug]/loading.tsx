// app/halls/[slug]/loading.tsx
export default function LoadingHall() {
  return (
    <section className="section">
      <div className="container">
        <div className="animate-pulse grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-gray-200" />
            ))}
          </div>
          <div className="card p-4 h-40 bg-gray-100" />
        </div>
      </div>
    </section>
  );
}
