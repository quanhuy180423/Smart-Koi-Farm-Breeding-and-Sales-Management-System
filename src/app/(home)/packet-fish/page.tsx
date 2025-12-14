"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Filter, X, FishOff, Sparkles, Fish } from "lucide-react";
import { useGetPacketFishes } from "@/hooks/usePacketFish";
import { PacketFishSearchParams } from "@/lib/api/services/fetchPacketFish";
import { useAddItemToCart } from "@/hooks/useCart";
import { FilterPanel, initialFilterState } from "./components/FilterPanel";
import PacketFishCard from "./components/PacketFishCard";
import { PaginationWithLinks } from "@/components/pagination";
import { PacketFishGridSkeleton } from "./components/PacketFishSkeleton";
import formatCurrency from "@/lib/utils/numbers";

const PAGE_SIZE_OPTIONS = [9, 12, 24];

export default function PacketFishPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);
  const [isCreated, setIsCreated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { mutate: addToCart } = useAddItemToCart();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

  const handleAgeInputChange = (index: 0 | 1, value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    const newRange = [...filters.ageRange] as [number, number];
    newRange[index] = Math.min(Math.max(num, 0), 60);
    setFilters((prev) => ({ ...prev, ageRange: newRange }));
  };

  const handleQuantityInputChange = (index: 0 | 1, value: string) => {
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    const newRange = [...filters.quantityRange] as [number, number];
    newRange[index] = Math.min(Math.max(num, 0), 100);
    setFilters((prev) => ({ ...prev, quantityRange: newRange }));
  };

  const filterParams = useMemo((): PacketFishSearchParams => {
    const params: PacketFishSearchParams = {
      pageIndex: currentPage,
      pageSize: pageSize,
      isAvailable: true,
    };
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (appliedFilters.sizeRange[0] > 0 || appliedFilters.sizeRange[1] < 90) {
      params.minSize = appliedFilters.sizeRange[0];
      params.maxSize = appliedFilters.sizeRange[1];
    }
    if (appliedFilters.ageRange[0] > 0 || appliedFilters.ageRange[1] < 60) {
      params.minAgeMonths = appliedFilters.ageRange[0];
      params.maxAgeMonths = appliedFilters.ageRange[1];
    }
    if (
      appliedFilters.quantityRange[0] > 0 ||
      appliedFilters.quantityRange[1] < 100
    ) {
      params.minQuantity = appliedFilters.quantityRange[0];
      params.maxQuantity = appliedFilters.quantityRange[1];
    }
    if (
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 50000000
    ) {
      params.minPrice = appliedFilters.priceRange[0];
      params.maxPrice = appliedFilters.priceRange[1];
    }
    return params;
  }, [appliedFilters, debouncedSearchTerm, currentPage, pageSize]);

  const { data: packetData, isLoading } = useGetPacketFishes(filterParams);

  const handleAddToCart = (packetFishId: number) => {
    try {
      setIsCreated(true);
      addToCart({ packetFishId, quantity: 1 });
    } catch (error) {
      console.error("Error adding packet fish to cart:", error);
    } finally {
      setIsCreated(false);
    }
  };
  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(filters);
    setIsSheetOpen(false);
  };
  const resetFilters = () => {
    setSearchTerm("");
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setCurrentPage(1);
  };
  const hasAnythingToReset = () =>
    searchTerm !== "" ||
    JSON.stringify(filters) !== JSON.stringify(initialFilterState);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 90) count++;
    if (filters.ageRange[0] > 0 || filters.ageRange[1] < 60) count++;
    if (filters.quantityRange[0] > 0 || filters.quantityRange[1] < 100) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000) count++;
    return count;
  };

  // Handlers for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Hàm helper để xóa từng filter (Tăng UX)
  const removeFilter = (type: keyof typeof initialFilterState) => {
    const newFilters = { ...appliedFilters, [type]: initialFilterState[type] };
    setFilters(newFilters); // Update UI state
    setAppliedFilters(newFilters); // Update logic state
  };

  const filterPanelProps = {
    filters,
    setFilters,
    handleApplyFilters,
    resetFilters,
    hasAnythingToReset,
  };

  // Component hiển thị Active Filters
  const ActiveFilters = () => {
    const chips = [];
    if (appliedFilters.sizeRange[0] > 0 || appliedFilters.sizeRange[1] < 90) {
      chips.push({
        label: `Size: ${appliedFilters.sizeRange[0]}-${appliedFilters.sizeRange[1]}cm`,
        key: "sizeRange" as const,
      });
    }
    if (
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 50000000
    ) {
      chips.push({
        label: `Giá: ${formatCurrency(appliedFilters.priceRange[0])} - ${formatCurrency(appliedFilters.priceRange[1])}`,
        key: "priceRange" as const,
      });
    }

    if (chips.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
        {chips.map((chip) => (
          <Badge
            key={chip.key}
            variant="secondary"
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          >
            {chip.label}
            <button
              onClick={() => removeFilter(chip.key)}
              className="ml-2 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Button
          variant="link"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground h-auto p-0 ml-2"
        >
          Xóa tất cả
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="relative bg-[#0A3D62] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="absolute -right-10 -bottom-10 opacity-20">
          <Fish className="w-64 h-64 text-white" />
        </div>
        <div className="absolute right-50 bottom-10 opacity-20">
          <Fish className="w-64 h-64 text-white" />
        </div>
        <div className="absolute -left-10 bottom-40 opacity-20">
          <Fish className="w-64 h-64 text-white" />
        </div>
        <div className="absolute left-50 -bottom-25 opacity-20">
          <Fish className="w-64 h-64 text-white" />
        </div>
        <div className="absolute left-1/3 bottom-1/3 opacity-20">
          <Fish className="w-64 h-64 text-white" />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-md rounded-full mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-blue-100">
                Tuyển chọn đặc biệt từ ZenKoi
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Gói Cá Koi Cao Cấp
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Tiết kiệm hơn, chất lượng đồng đều. Giải pháp hoàn hảo cho hồ cá
              của bạn.
            </p>

            {/* Search Bar Floating */}
            <div className="w-full max-w-xl mt-6 relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" />
                <Input
                  placeholder="Tìm kiếm theo tên, mã gói..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-14 h-14 rounded-full text-white shadow-lg border-0 bg-white/20 placeholder-white/70 focus:bg-white/30 focus:ring-0 focus:border-0 transition-all duration-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 lg:hidden">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        size="icon"
                        className="relative hover:bg-white/20 rounded-full h-10 w-10 bg-white/10 border border-white/30"
                      >
                        <Filter className="h-5 w-5 text-white" />
                        {getActiveFiltersCount() > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-[#0A3D62]">
                            {getActiveFiltersCount()}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-full sm:w-96 flex flex-col p-0 gap-0"
                    >
                      {/* Header with gradient */}
                      <div className="bg-linear-to-r from-[#0A3D62] to-[#082d47] text-white">
                        <SheetHeader>
                          <SheetTitle className="text-white text-xl font-bold">
                            Bộ lọc tìm kiếm
                          </SheetTitle>
                          <SheetDescription className="text-blue-100 text-sm">
                            Tùy chỉnh tiêu chí tìm kiếm gói cá
                          </SheetDescription>
                        </SheetHeader>
                        {getActiveFiltersCount() > 0 && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Badge
                              variant="secondary"
                              className="bg-white/20 text-white border-white/30"
                            >
                              {getActiveFiltersCount()} bộ lọc đang áp dụng
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Scrollable content */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                          {/* Size Range */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold text-base">
                                Kích thước (cm)
                              </Label>
                              {(filters.sizeRange[0] > 0 ||
                                filters.sizeRange[1] < 90) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-muted-foreground"
                                  onClick={() =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      sizeRange: [0, 90],
                                    }))
                                  }
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                            <div className="bg-muted/30 rounded-lg space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Từ
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={filters.sizeRange[0]}
                                    onChange={(e) =>
                                      handleSizeInputChange(0, e.target.value)
                                    }
                                  />
                                </div>
                                <span className="text-muted-foreground pt-6">
                                  -
                                </span>
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Đến
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={filters.sizeRange[1]}
                                    onChange={(e) =>
                                      handleSizeInputChange(1, e.target.value)
                                    }
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
                            </div>
                          </div>

                          {/* Age Range */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold text-base">
                                Tuổi (tháng)
                              </Label>
                              {(filters.ageRange[0] > 0 ||
                                filters.ageRange[1] < 60) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-muted-foreground"
                                  onClick={() =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      ageRange: [0, 60],
                                    }))
                                  }
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                            <div className="bg-muted/30 rounded-lg space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Từ
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={filters.ageRange[0]}
                                    onChange={(e) =>
                                      handleAgeInputChange(0, e.target.value)
                                    }
                                  />
                                </div>
                                <span className="text-muted-foreground pt-6">
                                  -
                                </span>
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Đến
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={filters.ageRange[1]}
                                    onChange={(e) =>
                                      handleAgeInputChange(1, e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <Slider
                                value={filters.ageRange}
                                max={60}
                                step={1}
                                onValueChange={(val) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    ageRange: val as [number, number],
                                  }))
                                }
                                className="py-2"
                              />
                            </div>
                          </div>

                          {/* Quantity Range */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold text-base">
                                Số lượng (con)
                              </Label>
                              {(filters.quantityRange[0] > 0 ||
                                filters.quantityRange[1] < 100) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-muted-foreground"
                                  onClick={() =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      quantityRange: [0, 100],
                                    }))
                                  }
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                            <div className="bg-muted/30 rounded-lg space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Từ
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={filters.quantityRange[0]}
                                    onChange={(e) =>
                                      handleQuantityInputChange(
                                        0,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <span className="text-muted-foreground pt-6">
                                  -
                                </span>
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Đến
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={filters.quantityRange[1]}
                                    onChange={(e) =>
                                      handleQuantityInputChange(
                                        1,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <Slider
                                value={filters.quantityRange}
                                max={100}
                                step={1}
                                onValueChange={(val) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    quantityRange: val as [number, number],
                                  }))
                                }
                                className="py-2"
                              />
                            </div>
                          </div>

                          {/* Price Range */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold text-base">
                                Khoảng giá
                              </Label>
                              {(filters.priceRange[0] > 0 ||
                                filters.priceRange[1] < 50000000) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-muted-foreground"
                                  onClick={() =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      priceRange: [0, 50000000],
                                    }))
                                  }
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                            <div className="bg-muted/30 rounded-lg space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Từ
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={formatCurrency(filters.priceRange[0])
                                      .replace("₫", "")
                                      .trim()}
                                    onChange={(e) =>
                                      handlePriceInputChange(0, e.target.value)
                                    }
                                  />
                                </div>
                                <span className="text-muted-foreground pt-6">
                                  -
                                </span>
                                <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Đến
                                  </Label>
                                  <Input
                                    className="h-9 text-sm"
                                    value={formatCurrency(filters.priceRange[1])
                                      .replace("₫", "")
                                      .trim()}
                                    onChange={(e) =>
                                      handlePriceInputChange(1, e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <Slider
                                value={filters.priceRange}
                                max={50000000}
                                step={100000}
                                onValueChange={(val) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    priceRange: val as [number, number],
                                  }))
                                }
                                className="py-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sticky footer with buttons */}
                      <div className="border-t bg-background p-4 space-y-2">
                        <Button
                          onClick={handleApplyFilters}
                          className="w-full h-11 bg-[#0A3D62] hover:bg-[#0A3D62]/90 font-semibold text-base"
                        >
                          Xem kết quả
                        </Button>
                        <Button
                          onClick={resetFilters}
                          variant="outline"
                          className="w-full h-11 text-sm"
                          disabled={!hasAnythingToReset()}
                        >
                          Đặt lại bộ lọc
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 items-start">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block w-80 shrink-0 sticky top-24">
            <FilterPanel {...filterPanelProps} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters & Results Count */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Danh sách sản phẩm
                </h2>
                {!isLoading && (
                  <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
                    {packetData?.totalItems ?? 0} kết quả
                  </span>
                )}
              </div>
              <ActiveFilters />
            </div>

            {/* Grid Content */}
            {isLoading ? (
              <PacketFishGridSkeleton />
            ) : packetData?.data.length === 0 ? (
              // Empty State UI
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <FishOff className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy gói cá nào
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn. Chúng tôi
                  liên tục cập nhật các gói cá mới mỗi ngày.
                </p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Xóa bộ lọc & Tìm lại
                </Button>
              </div>
            ) : (
              // Results Grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {packetData?.data.map((packet) => (
                  <PacketFishCard
                    key={packet.id}
                    packet={packet}
                    onAddToCart={handleAddToCart}
                    isAddPending={isCreated}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {packetData && packetData.data.length > 0 && (
              <div className="mt-10 flex justify-center">
                <PaginationWithLinks
                  totalCount={packetData.totalItems}
                  pageSize={pageSize}
                  page={currentPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
