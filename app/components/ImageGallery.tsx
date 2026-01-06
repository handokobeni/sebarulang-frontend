"use client";

import { useState, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";
import { Button } from "./ui/button";

interface ImageGalleryProps {
  images: string[];
  status: "available" | "claimed";
  className?: string;
}

function ImageGalleryComponent({ images, status, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : [];
  
  if (displayImages.length === 0) {
    return (
      <div className={`relative aspect-video bg-gray-100 ${className || ""}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">Tidak ada gambar</p>
        </div>
        <Badge
          className="absolute top-4 right-4"
          variant={status === "available" ? "default" : "secondary"}
        >
          {status === "available" ? "Tersedia" : "Sudah Diambil"}
        </Badge>
      </div>
    );
  }

  const hasMultipleImages = displayImages.length > 1;
  const canGoPrevious = hasMultipleImages && selectedIndex > 0;
  const canGoNext = hasMultipleImages && selectedIndex < displayImages.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <div className={`${className || ""}`}>
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={displayImages[selectedIndex]}
          alt={`Gambar ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <Badge
          className="absolute top-4 right-4 z-10"
          variant={status === "available" ? "default" : "secondary"}
        >
          {status === "available" ? "Tersedia" : "Sudah Diambil"}
        </Badge>

        {/* Navigation Arrows (jika lebih dari 1 gambar) */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            {canGoPrevious && (
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="size-5" />
              </Button>
            )}

            {/* Next Button */}
            {canGoNext && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md"
                aria-label="Gambar berikutnya"
              >
                <ChevronRight className="size-5" />
              </Button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Grid (jika lebih dari 1 gambar) */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-4 bg-white border-t border-gray-200">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? "border-green-600 ring-2 ring-green-200"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`Lihat gambar ${idx + 1}`}
            >
              <ImageWithFallback
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedIndex === idx && (
                <div className="absolute inset-0 bg-green-600/20" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const ImageGallery = memo(ImageGalleryComponent);

