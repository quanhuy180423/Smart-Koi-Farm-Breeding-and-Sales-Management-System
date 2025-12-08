"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Calendar,
  Star,
  Loader2,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerLayout from "@/components/customer/CustomerLayout";
import {
  useGetCustomerAddresses,
  useSetDefaultAddress,
  useDeleteAddress,
} from "@/hooks/useCustomerAddress";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

export default function AddressesPage() {
  const { data: addresses, isLoading } = useGetCustomerAddresses();
  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetDefaultAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const [selectedAddressForDefault, setSelectedAddressForDefault] = useState<
    number | null
  >(null);
  const [selectedAddressForDelete, setSelectedAddressForDelete] = useState<
    number | null
  >(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSetDefault = (addressId: number) => {
    setSelectedAddressForDefault(addressId);
    setDefault(addressId, {
      onSuccess: () => {
        toast.success("Địa chỉ đã được đặt làm mặc định");
        setSelectedAddressForDefault(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Không thể đặt địa chỉ mặc định",
        );
        setSelectedAddressForDefault(null);
      },
    });
  };

  const handleDeleteClick = (addressId: number) => {
    setSelectedAddressForDelete(addressId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedAddressForDelete) {
      deleteAddress(selectedAddressForDelete, {
        onSuccess: () => {
          toast.success("Địa chỉ đã được xóa thành công");
          setShowDeleteDialog(false);
          setSelectedAddressForDelete(null);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Không thể xóa địa chỉ",
          );
        },
      });
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Địa chỉ của tôi</h1>
            <p className="text-muted-foreground">
              Quản lý và xem các địa chỉ giao hàng của bạn
            </p>
          </div>
          <Link href="/profile/addresses/add">
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingState message="Đang tải danh sách địa chỉ..." />}

        {/* Error State */}
        {!isLoading && !addresses && (
          <ErrorState
            title="Lỗi tải dữ liệu"
            message="Không thể tải danh sách địa chỉ. Vui lòng thử lại."
          />
        )}

        {/* Empty State */}
        {!isLoading && addresses && addresses.length === 0 && (
          <EmptyState
            icon={MapPin}
            title="Chưa có địa chỉ"
            description="Bạn chưa thêm bất kỳ địa chỉ nào. Hãy thêm địa chỉ để sử dụng trong checkout."
          />
        )}

        {/* Addresses List */}
        {!isLoading && addresses && addresses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`transition-all flex flex-col h-full ${
                  address.isDefault
                    ? "border-2 border-primary bg-primary/5"
                    : "hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CardTitle className="text-sm">
                          {address.customerName}
                        </CardTitle>
                        {address.isDefault && (
                          <Badge className="bg-primary text-xs shrink-0">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 grow flex flex-col">
                  {/* Full Address */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-sm font-medium line-clamp-2">
                      {address.fullAddress}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3 shrink-0" />
                      Điện thoại
                    </p>
                    <p className="text-sm font-medium">
                      {address.recipientPhone}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>
                        Tạo:{" "}
                        {formatDate(
                          address.createdAt,
                          DATE_FORMATS.MEDIUM_DATE,
                        )}
                      </span>
                    </div>
                    {address.updatedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          Cập nhật:{" "}
                          {formatDate(
                            address.updatedAt,
                            DATE_FORMATS.MEDIUM_DATE,
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-2" />

                  {/* Actions */}
                  <div className="flex gap-1 pt-1 mt-auto">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex-1 px-1 h-8 whitespace-nowrap"
                        onClick={() => handleSetDefault(address.id)}
                        title="Đặt làm địa chỉ mặc định"
                        disabled={
                          isSettingDefault &&
                          selectedAddressForDefault === address.id
                        }
                      >
                        {isSettingDefault &&
                        selectedAddressForDefault === address.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </>
                        ) : (
                          <>
                            <Star className="h-3 w-3" />
                          </>
                        )}
                      </Button>
                    )}
                    {address.isDefault && (
                      <div
                        className="flex items-center justify-center px-1 py-1 bg-primary/10 text-primary rounded text-xs font-medium flex-1 h-8"
                        title="Đây là địa chỉ mặc định"
                      >
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}
                    <Link
                      href={`/profile/addresses/${address.id}`}
                      className="flex-1"
                      title="Chỉnh sửa địa chỉ"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-8 px-1 whitespace-nowrap"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1 px-1 h-8 whitespace-nowrap"
                      onClick={() => handleDeleteClick(address.id)}
                      title="Xóa địa chỉ"
                      disabled={
                        isDeleting && selectedAddressForDelete === address.id
                      }
                    >
                      {isDeleting && selectedAddressForDelete === address.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa địa chỉ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
    </CustomerLayout>
  );
}
