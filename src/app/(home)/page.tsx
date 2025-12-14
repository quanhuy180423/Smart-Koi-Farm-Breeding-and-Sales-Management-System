"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Zap, Award, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PromotionBanner } from "@/components/common/PromotionBanner";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import { SaleStatus } from "@/lib/api/services/fetchKoiFish";
import formatCurrency from "@/lib/utils/numbers";

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);

  // Fetch Koi fishes for carousel (limit to 5 items)
  const { data: koiFishesData, isLoading: isLoadingKoi } = useGetKoiFishes({
    pageIndex: 1,
    pageSize: 5,
    saleStatus: SaleStatus.AVAILABLE,
  });

  const koiFishes = koiFishesData?.data || [];

  useEffect(() => {
    if (!api || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api, isHovered]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="http://res.cloudinary.com/dybm9d31m/image/upload/v1765608906/d6wiroqqmlxwlgrihukl.png"
            alt="Cửu Ngư Quần Hội - Nine Koi Fish Gathering"
            className="w-full h-full object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-white">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
                  Cá Koi Nhật Bản
                  <span className="block ml-12">Chất Lượng Cao</span>
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-xl leading-relaxed">
                  Trải nghiệm sự thịnh vượng và bình an mang đến bởi bộ sưu tập cá Koi Nhật Bản cao cấp. Được tuyển chọn để đạt sự hoàn hảo.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalog">
                  <Button
                    size="lg"
                    className="bg-primary rounded-2xl cursor-pointer hover:bg-primary/90 text-white px-8 h-14 text-base font-semibold"
                  >
                    Khám Phá Bộ Sưu Tập
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Koi Catalog Preview */}
      <section id="catalog" className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold   text-balance">
              Bộ sưu tập cá Koi đặc biệt
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Khám phá những con cá Koi Nhật Bản thuần chủng với chất lượng vượt
              trội
            </p>
          </div>

          <div className="mb-8">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {isLoadingKoi ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="border-border pt-0">
                        <div className="aspect-square overflow-hidden rounded-t-lg bg-muted animate-pulse" />
                        <CardHeader>
                          <div className="space-y-2">
                            <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                          </div>
                        </CardHeader>
                      </Card>
                    </CarouselItem>
                  ))
                ) : koiFishes && koiFishes.length > 0 ? (
                  koiFishes.map((koi) => (
                    <CarouselItem
                      key={koi.id}
                      className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="border-border max-w-xl hover:shadow-lg transition-all group pt-0">
                        <div className="aspect-square overflow-hidden rounded-t-lg bg-muted/30">
                          {koi.images && koi.images.length > 0 ? (
                            <Image
                              src={koi.images[0]}
                              alt={koi.variety.varietyName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              width={400}
                              height={400}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              Chưa có ảnh
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <CardTitle className="text-lg">
                                  {koi.variety.varietyName}
                                </CardTitle>
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-xs px-2 py-0.5"
                                >
                                  Có sẵn
                                </Badge>
                              </div>
                              <CardDescription
                                className="text-sm truncate"
                                title={`RFID: ${koi.rfid}${koi.size ? ` • Size: ${koi.size}` : ""}`}
                              >
                                RFID: {koi.rfid}
                                {koi.size && ` • Size: ${koi.size}`}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-4">
                            <span className="text-2xl font-bold text-primary">
                              {koi.sellingPrice
                                ? formatCurrency(koi.sellingPrice)
                                : "Liên hệ"}
                            </span>
                            <Link href={`/koi/${koi.id}`}>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-xs cursor-pointer sm:text-sm"
                              >
                                Xem chi tiết
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  <div className="w-full text-center py-12">
                    <p className="text-muted-foreground">
                      Không có cá Koi nào có sẵn
                    </p>
                  </div>
                )}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex cursor-pointer" />
              <CarouselNext className="hidden lg:flex cursor-pointer" />
            </Carousel>
          </div>

          <div className="text-center px-4 sm:px-0">
            <Link href="/catalog" className="w-full sm:w-auto inline-block">
              <Button
                size="lg"
                variant="outline"
                className="w-full cursor-pointer sm:w-auto border-primary text-primary hover:bg-primary bg-transparent"
              >
                Xem tất cả cá Koi
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="pb-4 px-4">
        <div className="container mx-auto">
          <PromotionBanner variant="full" />
        </div>
      </section>

      {/* Technology Features */}
      <section id="technology" className="pb-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <Badge
              variant="secondary"
              className="bg-primary/10   border-primary/20"
            >
              Công nghệ tiên tiến
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold   text-balance">
              Hệ thống quản lý thông minh
            </h2>
            <p className="text-xl text-muted-foreground font-semibold max-w-2xl mx-auto text-pretty">
              Ứng dụng AI và RFID để đảm bảo chất lượng và truy xuất nguồn gốc
              hoàn hảo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chip RFID</CardTitle>
                <CardDescription>
                  Mỗi con cá được gắn chip RFID để theo dõi và quản lý chính xác
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Truy xuất nguồn gốc</CardTitle>
                <CardDescription>
                  Theo dõi hoàn chỉnh từ cá bố mẹ, ngày sinh đến quá trình nuôi
                  dưỡng
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-16 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold   text-balance">
                Sẵn sàng sở hữu cá Koi chất lượng cao?
              </h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Liên hệ với chúng tôi ngay hôm nay để được tư vấn và chọn lựa
                những con cá Koi phù hợp nhất
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/catalog" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full cursor-pointer sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Đặt hàng ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
