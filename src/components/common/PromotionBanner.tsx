"use client";

import { useCurrentPromotion } from "@/hooks/usePromotion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Flame, Clock, Gift, Sparkles } from "lucide-react";
import { isPast } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";

interface PromotionBannerProps {
  variant?: "full" | "compact";
  className?: string;
}

export function PromotionBanner({
  variant = "full",
  className,
}: PromotionBannerProps) {
  const { data: promotion, isLoading } = useCurrentPromotion();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!carouselApi || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselApi, isHovered]);

  if (isLoading || !promotion) {
    return null;
  }

  if (isPast(new Date(promotion.validTo))) {
    return null;
  }

  const getDiscountDisplay = (): string => {
    if (promotion.discountType === "Percentage") {
      return `${promotion.discountValue}%`;
    } else {
      return formatCurrency(promotion.discountValue);
    }
  };

  const daysUntilExpiry = Math.ceil(
    (new Date(promotion.validTo).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "bg-linear-to-r from-primary via-primary/90 to-accent text-white py-2 px-3 rounded-lg shadow-md",
          className,
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="h-3 w-3" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-medium opacity-90">Mã giảm giá</p>
              <p className="text-xs font-bold">{promotion.code}</p>
            </div>
          </div>
          <div className="h-6 w-px bg-white/30" />
          <div className="text-left">
            <p className="text-[10px] font-medium opacity-90">Giảm</p>
            <p className="text-xs font-bold">{getDiscountDisplay()}</p>
          </div>
          {daysUntilExpiry <= 7 && (
            <>
              <div className="h-6 w-px bg-white/30" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">
                <Clock className="h-2.5 w-2.5 mr-1" />
                {daysUntilExpiry} ngày
              </Badge>
            </>
          )}
        </div>
      </div>
    );
  }

  // Full variant - Enhanced design
  return (
    <Card
      className={cn(
        "border-border overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 p-0 group",
        className,
      )}
    >
      <div className="relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-10" />
        
        <div className="grid lg:grid-cols-5 gap-0 relative">
          {/* Left: Promotion Images Carousel - Takes 3 columns */}
          <div className="lg:col-span-3 relative">
            {promotion.images && promotion.images.length > 0 ? (
              <div
                className="relative aspect-video overflow-hidden bg-linear-to-br from-muted/50 to-muted/30"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Carousel
                  className="w-full h-full"
                  opts={{
                    align: "center",
                    loop: true,
                  }}
                  setApi={setCarouselApi}
                >
                  <CarouselContent className="h-full">
                    {promotion.images.map((image, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="relative w-full h-full">
                          <Image
                            src={image}
                            alt={`${promotion.code} - Hình ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            fill
                            priority={index === 0}
                          />
                          {/* Subtle overlay gradient */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {promotion.images.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-0" />
                      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-0" />
                    </>
                  )}
                </Carousel>
                
                {/* Image indicator dots */}
                {promotion.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {promotion.images.map((_, idx) => (
                      <div
                        key={idx}
                        className="w-2 h-2 rounded-full bg-white/50 transition-all"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 via-primary/5 to-accent/10">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-white/50 rounded-xl flex items-center justify-center">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Khuyến mãi đặc biệt</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Promotion Details - Takes 2 columns */}
          <div className="lg:col-span-2 p-4 lg:p-6 flex flex-col justify-between bg-linear-to-br from-background to-muted/20">
            <div className="space-y-4">
              {/* Header with animated badge */}
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-red-500 text-white border-red-600 w-fit animate-pulse text-xs px-2 py-0.5"
                >
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  Ưu đãi hot
                </Badge>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-1.5 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    {promotion.code}
                  </h3>
                  <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed">
                    {promotion.description}
                  </p>
                </div>
              </div>

              {/* Discount Display - Premium style */}
              <div className="relative p-4 rounded-xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-inner">
                <div className="absolute top-2 right-2">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center animate-pulse">
                    <Flame className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">Giảm giá lên đến</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                      {getDiscountDisplay()}
                    </span>
                    {promotion.discountType === "Percentage" && (
                      <span className="text-lg font-semibold text-primary">OFF</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid - Compact */}
              <div className={`${daysUntilExpiry <= 7 ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 gap-3"}`}>
                {daysUntilExpiry <= 7 && (
                  <div className="p-3 rounded-lg bg-linear-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Clock className="h-3 w-3 text-destructive" />
                      <p className="text-sm font-medium text-muted-foreground">Còn lại</p>
                    </div>
                    <p className="text-base font-bold text-destructive">
                      {daysUntilExpiry} ngày
                    </p>
                  </div>
                )}

                {promotion.minimumOrderAmount > 0 && (
                  <div className="p-3 rounded-lg bg-linear-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-medium text-muted-foreground">Đơn tối thiểu</p>
                    </div>
                    <p className="text-sm font-bold text-accent">
                      {formatCurrency(promotion.minimumOrderAmount, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-linear-to-br from-blue-50 to-blue-25 border border-blue-200">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-medium text-muted-foreground">Hạn sử dụng</p>
                  </div>
                  <p className="text-sm font-bold text-blue-700">
                    {formatDate(promotion.validTo, "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with CTA */}
            <div className="space-y-3 pt-4 mt-4 border-t border-border">
              <Link href="/catalog" className="block">
                <Button
                  className="w-full cursor-pointer bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group h-10 text-sm"
                >
                  <Flame className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                  Mua Ngay - Đừng Bỏ Lỡ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}