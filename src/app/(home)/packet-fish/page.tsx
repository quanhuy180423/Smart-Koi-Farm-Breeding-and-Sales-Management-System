"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PacketFishGridSkeleton } from "./components/PacketFishSkeleton"; // Import Skeleton mới
import formatCurrency from "@/lib/utils/numbers";

const PAGE_SIZE_OPTIONS = [9, 12, 24];

export default function PacketFishPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // ... (Giữ nguyên logic state filters)
  const [filters, setFilters] = useState(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);
  const [isCreated, setIsCreated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const { mutate: addToCart } = useAddItemToCart();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterParams = useMemo((): PacketFishSearchParams => {
    // ... (Giữ nguyên logic mapping params)
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

  // ... (Handlers cũ)
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
                  className="pl-11 h-14 rounded-full text-white shadow-lg border-0 bg-white/20 placeholder-white/70 focus:bg-white/30 focus:ring-0 focus:border-0 transition-all duration-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-gray-100 rounded-full"
                      >
                        <Filter className="h-5 w-5 text-gray-500" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                        <SheetDescription>
                          Tùy chỉnh tiêu chí để tìm gói cá phù hợp
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel {...filterPanelProps} />
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
