// app/book/[slug]/page.tsx
import BookForm from "./BookForm";
import { halls } from "@/lib/data";
import { notFound } from "next/navigation";

export default function BookHall({ params }: { params: { slug: string } }) {
  const hallObj = halls.find((h) => h.id === params.slug);
  if (!hallObj) return notFound();

  return (
    <section className="section">
      <div className="container">
        <BookForm hall={hallObj} />
      </div>
    </section>
  );
}
