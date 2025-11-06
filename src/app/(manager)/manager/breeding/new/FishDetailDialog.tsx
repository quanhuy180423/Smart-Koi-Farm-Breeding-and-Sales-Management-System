"use client";

import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import { KoiDetailDialog } from "@/components/dialogs/KoiDetailDialog";

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
  const handleSelectFish = (fish: KoiFishResponse) => {
    onSelect(fish);
    onOpenChange(false);
    onListClose();
  };

  return (
    <KoiDetailDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      koi={selectedFish}
      showPricingInfo={false}
      onSelectFish={handleSelectFish}
      onSelectLabel={`Chọn cá ${type === "father" ? "bố" : "mẹ"}`}
    />
  );
}
