"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Share2,
  Award,
  Shield,
  Fish,
  Calendar,
  Ruler,
  MapPin,
  User,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from API
const koiData = {
  1: {
    id: 1,
    name: "Kohaku Premium",
    variety: "Kohaku",
    size: "35cm",
    age: "2 năm",
    price: 15000000,
    origin: "Nhật Bản",
    breeder: "Sakai Fish Farm",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg",
    ],
    status: "Có sẵn",
    description:
      "Kohaku chất lượng cao với màu đỏ rực rỡ và trắng tinh khiết. Đây là một trong những con cá Koi đẹp nhất trong bộ sưu tập của chúng tôi, với pattern hoàn hảo và màu sắc sống động.",
    gender: "Cái",
    bloodline: "Sakai",
    certificates: [
      "Chứng nhận nguồn gốc",
      "Kiểm tra sức khỏe",
      "Chứng nhận chất lượng",
    ],
    rfidCode: "KOI-001-2024",
    parentInfo: {
      father: "Sakai Champion Male #45",
      mother: "Premium Female Kohaku #23",
    },
    healthRecord: {
      lastCheckup: "15/12/2024",
      vaccinations: ["Vaccine A", "Vaccine B"],
      healthStatus: "Tuyệt vời",
    },
    feedingGuide:
      "Cho ăn 2-3 lần/ngày với thức ăn chất lượng cao. Tránh cho ăn quá nhiều trong thời tiết lạnh.",
    careInstructions:
      "Duy trì nhiệt độ nước 18-25°C, pH 7.0-8.0. Thay nước định kỳ 20-30% mỗi tuần.",
    warranty: "Bảo hành 30 ngày đổi trả nếu có vấn đề về sức khỏe",
  },
};

export default function KoiDetailPage() {
  const params = useParams();
  const koiId = params.id as string;
  const koi = koiData[koiId as unknown as keyof typeof koiData];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!koi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy cá Koi</h1>
          <Link href="/catalog">
            <Button>Quay lại danh mục</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/catalog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh mục
              </Button>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link href="/catalog" className="hover:text-foreground">
                Danh mục
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{koi.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={koi.images[selectedImage] || "/placeholder.svg"}
                alt={koi.name}
                className="w-full h-full object-cover"
              />
            </div>
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
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${koi.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-balance">
                    {koi.name}
                  </h1>
                  <p className="text-lg text-muted-foreground">{koi.variety}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "text-red-500 border-red-500" : ""}
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
                  variant={koi.status === "Có sẵn" ? "default" : "secondary"}
                >
                  {koi.status}
                </Badge>
                {koi.certificates.includes("Chứng nhận nguồn gốc") && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Chứng nhận
                  </Badge>
                )}
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                {formatPrice(koi.price)}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {koi.description}
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
                    <span className="font-medium">{koi.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tuổi:</span>
                    <span className="font-medium">{koi.age}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Giới tính:
                    </span>
                    <span className="font-medium">{koi.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Xuất xứ:
                    </span>
                    <span className="font-medium">{koi.origin}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={koi.status !== "Có sẵn"}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {koi.status === "Có sẵn" ? "Thêm vào giỏ hàng" : "Đã đặt trước"}
              </Button>
              <Button size="lg" variant="outline">
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
              <TabsTrigger value="health">Sức khỏe</TabsTrigger>
              <TabsTrigger value="care">Chăm sóc</TabsTrigger>
              <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fish className="h-5 w-5" />
                      Thông tin chi tiết
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Mã RFID:
                      </span>
                      <p className="font-mono font-medium">{koi.rfidCode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Dòng máu:
                      </span>
                      <p className="font-medium">{koi.bloodline}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Trại cá:
                      </span>
                      <p className="font-medium">{koi.breeder}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin bố mẹ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Cá bố:
                      </span>
                      <p className="font-medium">{koi.parentInfo.father}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Cá mẹ:
                      </span>
                      <p className="font-medium">{koi.parentInfo.mother}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Hồ sơ sức khỏe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Kiểm tra gần nhất:
                    </span>
                    <p className="font-medium">
                      {koi.healthRecord.lastCheckup}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Tình trạng sức khỏe:
                    </span>
                    <Badge
                      variant="outline"
                      className="ml-2 bg-green-50 text-green-700 border-green-200"
                    >
                      {koi.healthRecord.healthStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Vaccine đã tiêm:
                    </span>
                    <div className="flex gap-2 mt-1">
                      {koi.healthRecord.vaccinations.map((vaccine, index) => (
                        <Badge key={index} variant="secondary">
                          {vaccine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hướng dẫn cho ăn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{koi.feedingGuide}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hướng dẫn chăm sóc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{koi.careInstructions}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Chứng nhận và bảo hành
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Các chứng nhận:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {koi.certificates.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Chính sách bảo hành:
                    </span>
                    <p className="mt-1 leading-relaxed">{koi.warranty}</p>
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
