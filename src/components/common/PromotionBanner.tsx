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
import { Flame, Clock, Gift, TrendingDown } from "lucide-react";
import { format, isPast } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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

  // Auto-rotate carousel every 4 seconds when not hovering
  useEffect(() => {
    if (!carouselApi || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselApi, isHovered]);

  // Don't show if loading or no promotion
  if (isLoading || !promotion) {
    return null;
  }

  // Check if promotion has expired
  if (isPast(new Date(promotion.validTo))) {
    return null;
  }

  const getDiscountDisplay = (): string => {
    if (promotion.discountType === "Percentage") {
      return `${promotion.discountValue}%`;
    } else {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(promotion.discountValue);
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
          "bg-gradient-to-r from-primary to-accent text-white py-2 px-4 text-center text-sm font-semibold rounded-lg",
          className,
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <Gift className="h-4 w-4" />
          <span>
            {promotion.code}: Giảm {getDiscountDisplay()}
          </span>
          {daysUntilExpiry <= 7 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {daysUntilExpiry}d
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Full variant - matching homepage style
  return (
    <Card
      className={cn(
        "border-border overflow-hidden hover:shadow-lg transition-shadow p-0",
        className,
      )}
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Left: Promotion Images Carousel */}
        {promotion.images && promotion.images.length > 0 ? (
          <div
            className="relative aspect-square lg:aspect-auto overflow-hidden bg-muted/30 rounded-l-lg group"
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
                    <div className="aspect-square relative">
                      <Image
                        src={image}
                        alt={`${promotion.code} - Hình ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300"
                        fill
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {promotion.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </Carousel>
          </div>
        ) : (
          <div className="hidden lg:flex aspect-square items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-l-lg">
            <Gift className="h-20 w-20 text-primary/30" />
          </div>
        )}

        {/* Right: Promotion Details */}
        <div className="p-6 lg:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header with badge */}
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-foreground border-primary/20 w-fit"
              >
                <Gift className="h-3 w-3 mr-1" />
                Khuyến mãi đặc biệt
              </Badge>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                {promotion.code}
              </h3>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-base">
              {promotion.description}
            </p>

            {/* Discount Display - Large */}
            <div className="flex items-baseline gap-2 pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl lg:text-6xl font-bold text-primary">
                  {getDiscountDisplay()}
                </span>
              </div>
              <span className="text-lg text-muted-foreground">Giảm giá</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {daysUntilExpiry <= 7 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <Clock className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Còn lại</p>
                    <p className="font-semibold text-destructive">
                      {daysUntilExpiry} ngày
                    </p>
                  </div>
                </div>
              )}

              {promotion.minimumOrderAmount > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <TrendingDown className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tối thiểu</p>
                    <p className="font-semibold text-accent text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(promotion.minimumOrderAmount)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with deadline and CTA */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Hạn chót:</span>
              <span className="font-semibold text-foreground">
                {format(new Date(promotion.validTo), "dd MMM yyyy", {
                  locale: vi,
                })}
              </span>
            </div>

            <Link href="/catalog" className="block">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Flame className="h-4 w-4 mr-2" />
                Khám Phá Hôm Nay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
