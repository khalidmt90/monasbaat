// app/book/[slug]/page.tsx
import { redirect } from "next/navigation";
export default function LegacyBookRedirect({ params }: { params: { slug: string } }) {
  redirect(`/halls/${params.slug}/book`);
}
