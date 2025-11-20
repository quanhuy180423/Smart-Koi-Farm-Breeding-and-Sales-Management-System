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
  Share2,
  Shield,
  Fish,
  Calendar,
  Ruler,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetKoiFishById } from "@/hooks/useKoiFish";
import { useAddItemToCart } from "@/hooks/useCart";
import getAge from "@/lib/utils/dates/age";
import {
  getSaleStatusLabel,
  getGenderLabel,
  getFishSizeLabel,
  getHealthStatusLabel,
} from "@/lib/utils/enum";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";

export default function KoiDetailPage() {
  const params = useParams();
  const koiId = parseInt(params.id as string);

  const { data: koi, isLoading, isError } = useGetKoiFishById(koiId);
  const { mutate: addToCart, isPending: isAddPending } = useAddItemToCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={
                      isFavorite
                        ? "text-red-500 border-red-500 hover:bg-red-100 hover:text-red-600"
                        : ""
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
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
                    <span className="font-medium">{getAge(koi.birthDate)}</span>
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
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white"
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
                  {koi.saleStatus === "Sold" ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Thông tin chi tiết</TabsTrigger>
              <TabsTrigger value="health">Sức khỏe</TabsTrigger>
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
                      <p className="font-medium">{getAge(koi.birthDate)}</p>
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
