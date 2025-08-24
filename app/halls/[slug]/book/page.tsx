import { notFound } from "next/navigation";
import { halls } from "@/lib/data";
import BookForm from "./BookForm";

export default function BookHall({ params }: { params: { slug: string } }) {
  const hallObj = halls.find(h => h.id === params.slug);
  if(!hallObj) return notFound();
  return (
    <section className="section">
      <div className="container">
        <BookForm hall={hallObj} />
      </div>
    </section>
  );
}
