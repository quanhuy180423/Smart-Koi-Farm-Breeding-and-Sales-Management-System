"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Play,
  Calendar,
  MapPin,
  Heart,
  Activity,
  Eye,
  Fish,
  Droplet,
  TrendingUp,
  AlertCircle,
  Info,
  DollarSign,
  FileText,
} from "lucide-react";
import { formatKoiAge } from "@/lib/utils/dates/age";
import {
  getFishSizeLabel,
  getGenderLabel,
  getHealthStatusLabel,
  getSaleStatusLabel,
  getKoiBreedingStatusLabel,
  getBreedingStatusLabel,
} from "@/lib/utils/enum";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates/formatDate";
import { KoiImageViewer } from "./KoiImageViewer";
import { useGetKoiBreedingHistory } from "@/hooks/useKoiFish";
import { cn } from "@/lib/utils";

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
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);

  const {
    data: breedingHistory,
    isLoading: isLoadingBreedingHistory,
    isError: isErrorBreedingHistory,
  } = useGetKoiBreedingHistory(koi?.id);

  const mediaList: MediaItem[] = useMemo(() => {
    if (!koi) return [];
    const combined: MediaItem[] = [];
    if (koi.images?.length > 0) {
      koi.images.forEach((img, idx) => {
        combined.push({ type: "image", src: img, index: idx });
      });
    }
    if (koi.videos?.length > 0) {
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
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            if (isImageViewerOpen || isVideoViewerOpen) e.preventDefault();
          }}
        >
          {/* Header */}
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-primary">
                  {koi.variety.varietyName}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    RFID: {koi.rfid}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="breeding">Lịch sử sinh sản</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              {/* Media Gallery */}
              {mediaList.length > 0 && currentMedia && (
                <div className="space-y-3">
                  {isCurrentImage ? (
                    <div
                      onClick={() => setIsImageViewerOpen(true)}
                      className="relative w-full h-64 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group hover:border-primary transition-all"
                    >
                      <Image
                        src={currentMedia.src}
                        alt={`Ảnh ${currentMedia.index + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-lg">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Xem chi tiết
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsVideoViewerOpen(true)}
                      className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-300 cursor-pointer group hover:border-primary transition-all"
                    >
                      <video
                        src={currentMedia.src}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <div className="opacity-100 bg-white/90 px-4 py-2 rounded-lg">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Xem video
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {mediaList.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {mediaList.map((media, idx) => (
                        <button
                          key={`${media.type}-${media.index}`}
                          onClick={() => {
                            setSelectedMediaIdx(idx);
                            if (media.type === "image")
                              setIsImageViewerOpen(true);
                            else setIsVideoViewerOpen(true);
                          }}
                          className={cn(
                            "shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                            selectedMediaIdx === idx
                              ? "border-primary ring-2 ring-primary/20 scale-105"
                              : "border-gray-300 hover:border-primary/50",
                          )}
                        >
                          {media.type === "image" ? (
                            <Image
                              src={media.src}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <>
                              <video
                                src={media.src}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white drop-shadow-lg" />
                              </div>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">Tuổi</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatKoiAge(koi.birthDate)}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="h-4 w-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">
                      Kích thước
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {getFishSizeLabel(koi.size)}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">
                      Sức khỏe
                    </p>
                  </div>
                  <Badge className={cn("text-xs", healthStatusInfo.colorClass)}>
                    {healthStatusInfo.label}
                  </Badge>
                </div>
              </div>

              {/* Detailed Info Section */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-gray-600" />
                    <h4 className="font-semibold">Thông tin cơ bản</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <InfoRow
                      label="Ngày sinh"
                      value={formatDate(
                        koi.birthDate,
                        DATE_FORMATS.MEDIUM_DATE,
                      )}
                    />
                    <InfoRow
                      label="Giới tính"
                      value={getGenderLabel(koi.gender).label}
                    />
                    <InfoRow label="Loại cá" value={koi.type} />
                    <InfoRow
                      label="Hoa văn"
                      value={koi.pattern || "Không xác định"}
                    />
                  </div>
                </div>

                {/* Location & Origin */}
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <h4 className="font-semibold">Vị trí & Nguồn gốc</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <InfoRow label="Hồ nước" value={koi.pond.pondName} />
                    <InfoRow
                      label="Xuất xứ"
                      value={koi.origin || koi.variety.originCountry}
                    />
                    <InfoRow
                      label="Giống loại"
                      value={koi.variety.varietyName}
                    />
                  </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {koi.saleStatus && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-600" />
                          <p className="text-xs font-medium text-gray-600">
                            Trạng thái bán
                          </p>
                        </div>
                        <Badge
                          className={
                            getSaleStatusLabel(koi.saleStatus).colorClass
                          }
                        >
                          {getSaleStatusLabel(koi.saleStatus).label}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {koi.koiBreedingStatus && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-600" />
                          <p className="text-xs font-medium text-gray-600">
                            Sinh sản
                          </p>
                        </div>
                        <Badge
                          className={
                            getKoiBreedingStatusLabel(koi.koiBreedingStatus)
                              .colorClass
                          }
                        >
                          {
                            getKoiBreedingStatusLabel(koi.koiBreedingStatus)
                              .label
                          }
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mutation Info */}
                {koi.isMutated && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      <h4 className="font-semibold">Thông tin đột biến</h4>
                    </div>
                    {koi.mutationDescription && (
                      <p className="text-sm text-gray-700 italic">
                        {koi.mutationDescription}
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                {koi.description && (
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <h4 className="font-semibold">Mô tả</h4>
                    </div>
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      {koi.description}
                    </p>
                  </div>
                )}

                {/* Pricing */}
                {showPricingInfo && (
                  <div className="p-5 bg-gray-50 rounded-xl border border-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold text-lg">Giá bán</span>
                      </div>
                      <span className="text-3xl font-bold text-primary">
                        {formatCurrency(koi.sellingPrice || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="breeding" className="space-y-4 mt-4">
              {isLoadingBreedingHistory ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                  <p className="text-sm text-gray-500">Đang tải...</p>
                </div>
              ) : isErrorBreedingHistory ? (
                <div className="text-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Không thể tải lịch sử sinh sản
                  </p>
                </div>
              ) : !breedingHistory?.breedingHistory?.length ? (
                <div className="text-center py-16">
                  <Droplet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Chưa có lịch sử sinh sản</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {breedingHistory.breedingHistory.map((item) => (
                    <div
                      key={item.breedingProcessId}
                      className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg">
                            Quy trình {item.code}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(
                              item.startDate,
                              DATE_FORMATS.MEDIUM_DATE,
                            )}
                            {item.endDate &&
                              ` - ${formatDate(item.endDate, DATE_FORMATS.MEDIUM_DATE)}`}
                          </p>
                        </div>
                        <Badge
                          className={
                            getBreedingStatusLabel(item.status).colorClass
                          }
                        >
                          {getBreedingStatusLabel(item.status).label}
                        </Badge>
                      </div>

                      {/* Partner */}
                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Cá phối giống
                        </p>
                        <div className="flex items-center gap-3">
                          {item.partner.images?.[0] && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200">
                              <Image
                                src={item.partner.images[0]}
                                alt={item.partner.rfid}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm">
                              {item.partner.rfid}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.partner.varietyName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <StatCard
                          label="Tổng trứng"
                          value={item.totalEggs.toLocaleString()}
                        />
                        <StatCard
                          label="Thụ tinh"
                          value={`${item.fertilizationRate?.toFixed(1) || 0}%`}
                        />
                        <StatCard
                          label="Nở trứng"
                          value={`${item.hatchingRate?.toFixed(1) || 0}%`}
                        />
                        <StatCard
                          label="Sống sót"
                          value={`${item.survivalRate?.toFixed(1) || 0}%`}
                        />
                        <StatCard
                          label="Cá đủ tiêu chuẩn"
                          value={item.totalFishQualified.toLocaleString()}
                        />
                        <StatCard
                          label="Đột biến"
                          value={`${item.mutationRate?.toFixed(1) || 0}%`}
                        />
                        <StatCard
                          label="Tổng gói"
                          value={item.totalPackage.toLocaleString()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {onSelectFish && (
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => onOpenChange(false)}
                disabled={isSelectLoading}
                className="flex-1 px-4 py-2.5 font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                onClick={() => onSelectFish(koi)}
                disabled={isSelectLoading}
                className="flex-1 px-4 py-2.5 font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
            if (imagePosition !== -1) setSelectedMediaIdx(imagePosition);
          }}
          rfid={koi.rfid}
        />
      )}
      {mediaList.length > 0 && (
        <Dialog open={isVideoViewerOpen} onOpenChange={setIsVideoViewerOpen}>
          <DialogPortal>
            <DialogOverlay className="z-100" />
            <DialogPrimitive.Content className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-0 rounded-lg border p-0 shadow-lg duration-200 max-h-[95vh] flex flex-col overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 z-100">
              <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-primary/90 to-primary border-b border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogPrimitive.Title className="text-lg font-bold text-white">
                      Video Cá Koi
                    </DialogPrimitive.Title>
                    <p className="text-xs text-white/80 font-medium">
                      RFID: {koi.rfid}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full flex items-center justify-center p-6 bg-linear-to-br from-gray-900 via-black to-gray-900">
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    src={mediaList[selectedMediaIdx]?.src}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[75vh] rounded-lg shadow-2xl ring-2 ring-white/10"
                  />
                </div>
              </div>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      )}
    </>
  );
}

// Helper Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-2 bg-white rounded-lg border text-center">
    <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
    <p className="font-bold text-sm">{value}</p>
  </div>
);
