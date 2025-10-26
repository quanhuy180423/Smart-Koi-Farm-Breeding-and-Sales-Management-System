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
import {
  Search,
  Filter,
  Heart,
  ShoppingCart,
  Eye,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import formatCurrency from "@/lib/utils/numbers";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import {
  FishSize,
  Gender,
  KoiFishSearchParams,
} from "@/lib/api/services/fetchKoiFish";
import getAge from "@/lib/utils/dates/age";
import getFishSizeLabel, { getGenderString } from "@/lib/utils/enum";
import { Label } from "@/components/ui/label";
import { PaginationSection } from "@/components/common/PaginationSection";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("Tất cả");
  const [selectedOrigin, setSelectedOrigin] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [selectedGender, setSelectedGender] = useState<string>("Tất cả");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [selectedSize, setSelectedSize] = useState("Tất cả");
  const [showCertified, setShowCertified] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const { addItem } = useCartStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterParams = useMemo((): KoiFishSearchParams => {
    const params: KoiFishSearchParams = {
      pageIndex: currentPage,
      pageSize: pageSize,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (selectedGender !== "Tất cả") {
      params.gender = selectedGender as Gender;
    }

    if (selectedSize !== "Tất cả") {
      params.fishSize = selectedSize as FishSize;
    }

    if (minPriceInput) {
      params.minPrice = Number(minPriceInput);
    }

    if (maxPriceInput) {
      params.maxPrice = Number(maxPriceInput);
    }

    if (selectedOrigin !== "Tất cả") {
      params.origin = selectedOrigin;
    }

    return params;
  }, [
    currentPage,
    pageSize,
    debouncedSearchTerm,
    selectedGender,
    selectedSize,
    minPriceInput,
    maxPriceInput,
    selectedOrigin,
  ]);

  const { data: koiData } = useGetKoiFishes(filterParams);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedVariety("Tất cả");
    setSelectedOrigin("Tất cả");
    setSelectedStatus("Tất cả");
    setSelectedGender("Tất cả");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSelectedSize("Tất cả");
    setShowCertified(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      selectedVariety !== "Tất cả" ||
      selectedOrigin !== "Tất cả" ||
      selectedStatus !== "Tất cả" ||
      selectedGender !== "Tất cả" ||
      minPriceInput !== "" ||
      maxPriceInput !== "" ||
      selectedSize !== "Tất cả" ||
      showCertified
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* <div className="space-y-3">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Giống cá
        </h3>
        <Select value={selectedVariety} onValueChange={setSelectedVariety}>
          <SelectTrigger className="w-full h-11 border-2 border-[#0A3D62]/20 hover:border-[#0A3D62]/40 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/20 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <SelectValue placeholder="Chọn giống cá..." />
          </SelectTrigger>
          <SelectContent>
            {varieties.map((variety) => (
              <SelectItem key={variety} value={variety}>
                {variety}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* <div className="space-y-3">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Xuất xứ
        </h3>
        <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
          <SelectTrigger className="w-full h-11 border-2 border-[#0A3D62]/20 hover:border-[#0A3D62]/40 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/20 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <SelectValue placeholder="Chọn xuất xứ..." />
          </SelectTrigger>
          <SelectContent>
            {origins.map((origin) => (
              <SelectItem key={origin} value={origin}>
                {origin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* <div className="space-y-3">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Trạng thái
        </h3>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full h-11 border-2 border-[#0A3D62]/20 hover:border-[#0A3D62]/40 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/20 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <SelectValue placeholder="Chọn trạng thái..." />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="space-y-3">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Giới tính
        </h3>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger className="w-full h-11 border-2 border-[#0A3D62]/20 hover:border-[#0A3D62]/40 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/20 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <SelectValue placeholder="Chọn giới tính..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tất cả">Tất cả</SelectItem>
            <SelectItem value={Gender.MALE}>Đực</SelectItem>
            <SelectItem value={Gender.FEMALE}>Cái</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Khoảng giá (VNĐ)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label
              htmlFor="minPriceInput"
              className="text-xs text-muted-foreground"
            >
              Tối thiểu
            </Label>
            <Input
              id="minPriceInput"
              type="number"
              placeholder="Nhập giá tối thiểu..."
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="h-10 border-2 border-[#0A3D62]/20 focus:border-[#0A3D62] rounded-xl"
            />
          </div>
          <div>
            <Label
              htmlFor="maxPriceInput"
              className="text-xs text-muted-foreground"
            >
              Tối đa
            </Label>
            <Input
              id="maxPriceInput"
              type="number"
              placeholder="Nhập giá tối đa..."
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="h-10 border-2 border-[#0A3D62]/20 focus:border-[#0A3D62] rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Kích thước
        </h3>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full h-11 border-2 border-[#0A3D62]/20 hover:border-[#0A3D62]/40 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/20 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl">
            <SelectValue placeholder="Chọn giới tính..." />
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

      {/* <div className="p-4 bg-gradient-to-r from-[#0A3D62]/5 to-transparent rounded-xl border border-[#0A3D62]/10">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="certified"
            checked={showCertified}
            onCheckedChange={(checked) => setShowCertified(checked === true)}
            className="border-2 border-[#0A3D62]/30 data-[state=checked]:bg-[#0A3D62] data-[state=checked]:border-[#0A3D62] w-5 h-5"
          />
          <label
            htmlFor="certified"
            className="text-sm font-medium text-[#0A3D62] cursor-pointer select-none"
          >
            Chỉ hiển thị cá có chứng nhận
          </label>
        </div>
      </div> */}

      <Button
        onClick={resetFilters}
        variant="outline"
        disabled={!hasActiveFilters()}
        className={`w-full h-11 border-2 font-medium transition-all duration-200 rounded-xl ${
          hasActiveFilters()
            ? "border-[#0A3D62] bg-[#0A3D62]/10 text-[#0A3D62] hover:bg-[#0A3D62]/20 hover:border-[#0A3D62]"
            : "border-[#0A3D62]/20 text-[#0A3D62]/50 cursor-not-allowed"
        }`}
      >
        <RotateCcw
          className={`h-4 w-4 mr-2 ${hasActiveFilters() ? "" : "opacity-50"}`}
        />
        Đặt lại bộ lọc
      </Button>
    </div>
  );

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
                Danh Mục Cá Koi
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Khám phá bộ sưu tập cá Koi chất lượng cao từ trại cá ZenKoi uy
                tín
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70 h-5 w-5 z-10 pointer-events-none" />
                <Input
                  placeholder="Tìm kiếm theo tên, giống, hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base rounded-2xl border-2 border-primary/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm bg-white/90 backdrop-blur-sm relative z-0"
                />
              </div>
              {/* <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full min-w-3xs sm:w-[220px] h-12! rounded-2xl border-2 border-primary/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm bg-white/90 backdrop-blur-sm text-base">
                  <SelectValue placeholder="Sắp xếp theo..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl py-1">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

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
                      Tùy chỉnh tiêu chí để tìm cá Koi phù hợp
                    </SheetDescription>
                  </SheetHeader>
                  <div className="px-3 pb-3 overflow-auto">
                    <FilterPanel />
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
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {(searchTerm ||
              selectedVariety !== "Tất cả" ||
              selectedOrigin !== "Tất cả" ||
              selectedStatus !== "Tất cả" ||
              selectedGender !== "Tất cả" ||
              minPriceInput !== "" ||
              maxPriceInput !== "" ||
              selectedSize !== "Tất cả" ||
              showCertified) && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Tìm thấy {koiData?.data.length} kết quả
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {koiData?.data.map((koi) => (
                <Card
                  key={koi.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow pt-0 flex flex-col"
                >
                  <div className="relative">
                    <Image
                      src={koi.images[0] || "/placeholder.svg"}
                      alt={koi.rfid}
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
                          RFID: {koi.rfid}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {koi.variety.varietyName}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Kích thước:
                        </span>
                        <span className="ml-1 font-medium">
                          {getFishSizeLabel(koi.size)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tuổi:</span>
                        <span className="ml-1 font-medium">
                          {getAge(koi.birthDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Giới tính:
                        </span>
                        <span className="ml-1 font-medium">
                          {getGenderString(koi.gender)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Xuất xứ:</span>
                        <span className="ml-1 font-medium">{koi.origin}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(koi.sellingPrice || 0)}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-white border-0"
                      onClick={() =>
                        addItem({
                          id: koi.id.toString(),
                          name: koi.rfid,
                          variety: koi.variety.varietyName,
                          price: koi.sellingPrice || 0,
                          size: getFishSizeLabel(koi.size),
                          age: getAge(koi.birthDate).toString(),
                          image: koi.images[0],
                        })
                      }
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm vào giỏ
                    </Button>
                    <Link href={`/koi/${koi.id}`}>
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
              ))}
            </div>

            {koiData?.data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Không tìm thấy cá Koi nào phù hợp với tiêu chí tìm kiếm
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

            {koiData && koiData.data.length > 0 && (
              <div className="mt-8">
                <PaginationSection
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={koiData.totalItems}
                  postsPerPage={pageSize}
                  setPageSize={setPageSize}
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  hasNextPage={koiData.hasNextPage}
                  hasPreviousPage={koiData.hasPreviousPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
