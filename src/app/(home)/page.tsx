"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Star, Zap, Shield, Award, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [api, isHovered]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-10 lg:py-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-foreground border-primary/20"
                >
                  Công nghệ AI & RFID tiên tiến
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance">
                  Cá Koi Nhật Bản
                  <span className="text-primary block">Chất Lượng Cao</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Trại cá Koi hàng đầu với hệ thống quản lý thông minh, đảm bảo
                  chất lượng và nguồn gốc rõ ràng cho từng con cá.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/catalog" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Khám phá cá Koi
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary text-primary hover:bg-primary bg-transparent"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Xem video giới thiệu
                </Button>
              </div>
              <div className="flex items-center justify-between sm:space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Cá Koi chất lượng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    15+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Năm kinh nghiệm
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    1000+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Khách hàng hài lòng
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
                  alt="Cá Koi Nhật Bản chất lượng cao"
                  className="w-full h-full object-cover rounded-xl"
                  width={500}
                  height={500}
                />
              </div>
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Theo dõi trực tiếp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section id="technology" className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-foreground border-primary/20"
            >
              Công nghệ tiên tiến
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Hệ thống quản lý thông minh
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ứng dụng AI và RFID để đảm bảo chất lượng và truy xuất nguồn gốc
              hoàn hảo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>AI Tư vấn</CardTitle>
                <CardDescription>
                  Hệ thống AI gợi ý cặp ghép tối ưu dựa trên dữ liệu di truyền
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

      {/* Koi Catalog Preview */}
      <section id="catalog" className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Bộ sưu tập cá Koi đặc biệt
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Khám phá những con cá Koi Nhật Bản thuần chủng với chất lượng vượt
              trội
            </p>
          </div>

          <div className="mb-12">
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
                {[
                  {
                    id: 1,
                    name: "Kohaku Premium",
                    price: "15,000,000",
                    age: "2 năm",
                    size: "35cm",
                  },
                  {
                    id: 2,
                    name: "Sanke Đặc biệt",
                    price: "22,000,000",
                    age: "3 năm",
                    size: "42cm",
                  },
                  {
                    id: 3,
                    name: "Showa Cao cấp",
                    price: "18,000,000",
                    age: "2.5 năm",
                    size: "38cm",
                  },
                  {
                    id: 4,
                    name: "Taisho Sanke Elite",
                    price: "28,000,000",
                    age: "4 năm",
                    size: "45cm",
                  },
                  {
                    id: 5,
                    name: "Asagi Platinum",
                    price: "20,000,000",
                    age: "3 năm",
                    size: "40cm",
                  },
                ].map((koi, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="border-border hover:shadow-lg transition-all group cursor-pointer pt-0">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
                          alt={koi.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={400}
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {koi.name}
                            </CardTitle>
                            <CardDescription>
                              Tuổi: {koi.age} • Kích thước: {koi.size}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-foreground"
                          >
                            Có sẵn
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="text-2xl font-bold text-primary">
                            {koi.price}₫
                          </span>
                          <Link href={`/koi/${koi.id}`}>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-xs sm:text-sm"
                            >
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>

          <div className="text-center px-4 sm:px-0">
            <Link href="/catalog" className="w-full sm:w-auto inline-block">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary bg-transparent"
              >
                Xem tất cả cá Koi
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Anh Minh Tuấn",
                role: "Chủ hồ cá Koi",
                content:
                  "Chất lượng cá Koi tuyệt vời, hệ thống theo dõi rất chuyên nghiệp. Tôi rất hài lòng với dịch vụ.",
                rating: 5,
              },
              {
                name: "Chị Lan Anh",
                role: "Người sưu tầm",
                content:
                  "Công nghệ RFID giúp tôi yên tâm về nguồn gốc. Cá khỏe mạnh và đẹp như mô tả.",
                rating: 5,
              },
              {
                name: "Anh Đức Thành",
                role: "Chủ trang trại",
                content:
                  "Hệ thống AI tư vấn rất hữu ích cho việc chọn cá giống. Dịch vụ chuyên nghiệp.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-16 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">
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
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Đặt hàng ngay
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary text-primary hover:bg-primary bg-transparent"
                >
                  Tư vấn miễn phí
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
