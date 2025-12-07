"use client";

import { Button } from "@/components/ui/button";
import { InputNumber } from "@/components/ui/input-number";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, RotateCcw } from "lucide-react";
// DatePickerFilter removed from this sheet; moved to other pages if needed
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import { getOrderStatusLabel } from "@/lib/utils/enum/formatEnum";

interface OrderFilterSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // Status filter
  statusFilter: OrderStatus | string;
  onStatusFilterChange: (value: OrderStatus | string) => void;
  // Date filters removed (handled elsewhere/removed)
  // Price range
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  // Has promotion
  hasPromotion: boolean;
  onHasPromotionChange: (value: boolean) => void;
  // Reset filters
  onResetFilters: () => void;
}

export function OrderFilterSheet({
  isOpen,
  onOpenChange,
  statusFilter,
  onStatusFilterChange,
  // removed date props
  priceRange,
  onPriceRangeChange,
  hasPromotion,
  onResetFilters,
}: OrderFilterSheetProps) {
  // Check if any filter is active
  const hasActiveFilters =
    statusFilter !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000000 ||
    hasPromotion;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc đơn hàng
          </SheetTitle>
          <SheetDescription>
            Lọc đơn hàng theo các tiêu chí bên dưới
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Trạng thái đơn hàng</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getOrderStatusLabel(status).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Date range removed */}

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Khoảng giá</label>
              <span className="text-xs font-medium text-primary">
                {formatCurrency(priceRange[0])} -{" "}
                {formatCurrency(priceRange[1])}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                onPriceRangeChange(value as [number, number])
              }
              min={0}
              max={100000000}
              step={500000}
              className="w-full"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Tối thiểu</p>
                <InputNumber
                  value={priceRange[0]}
                  onChange={(value) => {
                    const validValue = value || 0;
                    onPriceRangeChange([
                      Math.min(validValue, priceRange[1]),
                      priceRange[1],
                    ]);
                  }}
                  className="text-sm"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Tối đa</p>
                <InputNumber
                  value={priceRange[1]}
                  onChange={(value) => {
                    const validValue = value || 100000000;
                    onPriceRangeChange([
                      priceRange[0],
                      Math.max(validValue, priceRange[0]),
                    ]);
                  }}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Áp dụng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
