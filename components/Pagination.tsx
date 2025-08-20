"use client";

import Link from "next/link";

export default function Pagination({
  page,
  total,
  pageSize,
}: {
  page: number;
  total: number;
  pageSize: number;
}) {
  const pages = Math.ceil(total / pageSize);

  if (pages <= 1) return null;

  return (
    <div className="flex gap-2 mt-6">
      {Array.from({ length: pages }).map((_, i) => {
        const num = i + 1;
        return (
          <Link
            key={num}
            href={`?page=${num}`}
            className={`btn btn-sm ${page === num ? "btn-primary" : "btn-ghost"}`}
          >
            {num}
          </Link>
        );
      })}
    </div>
  );
}
