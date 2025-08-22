"use client";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  rounded?: boolean | string;
}

export function Skeleton({ className, rounded = true }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "skeleton bg-gray-200 dark:bg-white/10 relative overflow-hidden",
        rounded === true && "rounded-xl",
        typeof rounded === "string" && rounded,
        className
      )}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-40 w-full" rounded={false} />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
