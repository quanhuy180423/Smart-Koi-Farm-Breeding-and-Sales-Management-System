"use client";

import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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

// Mock data for Koi fish
const koiData = [
  {
    id: 1,
    name: "Kohaku Premium",
    variety: "Kohaku",
    size: "35cm",
    age: "2 năm",
    price: 15000000,
    origin: "Nhật Bản",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Có sẵn",
    description: "Kohaku chất lượng cao với màu đỏ rực rỡ và trắng tinh khiết",
    gender: "Cái",
    bloodline: "Sakai",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe"],
  },
  {
    id: 2,
    name: "Sanke Jumbo",
    variety: "Sanke",
    size: "45cm",
    age: "3 năm",
    price: 25000000,
    origin: "Nhật Bản",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Có sẵn",
    description: "Sanke jumbo size với pattern hoàn hảo",
    gender: "Đực",
    bloodline: "Dainichi",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe", "Giải thưởng"],
  },
  {
    id: 3,
    name: "Showa Champion",
    variety: "Showa",
    size: "40cm",
    age: "2.5 năm",
    price: 20000000,
    origin: "Nhật Bản",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Hết hàng",
    description: "Showa với pattern độc đáo và màu sắc nổi bật",
    gender: "Cái",
    bloodline: "Omosako",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe"],
  },
  {
    id: 4,
    name: "Tancho Goshiki",
    variety: "Tancho",
    size: "30cm",
    age: "1.5 năm",
    price: 12000000,
    origin: "Việt Nam",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Có sẵn",
    description: "Tancho với điểm đỏ hoàn hảo trên đầu",
    gender: "Đực",
    bloodline: "Local Breed",
    certificates: ["Kiểm tra sức khỏe"],
  },
  {
    id: 5,
    name: "Ogon Platinum",
    variety: "Ogon",
    size: "38cm",
    age: "2 năm",
    price: 8000000,
    origin: "Việt Nam",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Hết hàng",
    description: "Ogon bạch kim với ánh kim loại đẹp",
    gender: "Cái",
    bloodline: "Local Breed",
    certificates: ["Kiểm tra sức khỏe"],
  },
  {
    id: 6,
    name: "Asagi Classic",
    variety: "Asagi",
    size: "42cm",
    age: "3 năm",
    price: 18000000,
    origin: "Nhật Bản",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    status: "Có sẵn",
    description: "Asagi cổ điển với vảy xanh đều và bụng cam",
    gender: "Đực",
    bloodline: "Marudo",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe"],
  },
];

const varieties = [
  "Tất cả",
  "Kohaku",
  "Sanke",
  "Showa",
  "Tancho",
  "Ogon",
  "Asagi",
];
const origins = ["Tất cả", "Nhật Bản", "Việt Nam"];
const statuses = ["Tất cả", "Có sẵn", "Hết hàng"];
const genders = ["Tất cả", "Đực", "Cái"];
const sortOptions = [
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "size-asc", label: "Kích thước: Nhỏ đến Lớn" },
  { value: "size-desc", label: "Kích thước: Lớn đến Nhỏ" },
  { value: "age-asc", label: "Tuổi: Trẻ đến Già" },
  { value: "age-desc", label: "Tuổi: Già đến Trẻ" },
];

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("Tất cả");
  const [selectedOrigin, setSelectedOrigin] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [selectedGender, setSelectedGender] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState([0, 30000000]);
  const [sizeRange, setSizeRange] = useState([20, 50]);
  const [sortBy, setSortBy] = useState("price-asc");
  const [showCertified, setShowCertified] = useState(false);
  const { addItem } = useCartStore();

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedVariety("Tất cả");
    setSelectedOrigin("Tất cả");
    setSelectedStatus("Tất cả");
    setSelectedGender("Tất cả");
    setPriceRange([0, 30000000]);
    setSizeRange([20, 50]);
    setShowCertified(false);
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      selectedVariety !== "Tất cả" ||
      selectedOrigin !== "Tất cả" ||
      selectedStatus !== "Tất cả" ||
      selectedGender !== "Tất cả" ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 30000000 ||
      sizeRange[0] !== 20 ||
      sizeRange[1] !== 50 ||
      showCertified
    );
  };

  const filteredAndSortedKoi = useMemo(() => {
    const filtered = koiData.filter((koi) => {
      const matchesSearch =
        koi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        koi.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        koi.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVariety =
        selectedVariety === "Tất cả" || koi.variety === selectedVariety;
      const matchesOrigin =
        selectedOrigin === "Tất cả" || koi.origin === selectedOrigin;
      const matchesStatus =
        selectedStatus === "Tất cả" || koi.status === selectedStatus;
      const matchesGender =
        selectedGender === "Tất cả" || koi.gender === selectedGender;
      const matchesPrice =
        koi.price >= priceRange[0] && koi.price <= priceRange[1];
      const koiSize = Number.parseInt(koi.size.replace("cm", ""));
      const matchesSize = koiSize >= sizeRange[0] && koiSize <= sizeRange[1];
      const matchesCertified =
        !showCertified || koi.certificates.includes("Chứng nhận nguồn gốc");

      return (
        matchesSearch &&
        matchesVariety &&
        matchesOrigin &&
        matchesStatus &&
        matchesGender &&
        matchesPrice &&
        matchesSize &&
        matchesCertified
      );
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "size-asc":
          return Number.parseInt(a.size) - Number.parseInt(b.size);
        case "size-desc":
          return Number.parseInt(b.size) - Number.parseInt(a.size);
        case "age-asc":
          return Number.parseFloat(a.age) - Number.parseFloat(b.age);
        case "age-desc":
          return Number.parseFloat(b.age) - Number.parseFloat(a.age);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchTerm,
    selectedVariety,
    selectedOrigin,
    selectedStatus,
    selectedGender,
    priceRange,
    sizeRange,
    sortBy,
    showCertified,
  ]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-3">
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
      </div>

      <div className="space-y-3">
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
      </div>

      <div className="space-y-3">
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
      </div>

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
            {genders.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Khoảng giá
        </h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={30000000}
          min={0}
          step={1000000}
          className="mb-4 [&_[role=slider]]:bg-[#0A3D62] [&_[role=slider]]:border-[#0A3D62] [&_[role=slider]]:shadow-lg"
        />
        <div className="flex justify-between text-sm font-medium">
          <span className="text-[#0A3D62]">
            {formatCurrency(priceRange[0])}
          </span>
          <span className="text-[#0A3D62]">
            {formatCurrency(priceRange[1])}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-[#0A3D62] text-sm uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#0A3D62] rounded-full"></div>
          Kích thước (cm)
        </h3>
        <Slider
          value={sizeRange}
          onValueChange={setSizeRange}
          max={60}
          min={15}
          step={1}
          className="mb-4 [&_[role=slider]]:bg-[#0A3D62] [&_[role=slider]]:border-[#0A3D62] [&_[role=slider]]:shadow-lg"
        />
        <div className="flex justify-between text-sm font-medium">
          <span className="text-[#0A3D62]">{sizeRange[0]}cm</span>
          <span className="text-[#0A3D62]">{sizeRange[1]}cm</span>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-[#0A3D62]/5 to-transparent rounded-xl border border-[#0A3D62]/10">
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
      </div>

      {/* Reset Button */}
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

            {/* Search and Sort */}
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
              <Select value={sortBy} onValueChange={setSortBy}>
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
              </Select>

              {/* Mobile Filter Button */}
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
          {/* Desktop Filters */}
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

          {/* Results */}
          <div className="flex-1">
            {/* Chỉ hiển thị kết quả tìm kiếm khi có filter được áp dụng */}
            {(searchTerm ||
              selectedVariety !== "Tất cả" ||
              selectedOrigin !== "Tất cả" ||
              selectedStatus !== "Tất cả" ||
              selectedGender !== "Tất cả" ||
              priceRange[0] !== 0 ||
              priceRange[1] !== 30000000 ||
              sizeRange[0] !== 20 ||
              sizeRange[1] !== 50 ||
              showCertified) && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Tìm thấy {filteredAndSortedKoi.length} kết quả
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedKoi.map((koi) => (
                <Card
                  key={koi.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow pt-0"
                >
                  <div className="relative">
                    <Image
                      src={koi.image || "/placeholder.svg"}
                      alt={koi.name}
                      className="w-full h-48 object-cover"
                      width={400}
                      height={300}
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge
                        variant={
                          koi.status === "Có sẵn" ? "default" : "secondary"
                        }
                      >
                        {koi.status}
                      </Badge>
                      {koi.certificates.includes("Chứng nhận nguồn gốc") && (
                        <Badge variant="outline" className="bg-background/80">
                          Chứng nhận
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{koi.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {koi.variety}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Kích thước:
                        </span>
                        <span className="ml-1 font-medium">{koi.size}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tuổi:</span>
                        <span className="ml-1 font-medium">{koi.age}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Giới tính:
                        </span>
                        <span className="ml-1 font-medium">{koi.gender}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Xuất xứ:</span>
                        <span className="ml-1 font-medium">{koi.origin}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(koi.price)}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-white border-0"
                      disabled={koi.status !== "Có sẵn"}
                      onClick={() =>
                        addItem({
                          id: koi.id.toString(),
                          name: koi.name,
                          variety: koi.variety,
                          price: koi.price,
                          size: koi.size,
                          age: koi.age,
                          image: koi.image,
                        })
                      }
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {koi.status === "Có sẵn" ? "Thêm vào giỏ" : "Hết hàng"}
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

            {filteredAndSortedKoi.length === 0 && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
