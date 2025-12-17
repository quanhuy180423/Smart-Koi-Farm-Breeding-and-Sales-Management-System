"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Search, FishOff, Filter, RotateCcw } from "lucide-react";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import {
  KoiFishSearchParams,
  SaleStatus,
  Gender,
} from "@/lib/api/services/fetchKoiFish";
import { useAddItemToCart, useGetCart } from "@/hooks/useCart";
import { PaginationWithLinks } from "@/components/pagination";
import { KoiFishCard } from "./components/KoiFishCard";
import {
  KoiFilterPanel,
  initialFilterState,
} from "./components/KoiFilterPanel";
import { KoiGridSkeleton } from "./components/KoiSkeleton";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetVarieties } from "@/hooks/useVariety";
import { VarietyResponse } from "@/lib/api/services/fetchVariety";

const PAGE_SIZE_OPTIONS = [9, 12, 24];

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(appliedSearchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [addingId, setAddingId] = useState<number | null>(null);
  const { mutate: addToCard } = useAddItemToCart();
  const { data: cart } = useGetCart();

  // Sync varietyId from URL to filter state
  useEffect(() => {
    const varietyIdParam = searchParams.get("varietyId");
    if (varietyIdParam) {
      setFilters((prev) => ({ ...prev, selectedVariety: varietyIdParam }));
      setAppliedFilters((prev) => ({
        ...prev,
        selectedVariety: varietyIdParam,
      }));
    } else {
      setFilters((prev) => ({ ...prev, selectedVariety: "Tất cả" }));
      setAppliedFilters((prev) => ({ ...prev, selectedVariety: "Tất cả" }));
    }
  }, [searchParams]);

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

  const VarietyFilterSelect = ({
    selectedVariety,
    onVarietyChange,
  }: {
    selectedVariety: string;
    onVarietyChange: (value: string) => void;
  }) => {
    const { data: varietiesData, isLoading } = useGetVarieties({
      pageIndex: 1,
      pageSize: 100,
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
            <SelectItem key={variety.id} value={variety.id.toString()}>
              {variety.varietyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const isInCart = (koiFishId: number) => {
    return (
      cart?.cartItems?.some((item) => item.koiFishId === koiFishId) || false
    );
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
    setIsSheetOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setAppliedSearchTerm("");
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setCurrentPage(1);

    // Clear varietyId from URL
    router.push("/catalog", { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const apiParams = useMemo((): KoiFishSearchParams => {
    const params: KoiFishSearchParams = {
      pageIndex: currentPage,
      pageSize: pageSize,
      saleStatus: SaleStatus.AVAILABLE,
    };

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (appliedFilters.selectedGender !== "Tất cả")
      params.gender = appliedFilters.selectedGender as Gender;
    if (appliedFilters.selectedVariety !== "Tất cả")
      params.varietyId = Number(appliedFilters.selectedVariety);
    if (appliedFilters.selectedOrigin !== "Tất cả")
      params.origin = appliedFilters.selectedOrigin;

    if (appliedFilters.sizeRange[0] > 0 || appliedFilters.sizeRange[1] < 90) {
      params.minSize = appliedFilters.sizeRange[0];
      params.maxSize = appliedFilters.sizeRange[1];
    }

    if (
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 100000000
    ) {
      params.minPrice = appliedFilters.priceRange[0];
      params.maxPrice = appliedFilters.priceRange[1];
    }

    return params;
  }, [appliedFilters, debouncedSearchTerm, currentPage, pageSize]);

  const { data: koiData, isLoading } = useGetKoiFishes(apiParams);

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

  const hasAnythingToReset = () => {
    return (
      searchTerm !== "" ||
      JSON.stringify(filters) !== JSON.stringify(initialFilterState)
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.selectedGender !== "Tất cả") count++;
    if (filters.selectedVariety !== "Tất cả") count++;
    if (filters.selectedOrigin !== "Tất cả") count++;
    if (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 90) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) count++;
    return count;
  };

  const filterPanelProps = {
    filters,
    setFilters,
    handleApplyFilters,
    resetFilters,
    hasAnythingToReset,
  };

  return (
    <>
      {/* Header */}
      <div className="relative bg-linear-to-br from-[#0A3D62] via-[#0A3D62] to-[#082d47] py-12 text-white mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 text-center space-y-12 relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Danh Mục Cá Koi
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto">
              Khám phá bộ sưu tập cá Koi Nhật Bản chất lượng cao
            </p>
          </div>

          <div className="max-w-lg mx-auto relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors" />
            <Input
              placeholder="Tìm kiếm theo tên, giống, RFID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyFilters();
                }
              }}
              className="pl-11 pr-14 h-14 rounded-full text-white shadow-lg border-0 bg-white/20 placeholder-white/70 focus:bg-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-200"
            />

            {/* Mobile Filter Button */}
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
                    <SheetHeader className="py-2">
                      <SheetTitle className="text-white text-xl font-bold">
                        Bộ lọc tìm kiếm
                      </SheetTitle>
                      <SheetDescription className="text-blue-100 text-sm">
                        Tùy chỉnh tiêu chí tìm kiếm của bạn
                      </SheetDescription>
                    </SheetHeader>

                    {/* Active filters count */}
                    {getActiveFiltersCount() > 0 && (
                      <div className="mt-4 flex items-center gap-2 text-sm">
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
                      {/* Variety */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-base">
                            Giống cá
                          </Label>
                          {filters.selectedVariety !== "Tất cả" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-muted-foreground"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  selectedVariety: "Tất cả",
                                }))
                              }
                            >
                              Xóa
                            </Button>
                          )}
                        </div>
                        <VarietyFilterSelect
                          selectedVariety={filters.selectedVariety}
                          onVarietyChange={(val) =>
                            setFilters((prev) => ({
                              ...prev,
                              selectedVariety: val,
                            }))
                          }
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-base">
                            Giới tính
                          </Label>
                          {filters.selectedGender !== "Tất cả" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-muted-foreground"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  selectedGender: "Tất cả",
                                }))
                              }
                            >
                              Xóa
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {["Tất cả", Gender.MALE, Gender.FEMALE].map((g) => (
                            <Button
                              key={g}
                              type="button"
                              variant={
                                filters.selectedGender === g
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  selectedGender: g,
                                }))
                              }
                              className={`text-sm ${filters.selectedGender === g ? "bg-[#0A3D62] hover:bg-[#0A3D62]/90" : ""}`}
                            >
                              {g === "Tất cả"
                                ? "Tất cả"
                                : g === Gender.MALE
                                  ? "Đực"
                                  : "Cái"}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold text-base">
                            Khoảng giá
                          </Label>
                          {(filters.priceRange[0] > 0 ||
                            filters.priceRange[1] < 100000000) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-muted-foreground"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  priceRange: [0, 100000000],
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
                        </div>
                      </div>

                      {/* Size */}
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
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Đặt lại bộ lọc
                    </Button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800">
                Kết quả tìm kiếm
              </h2>
              {!isLoading && (
                <span className="text-sm text-muted-foreground">
                  {koiData?.totalItems || 0} chú cá
                </span>
              )}
            </div>

            {isLoading ? (
              <KoiGridSkeleton />
            ) : koiData?.data.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FishOff className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Không tìm thấy cá phù hợp
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Thử điều chỉnh bộ lọc hoặc tìm kiếm khác
                </p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="mt-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
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
                    isInCart={isInCart(koi.id)}
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
