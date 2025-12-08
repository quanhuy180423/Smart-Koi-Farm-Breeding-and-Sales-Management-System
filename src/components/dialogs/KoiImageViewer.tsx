"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface KoiImageViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  selectedImageIdx: number;
  onImageIdxChange: (idx: number) => void;
  rfid: string;
}

export function KoiImageViewer({
  isOpen,
  onOpenChange,
  images,
  selectedImageIdx,
  onImageIdxChange,
  rfid,
}: KoiImageViewerProps) {
  const handlePrevImage = () => {
    onImageIdxChange(
      selectedImageIdx === 0 ? images.length - 1 : selectedImageIdx - 1,
    );
  };

  const handleNextImage = () => {
    onImageIdxChange(
      selectedImageIdx === images.length - 1 ? 0 : selectedImageIdx + 1,
    );
  };

  if (!images || images.length === 0) return null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/70 flex flex-col items-center justify-center pointer-events-none"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(false);
        }}
        className="absolute top-6 right-6 z-10 text-white hover:text-gray-300 transition-colors pointer-events-auto"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Main Image Container with Side Navigation */}
      <div className="flex-1 w-full flex items-center justify-center px-8 relative">
        {/* Left Navigation Button */}
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage();
          }}
          disabled={images.length === 1}
          className="absolute left-4 rounded-full bg-white/20 hover:bg-white/40 text-white border-0 pointer-events-auto"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <Image
          src={images[selectedImageIdx]}
          alt={`${rfid} - Ảnh ${selectedImageIdx + 1}`}
          width={1400}
          height={1000}
          sizes="100vw"
          className="w-auto h-auto max-w-full max-h-[85vh] object-contain pointer-events-auto"
          priority
          unoptimized
        />

        {/* Right Navigation Button */}
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage();
          }}
          disabled={images.length === 1}
          className="absolute right-4 rounded-full bg-white/20 hover:bg-white/40 text-white border-0 pointer-events-auto"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Navigation and Thumbnails Container */}
      <div className="w-full bg-black/0 py-6 px-8 pointer-events-auto">
        {/* Image Counter */}
        <div className="text-center mb-4">
          <span className="text-white text-sm font-medium">
            {selectedImageIdx + 1} / {images.length}
          </span>
        </div>

        {/* Thumbnail List */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageIdxChange(idx);
                }}
                className={`shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedImageIdx === idx
                    ? "border-white ring-2 ring-white"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
