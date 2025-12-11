"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play } from "lucide-react";
import { formatKoiAge } from "@/lib/utils/dates/age";
import {
  getFishSizeLabel,
  getGenderLabel,
  getHealthStatusLabel,
  getSaleStatusLabel,
  getKoiBreedingStatusLabel,
} from "@/lib/utils/enum";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates/formatDate";
import { KoiImageViewer } from "./KoiImageViewer";
import { useGetKoiBreedingHistory } from "@/hooks/useKoiFish";
import { getBreedingStatusLabel } from "@/lib/utils/enum";

interface KoiDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  koi: KoiFishResponse | null;
  showPricingInfo?: boolean;
  onSelectFish?: (fish: KoiFishResponse) => void;
  onSelectLabel?: string;
  isSelectLoading?: boolean;
}

type MediaItem = {
  type: "image" | "video";
  src: string;
  index: number;
};

export function KoiDetailDialog({
  isOpen,
  onOpenChange,
  koi,
  showPricingInfo = true,
  onSelectFish,
  onSelectLabel = "Chọn cá này",
  isSelectLoading = false,
}: KoiDetailDialogProps) {
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Fetch breeding history
  const {
    data: breedingHistory,
    isLoading: isLoadingBreedingHistory,
    isError: isErrorBreedingHistory,
  } = useGetKoiBreedingHistory(koi?.id);

  // Combine images and videos into one list
  const mediaList: MediaItem[] = useMemo(() => {
    if (!koi) return [];

    const combined: MediaItem[] = [];

    if (koi.images && koi.images.length > 0) {
      koi.images.forEach((img, idx) => {
        combined.push({ type: "image", src: img, index: idx });
      });
    }

    if (koi.videos && koi.videos.length > 0) {
      koi.videos.forEach((vid, idx) => {
        combined.push({ type: "video", src: vid, index: idx });
      });
    }

    return combined;
  }, [koi]);

  if (!koi) return null;

  const healthStatusInfo = getHealthStatusLabel(koi.healthStatus);

  const currentMedia = mediaList[selectedMediaIdx];
  const isCurrentImage = currentMedia?.type === "image";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            if (isImageViewerOpen) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">
                {koi.variety.varietyName}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                RFID: {koi.rfid} • Giống: {koi.variety.varietyName}
              </DialogDescription>
            </div>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="breeding">Lịch sử sinh sản</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              {/* Combined Media Gallery */}
              {mediaList.length > 0 && (
                <div className="space-y-2">
                  {/* Main Media Display */}
                  {isCurrentImage ? (
                    <div
                      onClick={() => setIsImageViewerOpen(true)}
                      className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border cursor-pointer group hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={currentMedia.src}
                        alt={`Ảnh ${currentMedia.index + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm font-semibold">
                            Nhấn để xem to hơn
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border">
                      <video
                        src={currentMedia.src}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                  )}

                  {/* Combined Media Thumbnails */}
                  {mediaList.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {mediaList.map((media, idx) => (
                        <button
                          key={`${media.type}-${media.index}`}
                          onClick={() => setSelectedMediaIdx(idx)}
                          className={`shrink-0 relative w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                            selectedMediaIdx === idx
                              ? "border-primary"
                              : "border-gray-300 hover:border-primary"
                          }`}
                          title={`${media.type === "image" ? "Ảnh" : "Video"} ${media.index + 1}`}
                        >
                          {media.type === "image" ? (
                            <Image
                              src={media.src}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <>
                              <video
                                src={media.src}
                                className="w-full h-full object-cover"
                              />
                              <Play className="absolute h-3 w-3 text-white drop-shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Physical & Basic Info Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-muted-foreground mb-3">
                  Thông tin cơ bản
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">RFID:</span>
                      <span className="font-semibold text-primary">
                        {koi.rfid}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Tuổi:</span>
                      <span className="font-medium">
                        {formatKoiAge(koi.birthDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Ngày sinh:
                      </span>
                      <span className="font-medium">
                        {formatDate(koi.birthDate, DATE_FORMATS.MEDIUM_DATE)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Giới tính:
                      </span>
                      <span className="font-medium">
                        {getGenderLabel(koi.gender).label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Loại cá:
                      </span>
                      <span className="font-medium">{koi.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics & Location - Side by Side */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Physical Characteristics */}
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-3">
                      Đặc điểm vật lý
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Kích thước:
                        </span>
                        <span className="font-medium">
                          {getFishSizeLabel(koi.size)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Hoa văn:
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {koi.pattern || "Không xác định"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Sức khỏe:
                        </span>
                        <Badge
                          className={`font-semibold text-xs ${healthStatusInfo.colorClass}`}
                        >
                          {healthStatusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Location & Origin */}
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-3">
                      Vị trí & Nguồn gốc
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Hồ nước:
                        </span>
                        <span className="font-medium">{koi.pond.pondName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Xuất xứ:
                        </span>
                        <span className="font-medium">
                          {koi.origin || koi.variety.originCountry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Giống loại:
                        </span>
                        <span className="font-medium">
                          {koi.variety.varietyName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sale Status & Breeding Status Section */}
              <div className="border-t pt-4">
                <div className="space-y-3">
                  {koi.saleStatus && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-muted-foreground">
                        Trạng thái bán hàng:
                      </span>
                      <Badge
                        className={`font-semibold text-xs ${getSaleStatusLabel(koi.saleStatus).colorClass}`}
                      >
                        {getSaleStatusLabel(koi.saleStatus).label}
                      </Badge>
                    </div>
                  )}
                  {koi.koiBreedingStatus && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-muted-foreground">
                        Trạng thái sinh sản:
                      </span>
                      <Badge
                        className={`font-semibold text-xs ${getKoiBreedingStatusLabel(koi.koiBreedingStatus).colorClass}`}
                      >
                        {getKoiBreedingStatusLabel(koi.koiBreedingStatus).label}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Breeding Process Info */}
              {koi.breedingProcess && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-3">
                    Quy trình sinh sản
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên quy trình:</span>
                      <span className="font-medium">
                        {koi.breedingProcess.processName}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mutation Info */}
              {koi.isMutated && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-3">
                    Thông tin đột biến
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đột biến:</span>
                      <Badge variant="destructive" className="text-xs">
                        Có
                      </Badge>
                    </div>
                    {koi.mutationDescription && (
                      <div>
                        <p className="text-gray-600 mb-1">Mô tả:</p>
                        <p className="font-medium text-sm italic text-gray-700">
                          {koi.mutationDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {koi.description && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-2">
                    Mô tả
                  </h4>
                  <p className="text-sm text-gray-700 italic">
                    {koi.description}
                  </p>
                </div>
              )}

              {/* Price and Info */}
              {showPricingInfo && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-3">
                    Giá bán
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(koi.sellingPrice || 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-muted-foreground mb-3">
                  Thông tin hệ thống
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Ngày tạo:</p>
                    <p>{formatDate(koi.createdAt, DATE_FORMATS.MEDIUM_DATE)}</p>
                  </div>
                  {koi.updatedAt && (
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Cập nhật lần cuối:
                      </p>
                      <p>
                        {formatDate(koi.updatedAt, DATE_FORMATS.MEDIUM_DATE)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="breeding" className="space-y-4 mt-4">
              {isLoadingBreedingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isErrorBreedingHistory ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Không thể tải lịch sử sinh sản</p>
                </div>
              ) : !breedingHistory?.breedingHistory ||
                breedingHistory.breedingHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Chưa có lịch sử sinh sản</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {breedingHistory.breedingHistory.map((item) => (
                    <div
                      key={item.breedingProcessId}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-base">
                            Quy trình {item.code}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(
                              item.startDate,
                              DATE_FORMATS.MEDIUM_DATE,
                            )}
                            {item.endDate &&
                              ` - ${formatDate(item.endDate, DATE_FORMATS.MEDIUM_DATE)}`}
                          </p>
                        </div>
                        <Badge
                          className={`${getBreedingStatusLabel(item.status).colorClass}`}
                        >
                          {getBreedingStatusLabel(item.status).label}
                        </Badge>
                      </div>

                      {/* Partner Info */}
                      <div className="border-t pt-3">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                          Cá đối tác
                        </h5>
                        <div className="flex items-center gap-3">
                          {item.partner.images &&
                            item.partner.images.length > 0 && (
                              <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                <Image
                                  src={item.partner.images[0]}
                                  alt={item.partner.rfid}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.partner.rfid} - {item.partner.varietyName}
                            </p>
                            {item.partner.isMutated && (
                              <Badge
                                variant="destructive"
                                className="text-xs mt-1"
                              >
                                Đột biến
                                {item.partner.mutationDescription &&
                                  `: ${item.partner.mutationDescription}`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="border-t pt-3">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                          Thống kê
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tổng trứng:</span>
                            <span className="font-medium">
                              {item?.totalEggs.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Tỷ lệ thụ tinh:
                            </span>
                            <span className="font-medium">
                              {item?.fertilizationRate?.toFixed(2) || 0}%
                            </span>
                          </div>
                          {item?.hatchingRate !== null && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tỷ lệ nở:</span>
                              <span className="font-medium">
                                {item?.hatchingRate?.toFixed(2) || 0}%
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tỷ lệ sống:</span>
                            <span className="font-medium">
                              {item?.survivalRate?.toFixed(2) || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cá đạt chuẩn:</span>
                            <span className="font-medium">
                              {item?.totalFishQualified.toLocaleString()}
                            </span>
                          </div>
                          {item?.mutationRate !== null && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Tỷ lệ đột biến:
                              </span>
                              <span className="font-medium">
                                {item?.mutationRate?.toFixed(2) || 0}%
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số gói:</span>
                            <span className="font-medium">
                              {item?.totalPackage.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {onSelectFish && (
            <div className="flex gap-2 pt-4 border-t mt-4">
              <button
                onClick={() => onOpenChange(false)}
                disabled={isSelectLoading}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Quay lại
              </button>
              <button
                onClick={() => onSelectFish(koi)}
                disabled={isSelectLoading}
                className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSelectLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {onSelectLabel}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer - for images only */}
      {koi.images && koi.images.length > 0 && (
        <KoiImageViewer
          isOpen={isImageViewerOpen}
          onOpenChange={setIsImageViewerOpen}
          images={koi.images}
          selectedImageIdx={koi.images.indexOf(
            (mediaList[selectedMediaIdx]?.src || "") as never,
          )}
          onImageIdxChange={(idx) => {
            const imagePosition = mediaList.findIndex(
              (m) => m.type === "image" && m.index === idx,
            );
            if (imagePosition !== -1) {
              setSelectedMediaIdx(imagePosition);
            }
          }}
          rfid={koi.rfid}
        />
      )}
    </>
  );
}
