"use client";

import { useState, useMemo, Suspense } from "react";
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

import { Search, X, FishOff, Fish, Filter } from "lucide-react";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import {
  KoiFishSearchParams,
  SaleStatus,
  Gender,
} from "@/lib/api/services/fetchKoiFish";
import { useAddItemToCart } from "@/hooks/useCart";
import { PaginationWithLinks } from "@/components/pagination";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { KoiFishCard } from "./components/KoiFishCard";
import {
  KoiFilterPanel,
  initialFilterState,
} from "./components/KoiFilterPanel";
import { KoiGridSkeleton } from "./components/KoiSkeleton";

const PAGE_SIZE_OPTIONS = [9, 12, 24];

function CatalogContent() {
  // 1. Initialize state without URL dependency
  const [filters, setFilters] = useState(initialFilterState);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const [addingId, setAddingId] = useState<number | null>(null);
  const { mutate: addToCard } = useAddItemToCart();

  // 2. Handle filter application - now just updates applied filters
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
    // Filters are already updated in real-time, no need for separate applied state
  };

  // 3. Reset all filters to initial state
  const resetFilters = () => {
    setSearchTerm("");
    setFilters(initialFilterState);
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // 5. Create API params from filter state
  const apiParams = useMemo((): KoiFishSearchParams => {
    const params: KoiFishSearchParams = {
      pageIndex: currentPage,
      pageSize: pageSize,
      saleStatus: SaleStatus.AVAILABLE,
    };

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filters.selectedGender !== "Tất cả")
      params.gender = filters.selectedGender as Gender;
    if (filters.selectedVariety !== "Tất cả")
      params.varietyId = Number(filters.selectedVariety);
    if (filters.selectedOrigin !== "Tất cả")
      params.origin = filters.selectedOrigin;

    if (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 90) {
      params.minSize = filters.sizeRange[0];
      params.maxSize = filters.sizeRange[1];
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) {
      params.minPrice = filters.priceRange[0];
      params.maxPrice = filters.priceRange[1];
    }

    return params;
  }, [filters, debouncedSearchTerm, currentPage, pageSize]);

  // Fetch Data
  const { data: koiData, isLoading } = useGetKoiFishes(apiParams);

  // Handlers
  const handleAddToCart = (koiFishId: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAddingId(koiFishId);
    addToCard(
      { koiFishId, quantity: 1 },
      {
        onSuccess: () => setAddingId(null),
        onError: () => setAddingId(null),
      },
    );
  };

  // Check xem có gì để reset không (So sánh state UI với initial)
  const hasAnythingToReset = () => {
    return (
      searchTerm !== "" ||
      JSON.stringify(filters) !== JSON.stringify(initialFilterState)
    );
  };

  // Remove individual filter
  const removeFilter = (key: string) => {
    switch (key) {
      case "gender":
        setFilters((prev) => ({ ...prev, selectedGender: "Tất cả" }));
        break;
      case "variety":
        setFilters((prev) => ({ ...prev, selectedVariety: "Tất cả" }));
        break;
      case "size":
        setFilters((prev) => ({ ...prev, sizeRange: [0, 90] }));
        break;
      case "price":
        setFilters((prev) => ({ ...prev, priceRange: [0, 100000000] }));
        break;
    }
    setCurrentPage(1); // Reset to first page when removing filter
  };

  // Active Filters Bar (Display based on current filter state)
  const ActiveFiltersBar = () => {
    const chips = [];
    if (filters.selectedGender !== "Tất cả")
      chips.push({
        label: `Giới tính: ${filters.selectedGender === Gender.MALE ? "Đực" : "Cái"}`,
        key: "gender",
      });
    if (filters.selectedVariety !== "Tất cả")
      chips.push({
        label: `Giống: ${filters.selectedVariety}`,
        key: "variety",
      });
    if (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 90) {
      chips.push({
        label: `Size: ${filters.sizeRange[0]}-${filters.sizeRange[1]}cm`,
        key: "size",
      });
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) {
      chips.push({
        label: `Giá: ${formatCurrency(filters.priceRange[0])} - ${formatCurrency(filters.priceRange[1])}`,
        key: "price",
      });
    }

    if (chips.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
        {chips.map((chip) => (
          <Badge
            key={chip.key}
            variant="secondary"
            className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-default"
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
          className="h-auto p-0 ml-2 text-muted-foreground"
        >
          Xóa tất cả
        </Button>
      </div>
    );
  };

  const filterPanelProps = {
    filters,
    setFilters,
    handleApplyFilters, // Bây giờ hàm này sẽ push URL
    resetFilters, // Hàm này sẽ push pathname
    hasAnythingToReset,
  };

  return (
    <>
      {/* Header... (Giữ nguyên code cũ) */}
      <div className="relative bg-[#0A3D62] py-12 text-white mb-8">
        {/* ... nội dung header ... */}
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
        <div className="container mx-auto px-4 text-center space-y-12 relative z-10">
          <h1 className="text-4xl font-bold">Danh Mục Cá Koi</h1>
          <div className="max-w-lg mx-auto relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white group-focus-within:text-white transition-colors" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-12 h-14 rounded-full text-white shadow-lg border-0 bg-white/20 placeholder-white/70 focus:bg-white/30 focus:ring-0 focus:border-0 transition-all duration-200"
            />
            {/* Mobile Filter Button */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-white/20 rounded-full h-10 w-10"
                  >
                    <Filter className="h-5 w-5 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                    <SheetDescription>
                      Tùy chỉnh tiêu chí để tìm cá phù hợp
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto mt-6">
                    <KoiFilterPanel {...filterPanelProps} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex gap-8 items-start">
          <div className="hidden lg:block w-72 shrink-0 sticky top-24">
            <KoiFilterPanel {...filterPanelProps} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-gray-800">
                Kết quả tìm kiếm
              </h2>
              {!isLoading && (
                <span className="text-sm text-muted-foreground">
                  {koiData?.totalItems || 0} chú cá
                </span>
              )}
            </div>

            {/* Hiển thị các filter đang active dựa trên URL */}
            <ActiveFiltersBar />

            {isLoading ? (
              <KoiGridSkeleton />
            ) : koiData?.data.length === 0 ? (
              // Empty State
              <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FishOff className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Không tìm thấy cá phù hợp
                </h3>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="mt-4"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {koiData?.data.map((koi) => (
                  <KoiFishCard
                    key={koi.id}
                    koi={koi}
                    onAddToCart={handleAddToCart}
                    addingId={addingId}
                  />
                ))}
              </div>
            )}

            {koiData && koiData.data.length > 0 && (
              <div className="mt-8 flex justify-center">
                <PaginationWithLinks
                  totalCount={koiData.totalItems}
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
    </>
  );
}

// Export Default bọc Suspense
export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <KoiGridSkeleton />
          </div>
        }
      >
        <CatalogContent />
      </Suspense>
    </div>
  );
}
