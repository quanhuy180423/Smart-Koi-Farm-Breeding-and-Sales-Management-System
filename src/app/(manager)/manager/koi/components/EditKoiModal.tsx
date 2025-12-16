"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Upload, Play, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import {
  KoiFishResponse,
  KoiFishUpdateRequest,
  SaleStatus,
  HealthStatus,
  Gender,
  KoiType,
} from "@/lib/api/services/fetchKoiFish";
import { useUpdateKoiFish } from "@/hooks/useKoiFish";
import { parseSizeToNumber } from "@/lib/utils/numbers/parseSize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";
import VarietySelectionDialog from "@/components/manager/VarietySelectionDialog";
import PatternSelectionDialog from "@/components/manager/PatternSelectionDialog";
import Image from "next/image";
import { useUploadImage, useUploadVideo } from "@/hooks/useUploadFile";

interface EditKoiModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  koi: KoiFishResponse | null;
}

export function EditKoiModal({ isOpen, onOpenChange, koi }: EditKoiModalProps) {
  const [formData, setFormData] = useState<Partial<KoiFishUpdateRequest>>({});
  const [birthDateInput, setBirthDateInput] = useState<string>("");
  const [selectedVarietyName, setSelectedVarietyName] = useState<
    string | undefined
  >();
  const [isVarietyDialogOpen, setIsVarietyDialogOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPatternDialogOpen, setIsPatternDialogOpen] = useState(false);
  const { mutate: updateKoiFish, isPending } = useUpdateKoiFish();
  const uploadImageMutation = useUploadImage();
  const uploadVideoMutation = useUploadVideo();
  const handleSelectPattern = (patternId: number, patternName: string) => {
    setFormData((prev) => ({ ...prev, pattern: patternName }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pattern;
      return next;
    });
    setIsPatternDialogOpen(false);
  };

  useEffect(() => {
    if (koi) {
      const birthDate = koi.birthDate ?? "";
      setBirthDateInput(birthDate);
      setSelectedVarietyName(koi.variety.varietyName);
      setImagePreviews(koi.images || []);
      setVideoPreviews(koi.videos || []);
      setSelectedImageFiles([]);
      setSelectedVideoFiles([]);
      setFormData({
        rfid: koi.rfid,
        pondId: koi.pond.id,
        varietyId: koi.variety.id,
        breedingProcessId: koi.breedingProcess?.id ?? undefined,
        size: parseSizeToNumber(koi.size),
        type: koi.type,
        pattern: koi.pattern ?? "",
        birthDate: birthDate,
        gender: koi.gender,
        healthStatus: koi.healthStatus,
        saleStatus: koi.saleStatus,
        origin: koi.origin ?? "",
        images: koi.images || [],
        videos: koi.videos || [],
        sellingPrice: koi.sellingPrice ?? 0,
        description: koi.description || "",
        isMutated: koi.isMutated ?? false,
        mutationDescription: koi.mutationDescription ?? "",
      });
    }
  }, [koi, isOpen]);

  const handleBirthDateChange = (dateString: string) => {
    setBirthDateInput(dateString);
    setFormData((prev) => ({ ...prev, birthDate: dateString }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.birthDate;
      return next;
    });
  };

  const handleSelectVariety = (varietyId: number, varietyName: string) => {
    setFormData((prev) => ({ ...prev, varietyId }));
    setSelectedVarietyName(varietyName);
    setIsVarietyDialogOpen(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.varietyId;
      return next;
    });
  };

  const handleImageSelect = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newPreviews = imageFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const previewUrls = await Promise.all(newPreviews);
    setSelectedImageFiles((prev) => [...prev, ...imageFiles]);
    setImagePreviews((prev) => [...prev, ...previewUrls]);
  };

  const handleVideoSelect = async (files: FileList) => {
    const videoFiles = Array.from(files).filter((file) =>
      file.type.startsWith("video/")
    );

    const newPreviews = videoFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const previewUrls = await Promise.all(newPreviews);
    setSelectedVideoFiles((prev) => [...prev, ...videoFiles]);
    setVideoPreviews((prev) => [...prev, ...previewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // Reset input để có thể chọn lại cùng file
    const input = document.getElementById(
      "image-input-koi"
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleRemoveVideo = (index: number) => {
    setSelectedVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    // Reset input để có thể chọn lại cùng file
    const input = document.getElementById(
      "video-input-koi"
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.birthDate) {
      newErrors.birthDate = "Vui lòng chọn ngày sinh";
    }
    if (!formData.varietyId) {
      newErrors.varietyId = "Vui lòng chọn giống";
    }
    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }
    if (!formData.healthStatus) {
      newErrors.healthStatus = "Vui lòng chọn tình trạng sức khỏe";
    }
    if (!formData.size || formData.size <= 0) {
      newErrors.size = "Vui lòng nhập kích thước hợp lệ";
    }
    if (!formData.type) {
      newErrors.type = "Vui lòng chọn loại cá";
    }
    if (!formData.pattern?.trim()) {
      newErrors.pattern = "Vui lòng nhập hoa văn";
    }
    if (!formData.origin?.trim()) {
      newErrors.origin = "Vui lòng nhập nguồn gốc";
    }
    if (!formData.saleStatus) {
      newErrors.saleStatus = "Vui lòng chọn trạng thái bán";
    }
    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "Vui lòng nhập giá bán lớn hơn 0";
    }
    if (formData.isMutated && !formData.mutationDescription?.trim()) {
      newErrors.mutationDescription = "Vui lòng mô tả đột biến";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!koi) return;

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      // Upload new images
      const uploadedImageUrls: string[] = [];
      for (const file of selectedImageFiles) {
        try {
          const result = await uploadImageMutation.mutateAsync({
            file,
          });
          if (result?.url) {
            uploadedImageUrls.push(result.url);
          }
        } catch {}
      }

      // Upload new videos
      const uploadedVideoUrls: string[] = [];
      for (const file of selectedVideoFiles) {
        try {
          const result = await uploadVideoMutation.mutateAsync({
            file,
          });
          if (result?.url) {
            uploadedVideoUrls.push(result.url);
          }
        } catch {}
      }

      // Filter existing images and videos (URLs from server, not base64)
      const existingImages = imagePreviews.filter(
        (preview) =>
          preview.startsWith("http://") || preview.startsWith("https://")
      );

      const existingVideos = videoPreviews.filter(
        (preview) =>
          preview.startsWith("http://") || preview.startsWith("https://")
      );

      // Combine: existing + newly uploaded
      const finalImages = [...existingImages, ...uploadedImageUrls];
      const finalVideos = [...existingVideos, ...uploadedVideoUrls];

      const updateRequest: KoiFishUpdateRequest = {
        ...formData,
        images: finalImages,
        videos: finalVideos,
      } as KoiFishUpdateRequest;

      updateKoiFish(
        {
          id: koi.id,
          request: updateRequest,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật cá");
    } finally {
      setIsSaving(false);
    }
  };

  if (!koi) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Chỉnh sửa thông tin cá
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết của cá Koi: {koi.rfid}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* RFID Section */}
            <div className="space-y-2">
              <Label htmlFor="rfid" className="text-sm font-semibold">
                RFID *
              </Label>
              <Input
                id="rfid"
                value={formData.rfid || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rfid: e.target.value }))
                }
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">RFID không thể thay đổi</p>
            </div>

            {/* Variety and Birth Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Variety - Editable with Selection Dialog */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Giống *</Label>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-full"
                  onClick={() => setIsVarietyDialogOpen(true)}
                >
                  {selectedVarietyName || "Chọn giống"}
                </Button>
                {errors.varietyId && (
                  <p className="text-xs text-red-500">{errors.varietyId}</p>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <DatePickerFilter
                  label="Ngày sinh *"
                  value={birthDateInput}
                  onChange={handleBirthDateChange}
                  maxDate={new Date()}
                />
                {errors.birthDate && (
                  <p className="text-xs text-red-500">{errors.birthDate}</p>
                )}
              </div>
            </div>

            {/* Gender and Health Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Giới tính *</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: value as Gender,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.gender;
                      return next;
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Đực</SelectItem>
                    <SelectItem value="Female">Cái</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-red-500">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Tình trạng sức khỏe *
                </Label>
                <Select
                  value={formData.healthStatus || ""}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      healthStatus: value as HealthStatus,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.healthStatus;
                      return next;
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tình trạng sức khỏe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthy">Khỏe mạnh</SelectItem>
                    <SelectItem value="Sick">Bệnh</SelectItem>
                    <SelectItem value="Warning">Cảnh báo</SelectItem>
                    <SelectItem value="Dead">Chết</SelectItem>
                  </SelectContent>
                </Select>
                {errors.healthStatus && (
                  <p className="text-xs text-red-500">{errors.healthStatus}</p>
                )}
              </div>
            </div>

            {/* Size and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Kích thước (cm) *
                </Label>
                <InputNumber
                  value={formData.size ? Number(formData.size) : undefined}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      size: value || 0,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.size;
                      return next;
                    });
                  }}
                  placeholder="Nhập kích thước"
                  allowDecimal={true}
                  decimalPlaces={2}
                />
                {errors.size && (
                  <p className="text-xs text-red-500">{errors.size}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Loại cá *</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: value as KoiType,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.type;
                      return next;
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại cá" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(KoiType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-red-500">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Pattern and Origin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Hoa văn</Label>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-full"
                  onClick={() => setIsPatternDialogOpen(true)}
                >
                  {formData.pattern || "Chọn hoa văn"}
                </Button>
                {errors.pattern && (
                  <p className="text-xs text-red-500">{errors.pattern}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nguồn gốc</Label>
                <Input
                  value={formData.origin || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      origin: e.target.value,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.origin;
                      return next;
                    });
                  }}
                  placeholder="Nhập nguồn gốc"
                />
                {errors.origin && (
                  <p className="text-xs text-red-500">{errors.origin}</p>
                )}
              </div>
            </div>

            {/* Sale Status and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Trạng thái bán *
                </Label>
                <Select
                  value={formData.saleStatus || ""}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      saleStatus: value as SaleStatus,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.saleStatus;
                      return next;
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NotForSale">Không bán</SelectItem>
                    <SelectItem value="Available">Có sẵn</SelectItem>
                    <SelectItem value="Reserved">Đã đặt</SelectItem>
                    <SelectItem value="Sold">Đã bán</SelectItem>
                  </SelectContent>
                </Select>
                {errors.saleStatus && (
                  <p className="text-xs text-red-500">{errors.saleStatus}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Giá bán</Label>
                <InputNumber
                  value={
                    formData.sellingPrice
                      ? Number(formData.sellingPrice)
                      : undefined
                  }
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      sellingPrice: value || 0,
                    }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.sellingPrice;
                      return next;
                    });
                  }}
                  placeholder="Nhập giá bán"
                  allowDecimal={true}
                  decimalPlaces={2}
                />
                {errors.sellingPrice && (
                  <p className="text-xs text-red-500">{errors.sellingPrice}</p>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Hình Ảnh (Kéo thả hoặc nhấp để chọn)</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    handleImageSelect(e.dataTransfer.files);
                  }
                }}
                onClick={() =>
                  document.getElementById("image-input-koi")?.click()
                }
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Kéo thả hình ảnh vào đây</p>
                <p className="text-xs text-muted-foreground mt-1">
                  hoặc nhấp để chọn từ máy
                </p>
              </div>
              <input
                id="image-input-koi"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.currentTarget.files) {
                    handleImageSelect(e.currentTarget.files);
                  }
                }}
              />

              {imagePreviews.length > 0 && (
                <div className="space-y-2">
                  <Label>Hình Ảnh Xem Trước ({imagePreviews.length})</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border"
                      >
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                          loading="lazy"
                          width={300}
                          height={200}
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload Section */}
            <div className="space-y-2">
              <Label>Video (Kéo thả hoặc nhấp để chọn)</Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    handleVideoSelect(e.dataTransfer.files);
                  }
                }}
                onClick={() =>
                  document.getElementById("video-input-koi")?.click()
                }
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Kéo thả video vào đây</p>
                <p className="text-xs text-muted-foreground mt-1">
                  hoặc nhấp để chọn từ máy
                </p>
              </div>
              <input
                id="video-input-koi"
                type="file"
                multiple
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.currentTarget.files) {
                    handleVideoSelect(e.currentTarget.files);
                  }
                }}
              />

              {videoPreviews.length > 0 && (
                <div className="space-y-2">
                  <Label>Video Xem Trước ({videoPreviews.length})</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {videoPreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border bg-black"
                      >
                        <video
                          src={preview}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white opacity-70" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          className="absolute top-2 right-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mutation Section */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-3 p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    id="isMutated"
                    checked={formData.isMutated || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isMutated: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 cursor-pointer accent-amber-600 rounded border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  />
                  <Label
                    htmlFor="isMutated"
                    className="font-semibold cursor-pointer text-amber-900 hover:text-amber-800 transition-colors"
                  >
                    Cá bị đột biến
                  </Label>
                </div>
              </div>

              {formData.isMutated && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label
                    htmlFor="mutationDesc"
                    className="text-sm font-semibold text-amber-900 flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Mô tả đột biến *
                  </Label>
                  <Textarea
                    id="mutationDesc"
                    value={formData.mutationDescription || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        mutationDescription: e.target.value,
                      }));
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.mutationDescription;
                        return next;
                      });
                    }}
                    placeholder="Mô tả chi tiết về đột biến..."
                    className="min-h-20 border-amber-200 focus:border-amber-400 focus:ring-amber-400 bg-amber-50/50"
                  />
                  {errors.mutationDescription && (
                    <p className="text-xs text-red-500">
                      {errors.mutationDescription}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả thêm về cá..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isSaving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isPending || isSaving}>
              {isPending || isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variety Selection Dialog */}
      <VarietySelectionDialog
        isOpen={isVarietyDialogOpen}
        onOpenChange={setIsVarietyDialogOpen}
        onSelect={handleSelectVariety}
        initialSelectedId={formData.varietyId}
      />
      <PatternSelectionDialog
        isOpen={isPatternDialogOpen}
        onOpenChange={setIsPatternDialogOpen}
        onSelect={handleSelectPattern}
        varietyId={(formData.varietyId as number) ?? null}
        initialSelectedId={undefined}
      />
    </>
  );
}
