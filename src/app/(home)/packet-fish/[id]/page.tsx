"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InputNumber } from "@/components/ui/input-number";
import {
  ShoppingCart,
  Loader2,
  ChevronLeft,
  Play,
  Minus,
  Plus,
} from "lucide-react";
import { useGetPacketFishById } from "@/hooks/usePacketFish";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatSizeRange } from "@/lib/utils/enum";
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
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-500">Không tìm thấy gói cá</p>
          <Link href="/packet-fish">
            <Button variant="outline">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <Link href="/packet-fish">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 mb-8 px-3 py-2 h-auto cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Media */}
          <div className="space-y-6">
            {/* Main Image */}
            {packet.images && packet.images.length > 0 && (
              <div className="space-y-4">
                <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden">
                  <Image
                    src={packet.images[selectedImageIdx]}
                    alt={packet.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Image Thumbnails */}
                {packet.images.length > 1 && (
                  <div className="flex gap-3">
                    {packet.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIdx === idx
                            ? "border-gray-900"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Ảnh ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos */}
            {packet.videos && packet.videos.length > 0 && (
              <div className="space-y-4">
                <div className="relative w-full aspect-video bg-white rounded-lg overflow-hidden">
                  <video
                    src={packet.videos[selectedVideoIdx]}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>

                {packet.videos.length > 1 && (
                  <div className="flex gap-3">
                    {packet.videos.map((vid, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVideoIdx(idx)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-100 flex items-center justify-center transition-all ${
                          selectedVideoIdx === idx
                            ? "border-gray-900"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <video
                          src={vid}
                          className="w-full h-full object-cover"
                        />
                        <Play className="absolute h-5 w-5 text-white drop-shadow-lg" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Title & Status */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {packet.name}
              </h1>
              {packet.isAvailable && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Còn hàng
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(packet.pricePerPacket)}
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kích thước</span>
                <span className="font-medium">
                  {formatSizeRange(packet.size)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tuổi</span>
                <span className="font-medium">{packet.ageMonths} tháng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng cá/gói</span>
                <span className="font-medium">{packet.fishPerPacket} con</span>
              </div>
            </div>

            {/* Varieties */}
            {packet.varietyPacketFishes &&
              packet.varietyPacketFishes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Giống cá</p>
                  <div className="flex flex-wrap gap-2">
                    {packet.varietyPacketFishes.map((variety) => (
                      <span
                        key={variety.id}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {variety.varietyName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Số lượng</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0 cursor-pointer"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <InputNumber
                    value={quantity}
                    onChange={(value) => setQuantity(Math.max(1, value || 1))}
                    min={1}
                    className="w-16 h-10 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 p-0 cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
                disabled={isAddPending || !packet.isAvailable}
                onClick={handleAddToCart}
              >
                {isAddPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
            </div>

            {/* Description */}
            {packet.description && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Mô tả</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {packet.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
