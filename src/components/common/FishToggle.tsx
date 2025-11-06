"use client";

import { useFishSchool } from "@/lib/context/FishSchoolContext";
import { Button } from "@/components/ui/button";
import { Fish } from "lucide-react";

export const FishToggle = () => {
  const { isEnabled, toggleFishSchool } = useFishSchool();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFishSchool}
      title={isEnabled ? "Tắt hiệu ứng cá" : "Bật hiệu ứng cá"}
      className="flex items-center gap-2"
    >
      <Fish
        className={`w-5 h-5 transition-opacity duration-200 ${isEnabled ? "opacity-100" : "opacity-40"}`}
      />
      <span className="text-xs hidden sm:inline">
        {isEnabled ? "Cá bật" : "Cá tắt"}
      </span>
    </Button>
  );
};
