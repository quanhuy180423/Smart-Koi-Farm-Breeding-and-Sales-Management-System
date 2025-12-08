"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InputNumber } from "@/components/ui/input-number";
import {
  ShoppingCart,
  Package,
  Loader2,
  ChevronLeft,
  Calendar,
  Ruler,
  Play,
} from "lucide-react";
import { useGetPacketFishById } from "@/hooks/usePacketFish";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { getFishSizeLabel } from "@/lib/utils/enum";
import { useAddItemToCart } from "@/hooks/useCart";

export default function PacketFishDetailPage() {
  const params = useParams();
  const packetId = Number(params.id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: packet, isLoading } = useGetPacketFishById(packetId);
  const { mutate: addToCart, isPending: isAddPending } = useAddItemToCart();

  const handleAddToCart = () => {
    if (packet) {
      addToCart({ packetFishId: packet.id, quantity });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">Không tìm thấy gói cá</p>
          <Link href="/packet-fish">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/packet-fish"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:grid-rows-[1fr]">
          {/* Images and Videos Section */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            {/* Main Image */}
            {packet.images && packet.images.length > 0 && (
              <Card className="shrink-0">
                <CardContent className="p-4 space-y-4">
                  <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={packet.images[selectedImageIdx]}
                      alt={`${packet.name} - Ảnh ${selectedImageIdx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Thumbnails */}
                  {packet.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {packet.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`shrink-0 relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                            selectedImageIdx === idx
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Videos */}
            {packet.videos && packet.videos.length > 0 && (
              <Card className="shrink-0">
                <CardHeader>
                  <h3 className="font-semibold">Video</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Video */}
                  <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                    <video
                      src={packet.videos[selectedVideoIdx]}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>

                  {/* Video Thumbnails */}
                  {packet.videos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {packet.videos.map((vid, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVideoIdx(idx)}
                          className={`shrink-0 relative w-20 h-20 rounded-md overflow-hidden border-2 bg-muted flex items-center justify-center transition-colors ${
                            selectedVideoIdx === idx
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground"
                          }`}
                        >
                          <video
                            src={vid}
                            className="w-full h-full object-cover"
                          />
                          <Play className="absolute h-4 w-4 text-white drop-shadow-lg" />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {packet.description && (
              <Card className="shrink-0">
                <CardHeader>
                  <h3 className="font-semibold">Mô tả</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {packet.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-4 lg:sticky lg:top-8 lg:h-fit">
            {/* Main Info */}
            <Card className="h-full">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{packet.name}</h1>
                  {packet.isAvailable && (
                    <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                      Còn hàng
                    </Badge>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Giá</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(packet.pricePerPacket)}
                  </p>
                </div>

                {/* Specifications */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Ruler className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Kích thước
                      </p>
                      <p className="font-semibold">
                        {getFishSizeLabel(packet.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Tuổi</p>
                      <p className="font-semibold">{packet.ageMonths} tháng</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Số lượng</p>
                      <p className="font-semibold">{packet.fishPerPacket} cá</p>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Số lượng gói</label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </Button>
                      <InputNumber
                        value={quantity}
                        onChange={(value) =>
                          setQuantity(Math.max(1, value || 1))
                        }
                        min={1}
                        className="w-12 text-center border rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                    disabled={isAddPending || !packet.isAvailable}
                    onClick={handleAddToCart}
                  >
                    {isAddPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm vào giỏ
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Varieties */}
            {packet.varietyPacketFishes &&
              packet.varietyPacketFishes.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Giống cá trong gói</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {packet.varietyPacketFishes.map((variety) => (
                      <div
                        key={variety.id}
                        className="flex items-center gap-2 p-2 rounded-md border"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm">{variety.varietyName}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
