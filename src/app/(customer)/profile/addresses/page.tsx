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
  AlertCircle,
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
            <Button className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && !addresses && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground">
              Không thể tải danh sách địa chỉ. Vui lòng thử lại.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && addresses && addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có địa chỉ</h3>
            <p className="text-muted-foreground">
              Bạn chưa thêm bất kỳ địa chỉ nào. Hãy thêm địa chỉ để sử dụng
              trong checkout.
            </p>
          </div>
        )}

        {/* Addresses List */}
        {!isLoading && addresses && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`transition-all ${
                  address.isDefault
                    ? "border-2 border-primary bg-primary/5"
                    : "hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
                          {address.customerName}
                        </CardTitle>
                        {address.isDefault && (
                          <Badge className="bg-primary">Mặc định</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.fullAddress}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Address Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Thành phố */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Thành phố
                      </p>
                      <p className="font-medium">{address.city}</p>
                    </div>

                    {/* Quận/Huyện */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Quận/Huyện
                      </p>
                      <p className="font-medium">{address.district}</p>
                    </div>

                    {/* Phường/Xã */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Phường/Xã
                      </p>
                      <p className="font-medium">{address.ward}</p>
                    </div>

                    {/* Điện thoại */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Điện thoại
                      </p>
                      <p className="font-medium">{address.recipientPhone}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Tạo:{" "}
                        {formatDate(
                          address.createdAt,
                          DATE_FORMATS.MEDIUM_DATE,
                        )}
                      </span>
                    </div>
                    {address.updatedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
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

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={
                          isSettingDefault &&
                          selectedAddressForDefault === address.id
                        }
                      >
                        {isSettingDefault &&
                        selectedAddressForDefault === address.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang đặt...
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Mặc định
                          </>
                        )}
                      </Button>
                    )}
                    {address.isDefault && (
                      <div className="flex items-center justify-center px-3 py-1 bg-primary/10 text-primary rounded-lg font-medium text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Mặc định
                      </div>
                    )}
                    <Link href={`/profile/addresses/${address.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(address.id)}
                      disabled={
                        isDeleting && selectedAddressForDelete === address.id
                      }
                    >
                      {isDeleting && selectedAddressForDelete === address.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
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
