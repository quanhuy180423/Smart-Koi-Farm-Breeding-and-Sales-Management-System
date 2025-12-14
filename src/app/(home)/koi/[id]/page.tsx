"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Heart,
  ShoppingCart,
  Shield,
  Fish,
  Calendar,
  Ruler,
  MapPin,
  User,
  Loader2,
  Network,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import {
  useGetKoiFishById,
  useGetKoiFishFamily,
  useGetKoiBreedingHistory,
} from "@/hooks/useKoiFish";
import { formatKoiAge } from "@/lib/utils/dates/age";
import { useAddItemToCart, useGetCart } from "@/hooks/useCart";
import {
  getSaleStatusLabel,
  getGenderLabel,
  getFishSizeLabel,
  getHealthStatusLabel,
} from "@/lib/utils/enum";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { Gender, KoiFishFamilyResponse } from "@/lib/api/services/fetchKoiFish";
import { BreedingStatus } from "@/lib/api/services/fetchBreedingProcess";

// Pedigree Node Component
const PedigreeNode = ({
  koi,
  role,
}: {
  koi?: KoiFishFamilyResponse | null;
  role: string;
}) => {
  if (!koi) return null;

  return (
    <div className="border border-indigo-300 rounded-lg p-3 text-center shadow-lg bg-white min-w-40 transform transition-all hover:scale-[1.02] hover:shadow-xl relative z-10">
      {/* Image */}
      <div className="flex justify-center mb-2">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-200">
          {koi.images && koi.images.length > 0 ? (
            <Image
              src={koi.images[0]}
              alt={koi.rfid}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              <Fish className="h-6 w-6 text-indigo-400" />
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] font-medium text-indigo-500 mb-1">{role}</p>
      <p className="font-bold text-sm truncate text-indigo-800 mb-1">
        {koi?.rfid?.split(" ")[0] ?? "—"}
      </p>
      <p className="text-xs text-gray-600 mb-1">{koi?.varietyName ?? "—"}</p>
      <p
        className={`text-xs font-bold ${
          koi?.gender === Gender.MALE ? "text-blue-600" : "text-pink-600"
        }`}
      >
        {getGenderLabel(koi?.gender).label}
      </p>
    </div>
  );
};
import { useCheckFavorite, useToggleFavorite } from "@/hooks/useFavoriteKoi";
import { useAuthStore } from "@/store/auth-store";

// Helper function to get breeding status label
const getBreedingStatusLabel = (status: BreedingStatus) => {
  switch (status) {
    case BreedingStatus.COMPLETE:
      return { label: "Hoàn thành", variant: "default" as const };
    case BreedingStatus.FAILED:
      return { label: "Thất bại", variant: "destructive" as const };
    case BreedingStatus.PAIRING:
      return { label: "Đang ghép cặp", variant: "secondary" as const };
    case BreedingStatus.SPAWNED:
      return { label: "Đã sinh sản", variant: "secondary" as const };
    case BreedingStatus.EGG_BATCH:
      return { label: "Ốp trứng", variant: "secondary" as const };
    case BreedingStatus.FRY_FISH:
      return { label: "Cá bột", variant: "secondary" as const };
    case BreedingStatus.CLASSIFICATION:
      return { label: "Phân loại", variant: "secondary" as const };
    default:
      return { label: status, variant: "outline" as const };
  }
};

export default function KoiDetailPage() {
  const params = useParams();
  const koiId = parseInt(params.id as string);

  const { data: koi, isLoading, isError } = useGetKoiFishById(koiId);
  const { data: koiFishFamily, isLoading: isPedigreeLoading } =
    useGetKoiFishFamily(koiId);
  const { data: breedingHistory, isLoading: isBreedingHistoryLoading } =
    useGetKoiBreedingHistory(koiId);
  const { mutate: addToCart, isPending: isAddPending } = useAddItemToCart();
  const { data: cart } = useGetCart();

  // Check if item is already in cart
  const isInCart =
    cart?.cartItems?.some((item) => item.koiFishId === koiId) || false;
  const [selectedImage, setSelectedImage] = useState(0);

  // Favorite hooks
  const { isAuthenticated } = useAuthStore();
  const { data: isFavorite } = useCheckFavorite(koiId);
  const { toggleFavorite, isLoading: isFavoriteLoading } = useToggleFavorite();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin cá Koi...</p>
        </div>
      </div>
    );
  }

  if (isError || !koi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy cá Koi</h1>
          <p className="text-muted-foreground mb-6">
            Cá Koi bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link href="/catalog">
            <Button>Quay lại danh mục</Button>
          </Link>
        </div>
      </div>
    );
  }

  const healthStatusLabel = getHealthStatusLabel(koi.healthStatus);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={koi.images[selectedImage] || "/placeholder.svg"}
                alt={koi.rfid}
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
            </div>

            {/* Thumbnails - Grid for ≤3 images, Carousel for >3 images */}
            {koi.images.length <= 3 ? (
              <div className="grid grid-cols-3 gap-2">
                {koi.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${koi.rfid} ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={500}
                      height={500}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {koi.images.map((image, index) => (
                    <CarouselItem key={index} className="pl-2 basis-1/3">
                      <button
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors w-full ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${koi.rfid} ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={500}
                          height={500}
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex -left-9 border-primary" />
                <CarouselNext className="hidden lg:flex -right-9 border-primary" />
              </Carousel>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-balance">
                    {koi.rfid}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {koi.variety?.varietyName}
                  </p>
                </div>
                {/* favorite button */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (!isAuthenticated) {
                        window.location.href = "/login";
                        return;
                      }
                      toggleFavorite(koiId, !!isFavorite);
                    }}
                    disabled={isFavoriteLoading}
                    className={
                      isFavorite
                        ? "text-red-500 border-red-500 hover:bg-red-100 hover:text-red-600"
                        : ""
                    }
                  >
                    {isFavoriteLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart
                        className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                      />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={
                    koi.saleStatus && koi.saleStatus !== "Sold"
                      ? "default"
                      : "secondary"
                  }
                >
                  {getSaleStatusLabel(koi.saleStatus).label}
                </Badge>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {formatCurrency(koi.sellingPrice || 0)}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Đây là con cá Koi {koi.variety?.varietyName} chất lượng cao.
                Thông tin chi tiết về sức khỏe, dòng máu và các chứng nhận xin
                vui lòng xem các tab bên dưới.
              </p>
            </div>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Kích thước:
                    </span>
                    <span className="font-medium">
                      {getFishSizeLabel(koi.size)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tuổi:</span>
                    <span className="font-medium">
                      {formatKoiAge(koi.birthDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Giới tính:
                    </span>
                    <span className="font-medium">
                      {getGenderLabel(koi.gender).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Xuất xứ:
                    </span>
                    <span className="font-medium">{koi.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loại cá:
                    </span>
                    <span className="font-medium">{koi.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Hoa văn:
                    </span>
                    <span className="font-medium">
                      {koi.pattern || "Không xác định"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isInCart ? (
              <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Đã được thêm vào giỏ hàng</span>
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white"
                disabled={isAddPending || koi.saleStatus === "Sold"}
                onClick={() => addToCart({ koiFishId: koi.id, quantity: 1 })}
              >
                {isAddPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {koi.saleStatus === "Sold"
                      ? "Hết hàng"
                      : "Thêm vào giỏ hàng"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">Thông tin chi tiết</TabsTrigger>
              <TabsTrigger value="health">Sức khỏe</TabsTrigger>
              <TabsTrigger value="pedigree">Gia phả</TabsTrigger>
              <TabsTrigger value="breeding">Lịch sử sinh sản</TabsTrigger>
              <TabsTrigger value="care">Hướng dẫn chăm sóc</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fish className="h-5 w-5" />
                      Thông tin cá Koi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Mã RFID:
                      </span>
                      <p className="font-mono font-medium">{koi.rfid}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Giống loại:
                      </span>
                      <p className="font-medium">{koi.variety?.varietyName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Xuất xứ:
                      </span>
                      <p className="font-medium">{koi.origin}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Trạng thái:
                      </span>
                      <Badge variant="outline" className="mt-1">
                        {getSaleStatusLabel(koi.saleStatus).label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Giới tính:
                      </span>
                      <p className="font-medium">
                        {getGenderLabel(koi.gender).label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Kích thước:
                      </span>
                      <p className="font-medium">
                        {getFishSizeLabel(koi.size)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Tuổi:
                      </span>
                      <p className="font-medium">
                        {formatKoiAge(koi.birthDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Ngày sinh:
                      </span>
                      <p className="font-medium">
                        {formatDate(koi.birthDate, DATE_FORMATS.MEDIUM_DATE)}
                      </p>
                    </div>
                    {/* Mutation Info */}
                    {koi.isMutated && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Đặc tính đột biến:
                          </span>
                          <p className="font-medium">
                            {koi.mutationDescription || "Không xác định"}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Thông tin sức khỏe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Tình trạng sức khỏe:
                    </span>
                    <Badge
                      variant="outline"
                      className={`${healthStatusLabel.colorClass}`}
                    >
                      {healthStatusLabel.label}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Ghi chú:
                    </span>
                    <p className="font-medium mt-1">
                      Thông tin sức khỏe chi tiết sẽ được cập nhật. Vui lòng
                      liên hệ với chúng tôi để biết thêm thông tin.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pedigree" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Gia phả cá Koi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPedigreeLoading ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang tải dữ liệu...
                    </div>
                  ) : (
                    <div className="flex flex-col-reverse items-center py-8 space-y-12 space-y-reverse relative">
                      {/* Cá hiện tại */}
                      <div className="relative flex flex-col items-center">
                        <PedigreeNode koi={koiFishFamily} role="Cá Hiện tại" />
                        {(koiFishFamily?.father || koiFishFamily?.mother) && (
                          <div className="w-0.5 h-6 bg-indigo-500 absolute -top-6"></div>
                        )}
                      </div>

                      {/* Bố mẹ */}
                      {(koiFishFamily?.father || koiFishFamily?.mother) && (
                        <div className="relative flex justify-center w-full max-w-5xl">
                          {koiFishFamily?.father && (
                            <div className="relative flex flex-col items-center w-1/2">
                              <PedigreeNode
                                koi={koiFishFamily.father}
                                role="Bố (P1)"
                              />
                              {(koiFishFamily.father?.father ||
                                koiFishFamily.father?.mother) && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>
                              )}
                            </div>
                          )}

                          {koiFishFamily?.mother && (
                            <div className="relative flex flex-col items-center w-1/2">
                              <PedigreeNode
                                koi={koiFishFamily.mother}
                                role="Mẹ (P1)"
                              />
                              {(koiFishFamily.mother?.father ||
                                koiFishFamily.mother?.mother) && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>
                              )}
                            </div>
                          )}

                          {/* Đường ngang nối từ Cá hiện tại xuống Bố Mẹ */}
                          {koiFishFamily?.father && koiFishFamily?.mother ? (
                            <div className="absolute -bottom-6 left-1/4 right-1/4 h-0.5 bg-indigo-500"></div>
                          ) : koiFishFamily?.father ? (
                            <div className="absolute -bottom-6 left-1/2 w-0 h-0.5 bg-indigo-500"></div>
                          ) : (
                            <div className="absolute -bottom-6 right-1/2 w-0 h-0.5 bg-indigo-500"></div>
                          )}

                          {/* Đường dọc nối từ đường ngang xuống mỗi node */}
                          {koiFishFamily?.father && (
                            <div className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                          )}
                          {koiFishFamily?.mother && (
                            <div className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                          )}
                        </div>
                      )}

                      {/* Ông bà */}
                      {(koiFishFamily?.father?.father ||
                        koiFishFamily?.father?.mother ||
                        koiFishFamily?.mother?.father ||
                        koiFishFamily?.mother?.mother) && (
                        <div className="relative flex justify-center w-full max-w-6xl">
                          {/* Ông bà bên cha */}
                          <div className="relative w-1/2 px-4">
                            <div className="relative flex justify-between gap-4">
                              <div className="flex-1 flex justify-start">
                                {koiFishFamily?.father?.father && (
                                  <PedigreeNode
                                    koi={koiFishFamily?.father?.father}
                                    role="Ông (G1)"
                                  />
                                )}
                              </div>
                              <div className="flex-1 flex justify-end">
                                {koiFishFamily?.father?.mother && (
                                  <PedigreeNode
                                    koi={koiFishFamily?.father?.mother}
                                    role="Bà (G1)"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Đường ngang nối 2 ông bà bên cha */}
                            {koiFishFamily?.father?.father &&
                              koiFishFamily?.father?.mother && (
                                <div className="absolute -bottom-6 left-1/4 right-1/4 h-0.5 bg-indigo-500"></div>
                              )}

                            {/* Đường dọc xuống ông */}
                            {koiFishFamily?.father?.father &&
                            koiFishFamily?.father?.mother ? (
                              <div className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : koiFishFamily?.father?.father ? (
                              <div className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : null}

                            {/* Đường dọc xuống bà */}
                            {koiFishFamily?.father?.father &&
                            koiFishFamily?.father?.mother ? (
                              <div className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : koiFishFamily?.father?.mother ? (
                              <div className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : null}
                          </div>

                          {/* Ông bà bên mẹ */}
                          <div className="relative w-1/2 px-4">
                            <div className="relative flex justify-between gap-4">
                              <div className="flex-1 flex justify-start">
                                {koiFishFamily?.mother?.father && (
                                  <PedigreeNode
                                    koi={koiFishFamily?.mother?.father}
                                    role="Ông (G2)"
                                  />
                                )}
                              </div>
                              <div className="flex-1 flex justify-end">
                                {koiFishFamily?.mother?.mother && (
                                  <PedigreeNode
                                    koi={koiFishFamily?.mother?.mother}
                                    role="Bà (G2)"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Đường ngang nối 2 ông bà bên mẹ */}
                            {koiFishFamily?.mother?.father &&
                              koiFishFamily?.mother?.mother && (
                                <div className="absolute -bottom-6 left-1/4 right-1/4 h-0.5 bg-indigo-500"></div>
                              )}

                            {/* Đường dọc xuống ông */}
                            {koiFishFamily?.mother?.father &&
                            koiFishFamily?.mother?.mother ? (
                              <div className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : koiFishFamily?.mother?.father ? (
                              <div className="absolute -bottom-6 left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : null}

                            {/* Đường dọc xuống bà */}
                            {koiFishFamily?.mother?.father &&
                            koiFishFamily?.mother?.mother ? (
                              <div className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : koiFishFamily?.mother?.mother ? (
                              <div className="absolute -bottom-6 right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breeding" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-5 w-5" />
                    Lịch sử sinh sản
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isBreedingHistoryLoading ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang tải dữ liệu...
                    </div>
                  ) : !breedingHistory?.breedingHistory ||
                    breedingHistory.breedingHistory.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <Fish className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        Chưa có lịch sử sinh sản
                      </p>
                      <p className="text-sm">
                        Cá Koi này chưa tham gia vào quá trình sinh sản nào.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Thông tin tổng quan */}
                      <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {breedingHistory.breedingHistory.length}
                            </div>
                            <div className="text-sm text-blue-700">
                              Lần sinh sản
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {breedingHistory.breedingHistory.reduce(
                                (total, item) =>
                                  total + item.totalFishQualified,
                                0,
                              )}
                            </div>
                            <div className="text-sm text-green-700">
                              Tổng cá con đạt chuẩn
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {breedingHistory.breedingHistory.reduce(
                                (total, item) => total + item.totalPackage,
                                0,
                              )}
                            </div>
                            <div className="text-sm text-purple-700">
                              Tổng gói cá
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách lịch sử */}
                      <div className="space-y-4">
                        {breedingHistory.breedingHistory.map(
                          (history, index) => (
                            <Card
                              key={history.breedingProcessId}
                              className="border-l-4 border-l-blue-500"
                            >
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        #{index + 1}
                                      </Badge>
                                      Quy trình sinh sản {history.code}
                                    </CardTitle>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Bắt đầu:{" "}
                                        {formatDate(
                                          history.startDate,
                                          DATE_FORMATS.MEDIUM_DATE,
                                        )}
                                      </div>
                                      {history.endDate && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          Kết thúc:{" "}
                                          {formatDate(
                                            history.endDate,
                                            DATE_FORMATS.MEDIUM_DATE,
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      getBreedingStatusLabel(history.status)
                                        .variant
                                    }
                                  >
                                    {
                                      getBreedingStatusLabel(history.status)
                                        .label
                                    }
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Thông tin đối tác sinh sản */}
                                <div>
                                  <h5 className="font-semibold mb-2 flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-pink-500" />
                                    Đối tác sinh sản
                                  </h5>
                                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    {history.partner.images &&
                                    history.partner.images.length > 0 ? (
                                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image
                                          src={history.partner.images[0]}
                                          alt={history.partner.rfid}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                        <Fish className="h-6 w-6 text-gray-500" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {history.partner.rfid}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {history.partner.varietyName}
                                      </p>
                                      {history.partner.isMutated && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs mt-1"
                                        >
                                          Đột biến
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Thống kê sinh sản */}
                                <div>
                                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    Thống kê sinh sản
                                  </h5>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                                      <div className="text-lg font-bold text-blue-600">
                                        {history.totalEggs.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-blue-700">
                                        Tổng trứng
                                      </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                                      <div className="text-lg font-bold text-green-600">
                                        {history.fertilizationRate.toFixed(1)}%
                                      </div>
                                      <div className="text-xs text-green-700">
                                        Tỷ lệ thụ tinh
                                      </div>
                                    </div>
                                    {history.hatchingRate !== null && (
                                      <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-200">
                                        <div className="text-lg font-bold text-yellow-600">
                                          {history.hatchingRate.toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-yellow-700">
                                          Tỷ lệ nở
                                        </div>
                                      </div>
                                    )}
                                    <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-200">
                                      <div className="text-lg font-bold text-purple-600">
                                        {history.survivalRate.toFixed(1)}%
                                      </div>
                                      <div className="text-xs text-purple-700">
                                        Tỷ lệ sống sót
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Kết quả */}
                                <div>
                                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                                    <Fish className="h-4 w-4 text-indigo-500" />
                                    Kết quả
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-indigo-600">
                                          {history.totalFishQualified}
                                        </div>
                                        <div className="text-xs text-indigo-700">
                                          Cá con đạt chuẩn
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-orange-600">
                                          {history.mutationRate !== null
                                            ? `${(history.mutationRate * 100).toFixed(1)}%`
                                            : "N/A"}
                                        </div>
                                        <div className="text-xs text-orange-700">
                                          Tỷ lệ đột biến
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-teal-600">
                                          {history.totalPackage}
                                        </div>
                                        <div className="text-xs text-teal-700">
                                          Gói cá được tạo
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Mutation Description nếu có */}
                                {history.partner.isMutated &&
                                  history.partner.mutationDescription && (
                                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                                      <h5 className="font-semibold mb-1 text-amber-700">
                                        Mô tả đột biến của đối tác:
                                      </h5>
                                      <p className="text-sm text-amber-600">
                                        {history.partner.mutationDescription}
                                      </p>
                                    </div>
                                  )}
                              </CardContent>
                            </Card>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hướng dẫn chăm sóc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Hướng dẫn cho ăn</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cho ăn 2-3 lần/ngày với thức ăn chất lượng cao. Tránh cho
                      ăn quá nhiều trong thời tiết lạnh. Lượng thức ăn nên bằng
                      2-5% khối lượng cơ thể tùy theo mùa và nhiệt độ nước.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Điều kiện nước</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Duy trì nhiệt độ nước 18-25°C, pH 7.0-8.0, độ cứng nước
                      150-300 ppm. Thay nước định kỳ 20-30% mỗi tuần. Sử dụng bộ
                      lọc chất lượng cao và cysclone để loại bỏ chất thải.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
