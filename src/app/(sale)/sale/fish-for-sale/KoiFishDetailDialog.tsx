"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ruler,
  Package,
  Tag,
  DollarSign,
  Activity,
  Play,
} from "lucide-react";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import {
  getFishSizeLabel,
  getGenderLabel,
  getHealthStatusLabel,
} from "@/lib/utils/enum";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import getAge from "@/lib/utils/dates/age";

interface KoiFishDetailDialogProps {
  koi: KoiFishResponse;
  onClose: () => void;
  onSelect?: (koi: KoiFishResponse) => void;
  isSelectLoading?: boolean;
}

export function KoiFishDetailDialog({
  koi,
  onClose,
  onSelect,
  isSelectLoading = false,
}: KoiFishDetailDialogProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const genderInfo = getGenderLabel(koi.gender);
  const healthStatusInfo = getHealthStatusLabel(koi.healthStatus);

  return (
    <DialogContent className="!max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
      <DialogHeader>
        <DialogTitle className="text-2xl">{koi.rfid}</DialogTitle>
        <DialogDescription>
          {koi.variety.varietyName} - {koi.origin}
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto -mx-6 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {koi.images && koi.images.length > 0 && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  {/* Main Image */}
                  <div className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={koi.images[selectedImageIdx]}
                      alt={`${koi.rfid} - Ảnh ${selectedImageIdx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Thumbnails */}
                  {koi.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {koi.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
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
                </CardContent>
              </Card>
            )}

            {/* Videos */}
            {koi.videos && koi.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Video</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Video */}
                  <div className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
                    <video
                      src={koi.videos[selectedVideoIdx]}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>

                  {/* Video Thumbnails */}
                  {koi.videos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {koi.videos.map((vid, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVideoIdx(idx)}
                          className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 bg-muted flex items-center justify-center transition-colors ${
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
            {koi.description && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Mô tả</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {koi.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Details Grid - Horizontal Layout */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* RFID */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">RFID</p>
                    <p className="font-mono text-sm font-semibold">
                      {koi.rfid}
                    </p>
                  </div>
                  {/* Fish Type */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Loại cá
                    </p>
                    <p className="font-semibold text-sm">{koi.type}</p>
                  </div>
                  {/* Body Shape */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Hình dạng
                    </p>
                    <p className="font-semibold text-sm">{koi.bodyShape}</p>
                  </div>
                  {/* Current Location */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Vị trí hiện tại
                    </p>
                    <p className="font-semibold text-sm">{koi.pond.pondName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Key Info Grid */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* Age */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Tuổi</p>
                    <p className="font-semibold">{getAge(koi.birthDate)}</p>
                  </div>
                </div>

                {/* Size */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Ruler className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Kích cỡ</p>
                    <p className="font-semibold">
                      {getFishSizeLabel(koi.size)}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Package className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Giới tính</p>
                    <p className={`font-semibold ${genderInfo.colorClass}`}>
                      {genderInfo.label}
                    </p>
                  </div>
                </div>

                {/* Origin */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Tag className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Nguồn gốc</p>
                    <p className="font-semibold">{koi.origin}</p>
                  </div>
                </div>

                {/* Health Status */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Activity className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Sức khỏe</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs mt-1 ${healthStatusInfo.colorClass}`}
                    >
                      {healthStatusInfo.label}
                    </Badge>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Giá bán</p>
                    <p className="font-bold text-lg text-primary">
                      {formatCurrency(koi.sellingPrice || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Actions - Only show if onSelect is provided */}
      {onSelect && (
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSelectLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={() => onSelect(koi)}
            disabled={isSelectLoading}
            className="flex-1"
          >
            {isSelectLoading ? (
              <>
                <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                Đang chọn...
              </>
            ) : (
              "Chọn cá này"
            )}
          </Button>
        </div>
      )}
    </DialogContent>
  );
}
