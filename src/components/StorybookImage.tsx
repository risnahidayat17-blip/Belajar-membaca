import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface StorybookImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const StorybookImage: React.FC<StorybookImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 text-slate-700 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-10 h-10 text-sky-600" aria-hidden="true" />
        <span className="font-display text-sm font-semibold text-slate-700">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
