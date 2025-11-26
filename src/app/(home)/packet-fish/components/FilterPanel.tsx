"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input"; // Cần shadcn Input
import { Badge } from "@/components/ui/badge"; // Cần shadcn Badge
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Ruler,
  Calendar,
  Banknote,
  Layers,
} from "lucide-react";
import formatCurrency from "@/lib/utils/numbers";
import { cn } from "@/lib/utils";

// --- Interfaces ---
export const initialFilterState = {
  sizeRange: [0, 90] as [number, number],
  ageRange: [0, 60] as [number, number],
  quantityRange: [0, 100] as [number, number],
  priceRange: [0, 50000000] as [number, number],
};

export interface FilterPanelProps {
  filters: typeof initialFilterState;
  setFilters: React.Dispatch<React.SetStateAction<typeof initialFilterState>>;
  handleApplyFilters: () => void;
  resetFilters: () => void;
  hasAnythingToReset: () => boolean;
}

// --- Reusable Sub-Component ---
interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  value: [number, number];
  onChange: (val: [number, number]) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  isCurrency?: boolean;
  quickOptions?: { label: string; value: [number, number] }[];
}

const FilterSection = ({
  title,
  icon,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  isCurrency = false,
  quickOptions,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (index: 0 | 1, newVal: string) => {
    const num = parseInt(newVal.replace(/\D/g, "")) || 0;
    const newRange = [...value] as [number, number];
    newRange[index] = num;

    // Basic validation logic to prevent crossover could be added here
    onChange(newRange);
  };

  return (
    <div className="border-b border-dashed pb-5 last:border-0 last:pb-0">
      <button
        className="flex w-full items-center justify-between py-2 hover:text-primary transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="text-primary/70 group-hover:text-primary">
            {icon}
          </span>
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="pt-3 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Inputs Row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={
                  isCurrency
                    ? formatCurrency(value[0]).replace("₫", "").trim()
                    : value[0]
                }
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="h-8 text-xs px-2 text-right"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                Thấp nhất
              </span>
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="relative flex-1">
              <Input
                type="text"
                value={
                  isCurrency
                    ? formatCurrency(value[1]).replace("₫", "").trim()
                    : value[1]
                }
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="h-8 text-xs px-2 text-right"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                Cao nhất
              </span>
            </div>
          </div>

          {/* Slider */}
          <Slider
            value={value}
            onValueChange={(val) => onChange(val as [number, number])}
            max={max}
            min={min}
            step={step}
            className="w-full"
          />

          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
            <span>{isCurrency ? formatCurrency(min) : `${min} ${unit}`}</span>
            <span>{isCurrency ? formatCurrency(max) : `${max} ${unit}`}</span>
          </div>

          {/* Quick Filter Chips */}
          {quickOptions && (
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors font-normal bg-slate-100 text-slate-600"
                  onClick={() => onChange(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const FilterPanel = ({
  filters,
  setFilters,
  handleApplyFilters,
  resetFilters,
  hasAnythingToReset,
}: FilterPanelProps) => {
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl border shadow-sm">
      {/* Header Mobile/Desktop */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-[#0A3D62]">Bộ lọc</span>
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

      <div className="space-y-2">
        {/* Kích thước */}
        <FilterSection
          title="Kích thước"
          icon={<Ruler className="w-4 h-4" />}
          value={filters.sizeRange}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, sizeRange: val }))
          }
          min={0}
          max={90}
          step={5}
          unit="cm"
          quickOptions={[
            { label: "Nhỏ (<20cm)", value: [0, 20] },
            { label: "Vừa (20-50cm)", value: [20, 50] },
            { label: "Lớn (>50cm)", value: [50, 90] },
          ]}
        />

        {/* Tuổi */}
        <FilterSection
          title="Độ tuổi"
          icon={<Calendar className="w-4 h-4" />}
          value={filters.ageRange}
          onChange={(val) => setFilters((prev) => ({ ...prev, ageRange: val }))}
          min={0}
          max={60}
          step={1}
          unit="tháng"
        />

        {/* Số lượng */}
        <FilterSection
          title="Số lượng trong gói"
          icon={<Layers className="w-4 h-4" />}
          value={filters.quantityRange}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, quantityRange: val }))
          }
          min={0}
          max={100}
          step={5}
          unit="con"
          quickOptions={[
            { label: "Ít (1-10)", value: [1, 10] },
            { label: "Nhiều (>50)", value: [50, 100] },
          ]}
        />

        {/* Giá */}
        <FilterSection
          title="Khoảng giá"
          icon={<Banknote className="w-4 h-4" />}
          value={filters.priceRange}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, priceRange: val }))
          }
          min={0}
          max={50000000}
          step={500000}
          isCurrency
          quickOptions={[
            { label: "< 5 triệu", value: [0, 5000000] },
            { label: "5 - 20 triệu", value: [5000000, 20000000] },
            { label: "> 20 triệu", value: [20000000, 50000000] },
          ]}
        />
      </div>

      {/* Action Button - Sticky Bottom style effect if needed */}
      <div className="pt-4 mt-4 border-t">
        <Button
          onClick={handleApplyFilters}
          className="w-full h-11 bg-[#0A3D62] hover:bg-[#0A3D62]/90 text-base font-semibold shadow-md active:scale-[0.98] transition-transform"
        >
          Xem kết quả
        </Button>

        {/* Nút reset phụ bên dưới nếu người dùng lỡ tay kéo sai nhiều */}
        <Button
          onClick={resetFilters}
          variant="ghost"
          disabled={!hasAnythingToReset()}
          className={cn(
            "w-full mt-2 h-9 text-sm text-muted-foreground",
            !hasAnythingToReset() && "hidden",
          )}
        >
          <RotateCcw className="h-3 w-3 mr-2" />
          Đặt lại mặc định
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
