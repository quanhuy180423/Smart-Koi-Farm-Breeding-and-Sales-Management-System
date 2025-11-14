"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  ShoppingCart,
  Eye,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetPacketFishes } from "@/hooks/usePacketFish";
import { PacketFishSearchParams } from "@/lib/api/services/fetchPacketFish";
import { FishSize } from "@/lib/api/services/fetchKoiFish";
import { getFishSizeLabel } from "@/lib/utils/enum";
import { PaginationSection } from "@/components/common/PaginationSection";
import { Slider } from "@/components/ui/slider";
import { useAddItemToCart } from "@/hooks/useCart";

const PAGE_SIZE_OPTIONS = [9, 12, 24];

const initialFilterState = {
  selectedSize: "Tất cả" as string,
  ageRange: [0, 60] as [number, number],
  quantityRange: [0, 100] as [number, number],
};

interface FilterPanelProps {
  filters: typeof initialFilterState;
  setFilters: React.Dispatch<React.SetStateAction<typeof initialFilterState>>;
  handleApplyFilters: () => void;
  resetFilters: () => void;
  hasAnythingToReset: () => boolean;
}

const FilterPanel = ({
  filters,
  setFilters,
  handleApplyFilters,
  resetFilters,
  hasAnythingToReset,
}: FilterPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Kích thước */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Kích thước
        </h3>
        <Select
          value={filters.selectedSize}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, selectedSize: value }))
          }
        >
          <SelectTrigger className="w-full h-11 border-2 border-[#0A3D62]/20 hover:border-[#0A3D62]/40 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/20 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <span className="flex items-center gap-2">
              {filters.selectedSize === "Tất cả"
                ? "Chọn kích thước..."
                : getFishSizeLabel(filters.selectedSize)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tất cả">Tất cả</SelectItem>
            {Object.values(FishSize).map((s) => (
              <SelectItem key={s} value={s}>
                {getFishSizeLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Khoảng tuổi */}
      <div className="space-y-4">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Tuổi (tháng)
        </h3>
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-md">
              {filters.ageRange[0]}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-md">
              {filters.ageRange[1]}
            </span>
          </div>
          <Slider
            value={filters.ageRange}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                ageRange: value as [number, number],
              }))
            }
            max={60}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Khoảng số lượng */}
      <div className="space-y-4">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Số lượng
        </h3>
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-md">
              {filters.quantityRange[0]}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-md">
              {filters.quantityRange[1]}
            </span>
          </div>
          <Slider
            value={filters.quantityRange}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                quantityRange: value as [number, number],
              }))
            }
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Cụm nút hành động */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={handleApplyFilters}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-base font-semibold"
        >
          Áp dụng bộ lọc
        </Button>
        <Button
          onClick={resetFilters}
          variant="outline"
          disabled={!hasAnythingToReset()}
          className={`w-full h-11 border-2 font-medium transition-all duration-200 rounded-xl ${
            hasAnythingToReset()
              ? "border-[#0A3D62] bg-[#0A3D62]/10 text-[#0A3D62] hover:bg-[#0A3D62]/20 hover:border-[#0A3D62]"
              : "border-[#0A3D62]/20 text-[#0A3D62]/50 cursor-not-allowed"
          }`}
        >
          <RotateCcw
            className={`h-4 w-4 mr-2 ${hasAnythingToReset() ? "" : "opacity-50"}`}
          />
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default function PacketFishPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const { mutate: addToCart, isPending: isAddPending } = useAddItemToCart();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterParams = useMemo((): PacketFishSearchParams => {
    const params: PacketFishSearchParams = {
      pageIndex: currentPage,
      pageSize: pageSize,
      isAvailable: true,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (appliedFilters.selectedSize !== "Tất cả") {
      params.size = appliedFilters.selectedSize as FishSize;
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

    return params;
  }, [appliedFilters, debouncedSearchTerm, currentPage, pageSize]);

  const { data: packetData, isLoading } = useGetPacketFishes(filterParams);

  const handleAddToCart = (packetFishId: number) => {
    addToCart({ packetFishId, quantity: 1 });
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

  const hasAnythingToReset = () => {
    return (
      searchTerm !== "" ||
      JSON.stringify(filters) !== JSON.stringify(initialFilterState)
    );
  };

  const filterPanelProps = {
    filters,
    setFilters,
    handleApplyFilters,
    resetFilters,
    hasAnythingToReset,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary/8 via-background to-primary/5 border-b border-primary/20">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle_at_25%_25%,_#0A3D62_1px,_transparent_1px),_radial-gradient(circle_at_75%_75%,_#0A3D62_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col gap-6">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-[#1E5A8B] to-primary bg-clip-text text-transparent leading-tight">
                Gói Cá Koi
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Khám phá các gói cá Koi được lựa chọn kỹ lưỡng từ trại cá ZenKoi
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70 h-5 w-5 z-10 pointer-events-none" />
                <Input
                  placeholder="Tìm kiếm theo tên gói cá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base rounded-2xl border-2 border-primary/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm bg-white/90 backdrop-blur-sm relative z-0"
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="sm:hidden h-12 rounded-2xl border-2 text-lg font-semibold border-primary/20 hover:border-primary/40 hover:bg-primary/5 bg-white/50 backdrop-blur-sm shadow-sm text-primary transition-all duration-200"
                  >
                    <Filter className="h-5 w-5" />
                    Bộ lọc
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 rounded-r-2xl">
                  <SheetHeader>
                    <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                    <SheetDescription>
                      Tùy chỉnh tiêu chí để tìm gói cá phù hợp
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-4">
                    <FilterPanel {...filterPanelProps} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-0 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-80 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Filter className="h-5 w-5" />
                  Bộ lọc tìm kiếm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel {...filterPanelProps} />
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="w-full flex items-center justify-center text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="flex-1">
              {(debouncedSearchTerm ||
                JSON.stringify(appliedFilters) !==
                  JSON.stringify(initialFilterState)) && (
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Tìm thấy {packetData?.totalItems ?? 0} kết quả.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {packetData?.data.map((packet) => {
                  return (
                    <Card
                      key={packet.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow pt-0 flex flex-col"
                    >
                      <div className="relative">
                        <Image
                          src={packet.images[0] || "/placeholder.svg"}
                          alt={packet.name}
                          className="w-full h-48 object-cover"
                          width={400}
                          height={300}
                          unoptimized
                        />
                      </div>

                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {packet.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Số lượng: {packet.fishPerPacket}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-col flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Kích thước:
                            </span>
                            <span className="ml-1 font-medium">
                              {getFishSizeLabel(packet.size)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tuổi:</span>
                            <span className="ml-1 font-medium">
                              {packet.ageMonths} tháng
                            </span>
                          </div>
                        </div>

                        {packet.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {packet.description}
                          </p>
                        )}

                        <div className="mt-auto">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(packet.pricePerPacket || 0)}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90 text-white border-0"
                          disabled={isAddPending}
                          onClick={() => handleAddToCart(packet.id)}
                        >
                          {isAddPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 mr-2" />
                          )}
                          {isAddPending ? "Đang thêm..." : "Thêm vào giỏ"}
                        </Button>
                        <Link href={`/packet-fish/${packet.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-primary text-primary hover:bg-primary hover:border-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {packetData?.data.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy gói cá nào phù hợp với tiêu chí tìm kiếm
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-primary/30 text-primary hover:bg-primary hover:border-primary bg-white/50 backdrop-blur-sm"
                    onClick={resetFilters}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}

              {packetData && packetData.data.length > 0 && (
                <div className="mt-8">
                  <PaginationSection
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={packetData.totalItems}
                    postsPerPage={pageSize}
                    setPageSize={setPageSize}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    hasNextPage={packetData.hasNextPage}
                    hasPreviousPage={packetData.hasPreviousPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
