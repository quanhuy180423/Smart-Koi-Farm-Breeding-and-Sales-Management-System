// components/koi/components/KoiFilterPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gender } from "@/lib/api/services/fetchKoiFish";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetVarieties } from "@/hooks/useVariety"; // Đảm bảo đường dẫn đúng
import { VarietyResponse } from "@/lib/api/services/fetchVariety";

export const initialFilterState = {
  selectedGender: "Tất cả" as string,
  sizeRange: [0, 90] as [number, number],
  priceRange: [0, 100000000] as [number, number],
  selectedOrigin: "Tất cả",
  selectedVariety: "Tất cả",
  selectedStatus: "Tất cả",
  showCertified: false,
};

interface FilterPanelProps {
  filters: typeof initialFilterState;
  setFilters: React.Dispatch<React.SetStateAction<typeof initialFilterState>>;
  handleApplyFilters: () => void;
  resetFilters: () => void;
  hasAnythingToReset: () => boolean;
}

// --- Component Select Variety Riêng Biệt ---
const VarietyFilterSelect = ({
  selectedVariety,
  onVarietyChange,
}: {
  selectedVariety: string;
  onVarietyChange: (value: string) => void;
}) => {
  // Fetch toàn bộ giống cá để hiển thị trong filter
  const { data: varietiesData, isLoading } = useGetVarieties({
    pageIndex: 1,
    pageSize: 100, // Lấy đủ số lượng
  });

  return (
    <Select
      value={selectedVariety}
      onValueChange={onVarietyChange}
      disabled={isLoading}
    >
      <SelectTrigger className="h-10 text-sm w-full">
        <SelectValue
          placeholder={isLoading ? "Đang tải..." : "Chọn giống cá"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Tất cả">Tất cả giống</SelectItem>
        {varietiesData?.data.map((variety: VarietyResponse) => (
          // Quan trọng: value phải là string để khớp với state
          <SelectItem key={variety.id} value={variety.id.toString()}>
            {variety.varietyName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// --- Main Component ---
export const KoiFilterPanel = ({
  filters,
  setFilters,
  handleApplyFilters,
  resetFilters,
  hasAnythingToReset,
}: FilterPanelProps) => {
  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = num;
    setFilters((prev) => ({ ...prev, priceRange: newRange }));
  };

  const handleSizeInputChange = (index: 0 | 1, value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    const newRange = [...filters.sizeRange] as [number, number];
    newRange[index] = Math.min(Math.max(num, 0), 90);
    setFilters((prev) => ({ ...prev, sizeRange: newRange }));
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-[#0A3D62]">Bộ lọc</h3>
        {hasAnythingToReset() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["variety", "price", "gender", "size"]}
        className="w-full"
      >
        {/* Variety Filter - Moved to top priority */}
        <AccordionItem value="variety" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline hover:text-primary font-semibold">
            Giống cá
          </AccordionTrigger>
          <AccordionContent className="w-full">
            <VarietyFilterSelect
              selectedVariety={filters.selectedVariety}
              onVarietyChange={(val) =>
                setFilters((prev) => ({ ...prev, selectedVariety: val }))
              }
            />
          </AccordionContent>
        </AccordionItem>

        {/* Gender */}
        <AccordionItem value="gender" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline hover:text-primary">
            Giới tính
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {["Tất cả", Gender.MALE, Gender.FEMALE].map((g) => (
                <Button
                  key={g}
                  type="button"
                  variant={filters.selectedGender === g ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, selectedGender: g }))
                  }
                  className={`text-xs ${filters.selectedGender === g ? "bg-[#0A3D62]" : ""}`}
                >
                  {g === "Tất cả"
                    ? "Tất cả"
                    : g === Gender.MALE
                      ? "Đực"
                      : "Cái"}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline hover:text-primary">
            Khoảng giá
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="space-y-1 flex-1">
                <Label className="text-[10px] text-muted-foreground">
                  Thấp nhất
                </Label>
                <Input
                  className="h-8 text-xs px-2"
                  value={formatCurrency(filters.priceRange[0])
                    .replace("₫", "")
                    .trim()}
                  onChange={(e) => handlePriceInputChange(0, e.target.value)}
                />
              </div>
              <span className="pt-4">-</span>
              <div className="space-y-1 flex-1">
                <Label className="text-[10px] text-muted-foreground">
                  Cao nhất
                </Label>
                <Input
                  className="h-8 text-xs px-2"
                  value={formatCurrency(filters.priceRange[1])
                    .replace("₫", "")
                    .trim()}
                  onChange={(e) => handlePriceInputChange(1, e.target.value)}
                />
              </div>
            </div>
            <Slider
              value={filters.priceRange}
              max={100000000}
              step={1000000}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: val as [number, number],
                }))
              }
              className="py-2"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline hover:text-primary">
            Kích thước (cm)
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Inputs size giữ nguyên như cũ */}
              <div className="space-y-1 flex-1">
                <Label className="text-[10px] text-muted-foreground">
                  Thấp nhất
                </Label>
                <Input
                  className="h-8 text-xs px-2"
                  value={filters.sizeRange[0]}
                  onChange={(e) => handleSizeInputChange(0, e.target.value)}
                />
              </div>
              <span className="pt-4">-</span>
              <div className="space-y-1 flex-1">
                <Label className="text-[10px] text-muted-foreground">
                  Cao nhất
                </Label>
                <Input
                  className="h-8 text-xs px-2"
                  value={filters.sizeRange[1]}
                  onChange={(e) => handleSizeInputChange(1, e.target.value)}
                />
              </div>
            </div>
            <Slider
              value={filters.sizeRange}
              max={90}
              step={1}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  sizeRange: val as [number, number],
                }))
              }
              className="py-2"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-2 border-t lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:bg-transparent lg:border-t lg:border-gray-200">
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-[#0A3D62] hover:bg-[#0A3D62]/90 font-semibold"
        >
          Xem kết quả
        </Button>
        <Button
          onClick={resetFilters}
          variant="ghost"
          className="w-full mt-2 text-xs text-muted-foreground"
          disabled={!hasAnythingToReset()}
        >
          <RotateCcw className="w-3 h-3 mr-2" /> Đặt lại mặc định
        </Button>
      </div>
    </div>
  );
};
