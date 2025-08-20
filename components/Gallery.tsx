export default function Gallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {images.map((src, i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}
