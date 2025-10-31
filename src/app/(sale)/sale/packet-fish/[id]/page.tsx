"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useGetPacketFishById } from "@/hooks/usePacketFish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Package,
  Ruler,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Play,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { getFishSizeLabel } from "@/lib/utils/enum";
import { useState } from "react";

export default function PacketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: packet, isLoading, error } = useGetPacketFishById(id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Đang tải chi tiết gói bán...</p>
        </div>
      </div>
    );
  }

  if (error || !packet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertTriangle className="h-12 w-12 text-red-600" />
        <p className="text-red-600 font-semibold">
          {(error as Error)?.message || "Không thể tải chi tiết gói bán"}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Section */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              {packet.images && packet.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={packet.images[selectedImageIdx]}
                      alt={`${packet.name} - Ảnh ${selectedImageIdx + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {packet.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {packet.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Videos Section */}
          {packet.video && packet.video.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Video</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Video */}
                <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                  <video
                    src={packet.video[selectedVideoIdx]}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>

                {/* Video Thumbnails */}
                {packet.video.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {packet.video.map((vid, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVideoIdx(idx)}
                        className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 bg-muted flex items-center justify-center transition-colors ${
                          selectedVideoIdx === idx
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <video
                          src={vid}
                          className="w-full h-full object-cover"
                        />
                        <Play className="absolute h-6 w-6 text-white drop-shadow-lg" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Mô tả</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {packet.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Title & Status */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                  {packet.name}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  {packet.isAvailable ? (
                    <Badge className="bg-green-600">Có sẵn</Badge>
                  ) : (
                    <Badge variant="secondary">Hết hàng</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Thông tin</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Size */}
              <div className="flex items-start gap-3 pb-4 border-b">
                <Ruler className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Kích cỡ</p>
                  <p className="font-semibold">
                    {getFishSizeLabel(packet.size)}
                  </p>
                </div>
              </div>

              {/* Age */}
              <div className="flex items-start gap-3 pb-4 border-b">
                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Tuổi</p>
                  <p className="font-semibold">{packet.ageMonths} tháng</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-start gap-3 pb-4 border-b">
                <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Số lượng</p>
                  <p className="font-semibold">{packet.quantity} con</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Giá bán</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(packet.totalPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          {packet.varietyPacketFishes &&
            packet.varietyPacketFishes.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Giống cá</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {packet.varietyPacketFishes.map((variety) => (
                      <Badge key={variety.id} variant="secondary">
                        {variety.varietyName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Created/Updated Date */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs">Ngày tạo</p>
                <p>{new Date(packet.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-xs">Cập nhật lần cuối</p>
                <p>{new Date(packet.updatedAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
