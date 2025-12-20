"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";
import { FishSelectionSection } from "./FishSelectionSection";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import { ArrowLeft } from "lucide-react";

export default function Main() {
  const router = useRouter();

  const handleFishSelection = (
    fatherFish: KoiFishResponse,
    motherFish: KoiFishResponse,
  ) => {
    router.push(
      `/manager/breeding/new/info?male=${fatherFish.id}&female=${motherFish.id}`,
    );
  };

  const handleBack = () => {
    router.push("/manager/breeding");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between p-8 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full hover:bg-gray-100"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>

          <div className="flex flex-col">
            <h1 className="font-bold text-gray-900 text-2xl">
              Thêm cặp sinh sản mới
            </h1>
            <p className="text-gray-600 text-base">
              Tạo một cặp sinh sản mới với tiêu chí đánh giá thương mại
            </p>
          </div>
        </div>
      </header>

      <main className="px-8 pb-8">
        <div className="w-full space-y-4">
          <FishSelectionSection onSelection={handleFishSelection} />
        </div>
      </main>
    </div>
  );
}
