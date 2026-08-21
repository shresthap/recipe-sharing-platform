"use client";

import { useState } from "react";

interface RecipeImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function RecipeImage({ src, alt, className }: RecipeImageProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(src) && !hasError;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-stone-100 ${className ?? ""}`}>
      {showImage ? (
        // User-supplied remote URLs; fall back if the host blocks the request.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? ""}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40 sm:text-5xl">
          🍽️
        </div>
      )}
    </div>
  );
}
