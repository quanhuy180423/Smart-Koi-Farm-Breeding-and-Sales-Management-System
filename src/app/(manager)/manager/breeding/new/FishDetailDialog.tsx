"use client";

import { useState } from "react";
import Image from "next/image";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import getAge from "@/lib/utils/dates/age";
import { getFishSizeLabel } from "@/lib/utils/enum";

interface FishDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFish: KoiFishResponse | null;
  type: "father" | "mother";
  onSelect: (fish: KoiFishResponse) => void;
  onListClose: () => void;
}

export function FishDetailDialog({
  isOpen,
  onOpenChange,
  selectedFish,
  type,
  onSelect,
  onListClose,
}: FishDetailDialogProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!selectedFish) return null;

  const handleSelectFish = () => {
    onSelect(selectedFish);
    onOpenChange(false);
    onListClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Chi tiết cá {type === "father" ? "bố" : "mẹ"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Gallery */}
          {selectedFish.images && selectedFish.images.length > 0 && (
            <div className="space-y-2">
              {/* Main Image */}
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border">
                <Image
                  src={selectedFish.images[selectedImageIdx]}
                  alt={`${selectedFish.rfid} - Ảnh ${selectedImageIdx + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {selectedFish.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {selectedFish.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`flex-shrink-0 relative w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImageIdx === idx
                          ? "border-primary"
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
              )}
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">RFID</p>
              <p className="font-semibold">{selectedFish.rfid}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Giống</p>
              <p className="font-semibold">
                {selectedFish.variety.varietyName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Tuổi</p>
              <p className="font-semibold">{getAge(selectedFish.birthDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kích thước</p>
              <p className="font-semibold">
                {getFishSizeLabel(selectedFish.size)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Hình dạng cơ thể</p>
              <p className="font-semibold">{selectedFish.bodyShape}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hồ</p>
              <p className="font-semibold">{selectedFish.pond.pondName}</p>
            </div>
          </div>

          {/* Description */}
          {selectedFish.description && (
            <div>
              <p className="text-muted-foreground text-sm mb-1">Mô tả</p>
              <p className="text-sm text-gray-700">
                {selectedFish.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Quay lại
            </Button>
            <Button onClick={handleSelectFish} className="flex-1">
              Chọn cá này
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
