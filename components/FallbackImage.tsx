"use client";

import Image from "next/image";
import { useState } from "react";

type Props = Omit<React.ComponentProps<typeof Image>, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function FallbackImage({ src, fallbackSrc = "/placeholder-hall.svg", alt, ...rest }: Props) {
  const [currentSrc, setCurrentSrc] = useState<string>(typeof src === "string" && src ? src : fallbackSrc);

  const imageProps = {
    src: currentSrc,
    alt: alt ?? "صورة",
    onError: () => setCurrentSrc(fallbackSrc),
    ...rest,
  } as const;

  return <Image {...(imageProps as any)} />;
}
