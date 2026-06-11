"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_OBJECT_POSITION } from "@/lib/artworks/display";

interface ProtectedArtworkImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  watermark?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export function ProtectedArtworkImage({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  imageClassName,
  sizes,
  watermark = true,
  objectFit = "cover",
  objectPosition = DEFAULT_OBJECT_POSITION,
}: ProtectedArtworkImageProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      className={cn(
        "artwork-protected relative overflow-hidden",
        objectFit === "contain" && "bg-cream/50",
        fill && "w-full h-full",
        className
      )}
      onContextMenu={handleContextMenu}
    >
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
          className={cn(fitClass, "transition-transform duration-500", imageClassName)}
          style={{ objectPosition }}
          draggable={false}
          onDragStart={handleDragStart}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 1000}
          priority={priority}
          sizes={sizes}
          className={cn(
            imageClassName ?? "w-full h-auto block",
            objectFit === "cover" && fitClass
          )}
          style={objectFit === "cover" ? { objectPosition } : undefined}
          draggable={false}
          onDragStart={handleDragStart}
        />
      )}
      {watermark && objectFit === "cover" && (
        <div
          className="absolute inset-0 pointer-events-none flex items-end justify-end p-3"
          aria-hidden="true"
        >
          <span className="text-white/15 text-[10px] font-serif select-none tracking-wide">
            EllaWrightsArt
          </span>
        </div>
      )}
    </div>
  );
}
