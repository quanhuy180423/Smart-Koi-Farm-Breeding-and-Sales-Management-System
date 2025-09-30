"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";
import { FishSelectionSection } from "./FishSelectionSection";
import FatherFishInfo from "./FatherFishInfo";
import MotherFishInfo from "./MotherFishInfo";
import ComparisonSection from "./ComparisonSection";

interface Fish {
  id: number;
  name: string;
  variety: string;
  size: string;
  age: string;
  price: number;
  origin: string;
  breeder: string;
  image: string;
  gender: string;
  bloodline: string;
  certificates: string[];
  compatibility: string[];
}

export default function Main() {
  const router = useRouter();
  const [selectedFatherFish, setSelectedFatherFish] = useState<Fish | null>(null);
  const [selectedMotherFish, setSelectedMotherFish] = useState<Fish | null>(null);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  const handleFishSelection = (fatherFish: Fish, motherFish: Fish) => {
    setSelectedFatherFish(fatherFish);
    setSelectedMotherFish(motherFish);
    setShowDetailedInfo(true);
  };

  const handleCancel = () => {
    setSelectedFatherFish(null);
    setSelectedMotherFish(null);
    setShowDetailedInfo(false);
  };

  const handleCreateBreeding = () => {
    // Logic tạo cặp sinh sản
    console.log("Creating breeding pair:", { selectedFatherFish, selectedMotherFish });
    router.push("/manager/breeding");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between p-8 pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-gray-900 text-2xl tracking-[0] leading-8">
            Thêm cặp sinh sản mới
          </h1>
          <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-base tracking-[0] leading-6">
            {showDetailedInfo 
              ? "Chi tiết thông tin cặp sinh sản - Bạn có thể chọn lại cặp khác nếu cần" 
              : "Tạo một cặp sinh sản mới với tiêu chí đánh giá thương mại"
            }
          </p>
        </div>
      </header>

      <main className="px-8 pb-8">
        <div className="w-full space-y-4">
          {!showDetailedInfo ? (
            <FishSelectionSection onSelection={handleFishSelection} />
          ) : (
            <div className="space-y-8">
              {/* Father Fish Info */}
              {selectedFatherFish && (
                <div className="space-y-4">
                  <FatherFishInfo selectedFish={selectedFatherFish} />
                </div>
              )}
              
              {/* Mother Fish Info */}
              {selectedMotherFish && (
                <div className="space-y-4">
                  <MotherFishInfo selectedFish={selectedMotherFish} />
                </div>
              )}
              
              {/* Compatibility Assessment */}
              {selectedFatherFish && selectedMotherFish && (
                <ComparisonSection 
                  fatherFish={selectedFatherFish} 
                  motherFish={selectedMotherFish} 
                />
              )}
            </div>
          )}
        </div>

        {showDetailedInfo && (
          <div className="flex justify-end gap-4 mt-12">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Chọn lại
            </Button>

            <Button 
              onClick={handleCreateBreeding}
            >
              Tạo cặp sinh sản
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}