"use client";

import Image from "next/image";
import { useState } from "react";

type Props = Omit<React.ComponentProps<typeof Image>, "src"> & {
  src?: string | null;
  /** fallback image path (local) */
  fallbackSrc?: string;
  /** if true, image is purely decorative (sets empty alt) */
  decorative?: boolean;
};

export default function FallbackImage({
  src,
  fallbackSrc = "/placeholder-hall.svg",
  alt,
  decorative = false,
  onError,
  ...rest
}: Props) {
  const [currentSrc, setCurrentSrc] = useState<string>(typeof src === "string" && src ? src : fallbackSrc);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
    onError?.(e);
  };

  const resolvedAlt = decorative ? "" : (alt || "صورة");

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={resolvedAlt}
      onError={handleError}
    />
  );
}
