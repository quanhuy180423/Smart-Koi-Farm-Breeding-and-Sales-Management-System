"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, X, Upload } from "lucide-react";
import { useCreatePacketFish } from "@/hooks/usePacketFish";
import { CreatePacketFishRequest } from "@/lib/api/services/fetchPacketFish";
import { FishSize } from "@/lib/api/services/fetchKoiFish";
import uploadService, { UploadResponse } from "@/lib/api/services/fetchUpload";
import { BaseResponse } from "@/lib/api/apiClient";

interface AddPacketDialogProps {
  onClose: () => void;
}

const FISH_SIZES = [
  { value: "Under10cm", label: "Dưới 10cm" },
  { value: "From10To20cm", label: "10 - 20cm" },
  { value: "From21To25cm", label: "21 - 25cm" },
  { value: "From26To30cm", label: "26 - 30cm" },
  { value: "From31To40cm", label: "31 - 40cm" },
  { value: "From41To45cm", label: "41 - 45cm" },
  { value: "From46To50cm", label: "46 - 50cm" },
  { value: "Over50cm", label: "Trên 50cm" },
];

export function AddPacketDialog({ onClose }: AddPacketDialogProps) {
  const { mutate: createPacket, isPending } = useCreatePacketFish();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    totalPrice: "",
    size: "",
    ageMonths: "",
    isAvailable: true,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Tên gói là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    if (!formData.quantity || isNaN(Number(formData.quantity)))
      newErrors.quantity = "Số lượng phải là số hợp lệ";
    if (!formData.totalPrice || isNaN(Number(formData.totalPrice)))
      newErrors.totalPrice = "Giá phải là số hợp lệ";
    if (!formData.size) newErrors.size = "Kích cỡ là bắt buộc";
    if (!formData.ageMonths || isNaN(Number(formData.ageMonths)))
      newErrors.ageMonths = "Tuổi phải là số hợp lệ";
    if (imageFiles.length === 0)
      newErrors.images = "Phải có ít nhất một hình ảnh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Lưu file vào state
      setImageFiles((prev) => [...prev, file]);

      // Tạo preview từ file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({ ...prev, images: "" }));
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoSelect = () => {
    videoInputRef.current?.click();
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Lưu file vào state
      setVideoFiles((prev) => [...prev, file]);

      // Tạo preview từ file
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleRemoveVideo = (index: number) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsUploadingFiles(true);

      // Upload tất cả files song song
      const uploadPromises: Promise<BaseResponse<UploadResponse>>[] = [];

      // Upload images
      const imageUploadPromises = imageFiles.map((file) =>
        uploadService.uploadImage(file),
      );
      uploadPromises.push(...imageUploadPromises);

      // Upload videos
      const videoUploadPromises = videoFiles.map((file) =>
        uploadService.uploadVideo(file),
      );
      uploadPromises.push(...videoUploadPromises);

      // Chờ tất cả upload xong
      const uploadResults = await Promise.all(uploadPromises);

      // Tách URLs ảnh và video từ results
      const imageUrls = uploadResults
        .slice(0, imageFiles.length)
        .map((result) => {
          if (result.isSuccess && result.result) {
            return result.result.url;
          }
          throw new Error(result.message || "Upload ảnh thất bại");
        });

      const videoUrls = uploadResults.slice(imageFiles.length).map((result) => {
        if (result.isSuccess && result.result) {
          return result.result.url;
        }
        throw new Error(result.message || "Upload video thất bại");
      });

      // Tạo payload với URLs từ upload
      const payload: CreatePacketFishRequest = {
        name: formData.name,
        description: formData.description,
        quantity: Number(formData.quantity),
        totalPrice: Number(formData.totalPrice),
        size: formData.size as FishSize,
        ageMonths: Number(formData.ageMonths),
        images: imageUrls,
        videos: videoUrls,
        isAvailable: formData.isAvailable,
      };

      // Tạo packet với URLs
      createPacket(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi tải file lên";
      setErrors({ submit: message });
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <DialogContent className="!max-w-2xl max-h-[90vh] flex flex-col overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Thêm gói bán mới</DialogTitle>
        <DialogDescription>
          Điền thông tin chi tiết cho gói cá mới
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Tên gói */}
        <div>
          <Label htmlFor="name">Tên gói *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nhập tên gói"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <Label htmlFor="description">Mô tả *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Nhập mô tả gói"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Số lượng & Giá */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Số lượng (con) *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>
            )}
          </div>
          <div>
            <Label htmlFor="totalPrice">Giá bán (VND) *</Label>
            <Input
              id="totalPrice"
              name="totalPrice"
              type="number"
              placeholder="0"
              value={formData.totalPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={errors.totalPrice ? "border-red-500" : ""}
            />
            {errors.totalPrice && (
              <p className="text-sm text-red-500 mt-1">{errors.totalPrice}</p>
            )}
          </div>
        </div>

        {/* Kích cỡ & Tuổi */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="size">Kích cỡ *</Label>
            <Select
              value={formData.size}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, size: value }));
                setErrors((prev) => ({ ...prev, size: "" }));
              }}
            >
              <SelectTrigger className={errors.size ? "border-red-500" : ""}>
                <SelectValue placeholder="Chọn kích cỡ" />
              </SelectTrigger>
              <SelectContent>
                {FISH_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.size && (
              <p className="text-sm text-red-500 mt-1">{errors.size}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ageMonths">Tuổi (tháng) *</Label>
            <Input
              id="ageMonths"
              name="ageMonths"
              type="number"
              placeholder="0"
              value={formData.ageMonths}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className={errors.ageMonths ? "border-red-500" : ""}
            />
            {errors.ageMonths && (
              <p className="text-sm text-red-500 mt-1">{errors.ageMonths}</p>
            )}
          </div>
        </div>

        {/* Hình ảnh */}
        <div>
          <Label>Hình ảnh *</Label>
          <div className="mb-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button
              onClick={handleImageSelect}
              variant="outline"
              size="sm"
              disabled={isUploadingFiles}
              className="w-full"
            >
              {isUploadingFiles ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn ảnh từ máy
                </>
              )}
            </Button>
          </div>
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover rounded-md border border-blue-200"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && (
            <p className="text-sm text-red-500 mt-1">{errors.images}</p>
          )}
        </div>

        {/* Video */}
        <div>
          <Label>Video (tùy chọn)</Label>
          <div className="mb-2">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
            <Button
              onClick={handleVideoSelect}
              variant="outline"
              size="sm"
              disabled={isUploadingFiles}
              className="w-full"
            >
              {isUploadingFiles ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn video từ máy
                </>
              )}
            </Button>
          </div>
          {videoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {videoPreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <video
                    src={preview}
                    className="h-20 w-20 object-cover rounded-md border border-green-200"
                  />
                  <button
                    onClick={() => handleRemoveVideo(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trạng thái */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="isAvailable"
            checked={formData.isAvailable}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isAvailable: !!checked }))
            }
          />
          <Label htmlFor="isAvailable" className="cursor-pointer">
            Có sẵn bán
          </Label>
        </div>
      </div>

      {/* Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isPending || isUploadingFiles}
          className="flex-1"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || isUploadingFiles}
          className="flex-1"
        >
          {isPending || isUploadingFiles ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUploadingFiles ? "Đang tải files..." : "Đang thêm..."}
            </>
          ) : (
            "Thêm gói"
          )}
        </Button>
      </div>
    </DialogContent>
  );
}
