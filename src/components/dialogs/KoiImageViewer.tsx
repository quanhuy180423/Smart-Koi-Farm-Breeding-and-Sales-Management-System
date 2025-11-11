"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 border-0 rounded-2xl">
        {/* Header */}
        <DialogHeader className="flex flex-row items-start justify-between p-4 border-b bg-white z-10 rounded-t-2xl">
          <div>
            <DialogTitle className="text-lg">
              {rfid} - Ảnh số {selectedImageIdx + 1} / {images.length}
            </DialogTitle>
            <DialogDescription>Xem chi tiết hình ảnh cá</DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="shrink-0 -mt-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Image Container */}
        <div
          className={`flex-1 w-full h-auto flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 ${images.length === 1 ? "rounded-b-2xl" : ""}`}
        >
          <Image
            src={images[selectedImageIdx]}
            alt={`${rfid} - Ảnh ${selectedImageIdx + 1}`}
            width={1000}
            height={800}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Navigation Footer */}
        {images.length > 1 && (
          <div className="flex items-center justify-between gap-4 p-4 border-t bg-gray-50 rounded-b-2xl">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevImage}
              disabled={images.length === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onImageIdxChange(idx)}
                  className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImageIdx === idx
                      ? "border-primary ring-2 ring-primary"
                      : "border-gray-300 hover:border-primary"
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

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextImage}
              disabled={images.length === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
