"use client";

import { useState } from "react";
import Image from "next/image";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  Eye,
  Filter,
  Tag,
  Plus,
  X,
  Upload,
  Edit,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetPromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from "@/hooks/usePromotion";
import {
  PromotionResponse,
  DiscountType,
  PromotionRequest,
} from "@/lib/api/services/fetchPromotion";
import { useUploadImage } from "@/hooks/useUploadFile";
import { InputNumber } from "@/components/ui/input-number";
import { DatePickerFilter } from "@/components/ui/DatePickerFilter";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import formatCurrency from "@/lib/utils/numbers";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";

const defaultPromotionData = {
  pageIndex: 1,
  totalPages: 0,
  totalItems: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  data: [],
};

// Zod schema for promotion validation
const basePromotionSchema = z
  .object({
    code: z.string().min(1, "Mã khuyến mãi không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    discountValue: z.number().gt(0, "Giá trị giảm phải lớn hơn 0"),
    minimumOrderAmount: z.number().gte(0, "Tối thiểu đơn hàng phải >= 0"),
    maxDiscountAmount: z.number().gt(0, "Tối đa giảm giá phải lớn hơn 0"),
    validFrom: z.string().min(1, "Ngày bắt đầu không được để trống"),
    validTo: z.string().min(1, "Ngày kết thúc không được để trống"),
  })
  .refine((data) => new Date(data.validFrom) < new Date(data.validTo), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validTo"],
  });

// Schema for creating new promotions (with past date check)
const promotionCreateSchema = basePromotionSchema.refine(
  (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(data.validFrom);
    return startDate >= today;
  },
  {
    message: "Ngày bắt đầu không thể ở quá khứ",
    path: ["validFrom"],
  },
);

// Schema for editing promotions (no past date check)
const promotionEditSchema = basePromotionSchema;

export default function PromotionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS_DEFAULT[0]);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<PromotionResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] =
    useState<PromotionResponse | null>(null);

  // Filter inputs
  const [isActiveInput, setIsActiveInput] = useState<boolean | undefined>();
  const [discountTypeInput, setDiscountTypeInput] = useState<
    DiscountType | undefined
  >();
  const [availableOnDateInput, setAvailableOnDateInput] = useState("");

  // Applied filters
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [discountType, setDiscountType] = useState<DiscountType | undefined>();
  const [availableOnDate, setAvailableOnDate] = useState("");

  // Create form state
  const [formData, setFormData] = useState<PromotionRequest>({
    code: "",
    description: "",
    validFrom: "",
    validTo: "",
    discountType: DiscountType.FixedAmount,
    discountValue: 0,
    minimumOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    isActive: true,
    images: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const uploadImageMutation = useUploadImage();
  const createPromotionMutation = useCreatePromotion({
    onSuccess: () => {
      resetCreateForm();
      setIsCreateOpen(false);
    },
  });

  const updatePromotionMutation = useUpdatePromotion({
    onSuccess: () => {
      resetCreateForm();
      setIsEditOpen(false);
      setEditingPromotion(null);
    },
  });

  const deletePromotionMutation = useDeletePromotion({
    onSuccess: () => {
      setIsDeleteOpen(false);
      setPromotionToDelete(null);
    },
  });

  const {
    data: promotionsData = defaultPromotionData,
    isLoading,
    error,
  } = useGetPromotions({
    pageIndex: currentPage,
    pageSize: pageSize,
    search: debouncedSearchTerm,
    isActive,
    discountType,
    availableOnDate: availableOnDate || undefined,
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const viewDetails = (promotion: PromotionResponse) => {
    setSelectedPromotion(promotion);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (promotion: PromotionResponse) => {
    setPromotionToDelete(promotion);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (promotionToDelete) {
      await deletePromotionMutation.mutateAsync(promotionToDelete.id);
    }
  };

  const handleApplyFilters = () => {
    setIsActive(isActiveInput);
    setDiscountType(discountTypeInput);
    setAvailableOnDate(availableOnDateInput);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setIsActiveInput(undefined);
    setDiscountTypeInput(undefined);
    setAvailableOnDateInput("");

    setIsActive(undefined);
    setDiscountType(undefined);
    setAvailableOnDate("");
    setCurrentPage(1);
  };

  const getDiscountTypeLabel = (type: DiscountType): string => {
    return type === DiscountType.Percentage ? "Phần trăm %" : "Số tiền cố định";
  };

  const getDiscountDisplay = (type: DiscountType, value: number): string => {
    return type === DiscountType.Percentage
      ? `${value}%`
      : formatCurrency(value);
  };

  const handleImageSelect = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    // Create preview URLs for selected images
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

  const handleRemoveImage = (index: number) => {
    setSelectedImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetCreateForm = () => {
    setFormData({
      code: "",
      description: "",
      validFrom: "",
      validTo: "",
      discountType: DiscountType.FixedAmount,
      discountValue: 0,
      minimumOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      isActive: true,
      images: [],
    });
    setFormErrors({});
    setSelectedImageFiles([]);
    setImagePreviews([]);
  };

  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleEditPromotion = (promotion: PromotionResponse) => {
    setEditingPromotion(promotion);
    // Set existing images as previews
    setImagePreviews(promotion.images || []);
    // Clear selected files since we're editing
    setSelectedImageFiles([]);
    // Set form data from promotion
    setFormData({
      code: promotion.code,
      description: promotion.description,
      validFrom: promotion.validFrom,
      validTo: promotion.validTo,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      minimumOrderAmount: promotion.minimumOrderAmount,
      maxDiscountAmount: promotion.maxDiscountAmount || 0,
      usageLimit: promotion.usageLimit || 0,
      isActive: promotion.isActive,
      images: promotion.images || [],
    });
    setIsEditOpen(true);
  };

  const handleCreatePromotion = async () => {
    // Validate using Zod
    const validationResult = promotionCreateSchema.safeParse({
      code: formData.code,
      description: formData.description,
      discountValue: formData.discountValue,
      minimumOrderAmount: formData.minimumOrderAmount,
      maxDiscountAmount: formData.maxDiscountAmount,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      setIsCreating(true);
      setFormErrors({});

      // Upload images
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

      const createRequest: PromotionRequest = {
        ...formData,
        images: uploadedImageUrls,
      };

      await createPromotionMutation.mutateAsync(createRequest);
    } catch {
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdatePromotion = async () => {
    if (!editingPromotion) return;

    // Validate using Zod
    const validationResult = promotionEditSchema.safeParse({
      code: formData.code,
      description: formData.description,
      discountValue: formData.discountValue,
      minimumOrderAmount: formData.minimumOrderAmount,
      maxDiscountAmount: formData.maxDiscountAmount,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        errors[error.path[0] as string] = error.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      setIsEditing(true);
      setFormErrors({});

      // Upload new images (files selected by user)
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

      // Filter existing images (URLs from server, not base64)
      const existingImages = imagePreviews.filter(
        (preview) =>
          preview.startsWith("http://") || preview.startsWith("https://"),
      );

      // Combine: existing images + newly uploaded images
      const finalImages = [...existingImages, ...uploadedImageUrls];

      const updateRequest: PromotionRequest = {
        ...formData,
        images: finalImages,
      };

      await updatePromotionMutation.mutateAsync({
        id: editingPromotion.id,
        request: updateRequest,
      });
    } catch {
    } finally {
      setIsEditing(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ErrorState
          title="Có lỗi xảy ra"
          message="Không thể tải danh sách khuyến mãi. Vui lòng thử lại."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản Lý Khuyến Mãi
          </h1>
          <p className="text-muted-foreground">
            Xem và quản lý các chương trình khuyến mãi của hệ thống
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo Khuyến Mãi
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khuyến Mãi</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý các chương trình khuyến mãi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã khuyến mãi, mô tả..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <LoadingState message="Đang tải danh sách khuyến mãi..." />
          ) : promotionsData.data.length === 0 ? (
            <EmptyState
              icon={Tag}
              title="Không có khuyến mãi nào"
              description="Chưa có khuyến mãi nào trong hệ thống. Hãy tạo khuyến mãi mới để bắt đầu."
            />
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead className="w-[12%]">Mã KM</TableHead>
                      <TableHead className="w-[20%]">Mô Tả</TableHead>
                      <TableHead className="w-[15%]">Loại Giảm Giá</TableHead>
                      <TableHead className="w-[12%] text-right">
                        Giá Trị
                      </TableHead>
                      <TableHead className="w-[18%]">Khoảng Ngày</TableHead>
                      <TableHead className="w-[10%] text-right">
                        Lượt Sử Dụng
                      </TableHead>
                      <TableHead className="w-[12%]">Trạng Thái</TableHead>
                      <TableHead className="w-[10%]">Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotionsData.data.map((promotion, index) => (
                      <TableRow
                        key={promotion.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-center text-muted-foreground">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-medium truncate">
                          {promotion.code}
                        </TableCell>
                        <TableCell className="truncate">
                          <div className="truncate">
                            {promotion.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getDiscountTypeLabel(promotion.discountType)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {getDiscountDisplay(
                            promotion.discountType,
                            promotion.discountValue,
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="text-muted-foreground">
                            {formatDate(
                              promotion.validFrom,
                              DATE_FORMATS.MEDIUM_DATE,
                            )}{" "}
                            -{" "}
                            {formatDate(
                              promotion.validTo,
                              DATE_FORMATS.MEDIUM_DATE,
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {promotion.usageCount}
                          {promotion.usageLimit && (
                            <span className="text-xs text-muted-foreground">
                              {" "}
                              / {promotion.usageLimit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              promotion.isActive ? "default" : "secondary"
                            }
                          >
                            {promotion.isActive
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => viewDetails(promotion)}
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPromotion(promotion)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(promotion)}
                              title="Xóa"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <PaginationWithLinks
                totalCount={promotionsData.totalItems}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bộ lọc Khuyến Mãi</DialogTitle>
            <DialogDescription>
              Lọc danh sách khuyến mãi theo tiêu chí
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Discount Type and Status Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              {/* Discount Type Filter */}
              <div className="space-y-2">
                <Label>Loại Giảm Giá</Label>
                <Select
                  value={
                    discountTypeInput === undefined ? "all" : discountTypeInput
                  }
                  onValueChange={(value) =>
                    setDiscountTypeInput(
                      value === "all" ? undefined : (value as DiscountType),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value={DiscountType.Percentage}>
                      Phần trăm
                    </SelectItem>
                    <SelectItem value={DiscountType.FixedAmount}>
                      Số tiền
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Trạng Thái</Label>
                <Select
                  value={
                    isActiveInput === undefined
                      ? "all"
                      : isActiveInput
                        ? "active"
                        : "inactive"
                  }
                  onValueChange={(value) =>
                    setIsActiveInput(
                      value === "all"
                        ? undefined
                        : value === "active"
                          ? true
                          : false,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Available On Date Filter */}
            <DatePickerFilter
              label="Ngày Có Sẵn"
              value={availableOnDateInput}
              onChange={setAvailableOnDateInput}
            />
          </div>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promotion Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPromotion && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPromotion.code}</DialogTitle>
                <DialogDescription>
                  Chi tiết chương trình khuyến mãi
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Thông Tin Cơ Bản</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Mã KM</p>
                      <p className="font-medium">{selectedPromotion.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Trạng Thái
                      </p>
                      <Badge
                        variant={
                          selectedPromotion.isActive ? "default" : "secondary"
                        }
                        className="mt-1"
                      >
                        {selectedPromotion.isActive
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Mô Tả</p>
                      <p className="font-medium">
                        {selectedPromotion.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Discount Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Thông Tin Giảm Giá</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Loại Giảm Giá
                      </p>
                      <p className="font-medium">
                        {getDiscountTypeLabel(selectedPromotion.discountType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Giá Trị Giảm
                      </p>
                      <p className="font-medium">
                        {getDiscountDisplay(
                          selectedPromotion.discountType,
                          selectedPromotion.discountValue,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tối Thiểu Đơn Hàng
                      </p>
                      <p className="font-medium">
                        {formatCurrency(selectedPromotion.minimumOrderAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tối Đa Giảm Giá
                      </p>
                      <p className="font-medium">
                        {selectedPromotion.maxDiscountAmount
                          ? formatCurrency(selectedPromotion.maxDiscountAmount)
                          : "Không giới hạn"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Thông Tin Sử Dụng</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Lượt Sử Dụng
                      </p>
                      <p className="font-medium">
                        {selectedPromotion.usageCount}
                        {selectedPromotion.usageLimit && (
                          <span className="text-muted-foreground">
                            {" "}
                            / {selectedPromotion.usageLimit}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Giới Hạn Sử Dụng
                      </p>
                      <p className="font-medium">
                        {selectedPromotion.usageLimit
                          ? selectedPromotion.usageLimit
                          : "Không giới hạn"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Thời Gian Hiệu Lực</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Từ</p>
                      <p className="font-medium">
                        {formatDate(
                          selectedPromotion.validFrom,
                          DATE_FORMATS.DATETIME_24H,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đến</p>
                      <p className="font-medium">
                        {formatDate(
                          selectedPromotion.validTo,
                          DATE_FORMATS.DATETIME_24H,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Promotion Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo Khuyến Mãi Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin khuyến mãi để tạo mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Code and Description */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Mã Khuyến Mãi *</Label>
                <Input
                  placeholder="VD: SALE2025"
                  value={formData.code}
                  onChange={(e) => {
                    setFormData({ ...formData, code: e.target.value });
                    clearFieldError("code");
                  }}
                  onBlur={() => {
                    if (!formData.code.trim()) {
                      setFormErrors((prev) => ({
                        ...prev,
                        code: "Mã khuyến mãi không được để trống",
                      }));
                    }
                  }}
                  className={formErrors.code ? "border-red-500" : ""}
                />
                {formErrors.code && (
                  <p className="text-sm text-red-500">{formErrors.code}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Mô Tả *</Label>
                <Input
                  placeholder="VD: Giảm 50% cho khách hàng mới"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    clearFieldError("description");
                  }}
                  onBlur={() => {
                    if (!formData.description.trim()) {
                      setFormErrors((prev) => ({
                        ...prev,
                        description: "Mô tả không được để trống",
                      }));
                    }
                  }}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Discount Type and Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Loại Giảm Giá *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      discountType: value as DiscountType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DiscountType.FixedAmount}>
                      Số tiền cố định
                    </SelectItem>
                    <SelectItem value={DiscountType.Percentage}>
                      Phần trăm
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Giá Trị Giảm{" "}
                  {formData.discountType === DiscountType.Percentage
                    ? "(%)"
                    : "(đ)"}
                </Label>
                <InputNumber
                  value={formData.discountValue}
                  onChange={(value) => {
                    setFormData({ ...formData, discountValue: value });
                    clearFieldError("discountValue");
                  }}
                  min={0}
                  className={formErrors.discountValue ? "border-red-500" : ""}
                />
                {formErrors.discountValue && (
                  <p className="text-sm text-red-500">
                    {formErrors.discountValue}
                  </p>
                )}
              </div>
            </div>

            {/* Minimum Order Amount and Max Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tối Thiểu Đơn Hàng (đ)</Label>
                <InputNumber
                  value={formData.minimumOrderAmount}
                  onChange={(value) => {
                    setFormData({ ...formData, minimumOrderAmount: value });
                    clearFieldError("minimumOrderAmount");
                  }}
                  min={0}
                  className={
                    formErrors.minimumOrderAmount ? "border-red-500" : ""
                  }
                />
                {formErrors.minimumOrderAmount && (
                  <p className="text-sm text-red-500">
                    {formErrors.minimumOrderAmount}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tối Đa Giảm Giá (đ)</Label>
                <InputNumber
                  value={formData.maxDiscountAmount}
                  onChange={(value) => {
                    setFormData({ ...formData, maxDiscountAmount: value });
                    clearFieldError("maxDiscountAmount");
                  }}
                  min={0}
                  className={
                    formErrors.maxDiscountAmount ? "border-red-500" : ""
                  }
                />
                {formErrors.maxDiscountAmount && (
                  <p className="text-sm text-red-500">
                    {formErrors.maxDiscountAmount}
                  </p>
                )}
              </div>
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label>Giới Hạn Sử Dụng (0 = không giới hạn)</Label>
              <InputNumber
                value={formData.usageLimit}
                onChange={(value) =>
                  setFormData({ ...formData, usageLimit: value })
                }
                min={0}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <DatePickerFilter
                  label="Ngày Bắt Đầu *"
                  value={formData.validFrom}
                  onChange={(dateString) => {
                    setFormData({
                      ...formData,
                      validFrom: `${dateString}T00:00:00.000Z`,
                    });
                    clearFieldError("validFrom");
                  }}
                />
                {formErrors.validFrom && (
                  <p className="text-sm text-red-500">{formErrors.validFrom}</p>
                )}
              </div>
              <div className="space-y-2">
                <DatePickerFilter
                  label="Ngày Kết Thúc *"
                  value={formData.validTo}
                  onChange={(dateString) => {
                    setFormData({
                      ...formData,
                      validTo: `${dateString}T00:00:00.000Z`,
                    });
                    clearFieldError("validTo");
                  }}
                />
                {formErrors.validTo && (
                  <p className="text-sm text-red-500">{formErrors.validTo}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
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
                onClick={() => document.getElementById("image-input")?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Kéo thả hình ảnh vào đây</p>
                <p className="text-xs text-muted-foreground mt-1">
                  hoặc nhấp để chọn từ máy
                </p>
              </div>
              <input
                id="image-input"
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

              {/* Display Image Previews */}
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
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Kích hoạt ngay
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                resetCreateForm();
                setIsCreateOpen(false);
              }}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreatePromotion}
              disabled={isCreating || createPromotionMutation.isPending}
            >
              {isCreating || createPromotionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Khuyến Mãi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Khuyến Mãi</DialogTitle>
            <DialogDescription>Cập nhật thông tin khuyến mãi</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Code and Description */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Mã Khuyến Mãi *</Label>
                <Input
                  placeholder="VD: SALE2025"
                  value={formData.code}
                  onChange={(e) => {
                    setFormData({ ...formData, code: e.target.value });
                    clearFieldError("code");
                  }}
                  onBlur={() => {
                    if (!formData.code.trim()) {
                      setFormErrors((prev) => ({
                        ...prev,
                        code: "Mã khuyến mãi không được để trống",
                      }));
                    }
                  }}
                  className={formErrors.code ? "border-red-500" : ""}
                />
                {formErrors.code && (
                  <p className="text-sm text-red-500">{formErrors.code}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Mô Tả *</Label>
                <Input
                  placeholder="VD: Giảm 50% cho khách hàng mới"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    clearFieldError("description");
                  }}
                  onBlur={() => {
                    if (!formData.description.trim()) {
                      setFormErrors((prev) => ({
                        ...prev,
                        description: "Mô tả không được để trống",
                      }));
                    }
                  }}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Discount Type and Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Loại Giảm Giá *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      discountType: value as DiscountType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DiscountType.FixedAmount}>
                      Số tiền cố định
                    </SelectItem>
                    <SelectItem value={DiscountType.Percentage}>
                      Phần trăm
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  Giá Trị Giảm{" "}
                  {formData.discountType === DiscountType.Percentage
                    ? "(%)"
                    : "(đ)"}
                </Label>
                <InputNumber
                  value={formData.discountValue}
                  onChange={(value) => {
                    setFormData({ ...formData, discountValue: value });
                    clearFieldError("discountValue");
                  }}
                  min={0}
                  className={formErrors.discountValue ? "border-red-500" : ""}
                />
                {formErrors.discountValue && (
                  <p className="text-sm text-red-500">
                    {formErrors.discountValue}
                  </p>
                )}
              </div>
            </div>

            {/* Minimum Order Amount and Max Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tối Thiểu Đơn Hàng (đ)</Label>
                <InputNumber
                  value={formData.minimumOrderAmount}
                  onChange={(value) => {
                    setFormData({ ...formData, minimumOrderAmount: value });
                    clearFieldError("minimumOrderAmount");
                  }}
                  min={0}
                  className={
                    formErrors.minimumOrderAmount ? "border-red-500" : ""
                  }
                />
                {formErrors.minimumOrderAmount && (
                  <p className="text-sm text-red-500">
                    {formErrors.minimumOrderAmount}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tối Đa Giảm Giá (đ)</Label>
                <InputNumber
                  value={formData.maxDiscountAmount}
                  onChange={(value) => {
                    setFormData({ ...formData, maxDiscountAmount: value });
                    clearFieldError("maxDiscountAmount");
                  }}
                  min={0}
                  className={
                    formErrors.maxDiscountAmount ? "border-red-500" : ""
                  }
                />
                {formErrors.maxDiscountAmount && (
                  <p className="text-sm text-red-500">
                    {formErrors.maxDiscountAmount}
                  </p>
                )}
              </div>
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label>Giới Hạn Sử Dụng (0 = không giới hạn)</Label>
              <InputNumber
                value={formData.usageLimit}
                onChange={(value) =>
                  setFormData({ ...formData, usageLimit: value })
                }
                min={0}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <DatePickerFilter
                  label="Ngày Bắt Đầu *"
                  value={formData.validFrom}
                  onChange={(dateString) => {
                    setFormData({
                      ...formData,
                      validFrom: `${dateString}T00:00:00.000Z`,
                    });
                    clearFieldError("validFrom");
                  }}
                />
                {formErrors.validFrom && (
                  <p className="text-sm text-red-500">{formErrors.validFrom}</p>
                )}
              </div>
              <div className="space-y-2">
                <DatePickerFilter
                  label="Ngày Kết Thúc *"
                  value={formData.validTo}
                  onChange={(dateString) => {
                    setFormData({
                      ...formData,
                      validTo: `${dateString}T00:00:00.000Z`,
                    });
                    clearFieldError("validTo");
                  }}
                />
                {formErrors.validTo && (
                  <p className="text-sm text-red-500">{formErrors.validTo}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
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
                  document.getElementById("edit-image-input")?.click()
                }
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Kéo thả hình ảnh vào đây</p>
                <p className="text-xs text-muted-foreground mt-1">
                  hoặc nhấp để chọn từ máy
                </p>
              </div>
              <input
                id="edit-image-input"
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

              {/* Display Image Previews */}
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
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveEdit"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border"
              />
              <Label htmlFor="isActiveEdit" className="cursor-pointer">
                Kích hoạt ngay
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                resetCreateForm();
                setIsEditOpen(false);
                setEditingPromotion(null);
              }}
              disabled={isEditing}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdatePromotion}
              disabled={isEditing || updatePromotionMutation.isPending}
            >
              {isEditing || updatePromotionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập Nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa Khuyến Mãi</DialogTitle>
            <DialogDescription>
              {`Bạn có chắc chắn muốn xóa khuyến mãi "${promotionToDelete?.code}"?`}
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setPromotionToDelete(null);
              }}
              disabled={deletePromotionMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePromotionMutation.isPending}
            >
              {deletePromotionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
