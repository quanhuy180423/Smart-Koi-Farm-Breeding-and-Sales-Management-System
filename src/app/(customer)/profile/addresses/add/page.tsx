"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { useCreateAddress } from "@/hooks/useCustomerAddress";

// 1. Import dynamic from next/dynamic
import dynamic from "next/dynamic";

// 2. Replace the static import with a dynamic import with ssr: false
const CheckoutMap = dynamic(() => import("../components/CheckoutMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function AddAddressPage() {
  const router = useRouter();
  const { mutate: createAddress, isPending } = useCreateAddress();

  const [formData, setFormData] = useState({
    fullAddress: "",
    city: "",
    ward: "",
    streetAddress: "",
    latitude: 21.0285,
    longitude: 105.8542,
    recipientPhone: "",
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      // Auto-generate fullAddress from other fields
      if (name !== "fullAddress") {
        updated.fullAddress = [
          updated.streetAddress,
          updated.ward,
          updated.city,
        ]
          .filter((v) => v && v.trim())
          .join(", ");
      }
      return updated;
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.city ||
      !formData.ward ||
      !formData.streetAddress ||
      !formData.recipientPhone
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate phone
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.recipientPhone)) {
      toast.error(
        "Số điện thoại không hợp lệ (cần có 10 chữ số, bắt đầu từ 0)",
      );
      return;
    }

    createAddress(formData, {
      onSuccess: () => {
        toast.success("Địa chỉ đã được tạo thành công");
        router.push("/profile/addresses");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Không thể tạo địa chỉ",
        );
      },
    });
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Thêm địa chỉ mới</h1>
            <p className="text-muted-foreground">
              Điền thông tin và chọn vị trí trên bản đồ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Fields */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Thông tin địa chỉ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {/* Full Address - Read Only */}
                  <div className="space-y-1">
                    <Label htmlFor="fullAddress" className="text-sm">
                      Địa chỉ đầy đủ
                    </Label>
                    <Input
                      id="fullAddress"
                      value={formData.fullAddress}
                      disabled
                      className="h-9 bg-muted/30 text-black font-semibold cursor-not-allowed"
                      placeholder="Tự động điền..."
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-sm">
                      Thành phố
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="VD: Hà Nội"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* Ward */}
                  <div className="space-y-1">
                    <Label htmlFor="ward" className="text-sm">
                      Phường/Xã
                    </Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="VD: Hàng Trống"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1">
                    <Label htmlFor="streetAddress" className="text-sm">
                      Số nhà/Đường phố
                    </Label>
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      placeholder="VD: 123 Đường ABC"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Label htmlFor="recipientPhone" className="text-sm">
                      Số điện thoại
                    </Label>
                    <Input
                      id="recipientPhone"
                      name="recipientPhone"
                      placeholder="VD: 0987654321"
                      value={formData.recipientPhone}
                      onChange={handleInputChange}
                      disabled={isPending}
                      maxLength={10}
                      className="h-9"
                    />
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={handleCheckboxChange}
                      disabled={isPending}
                    />
                    <Label
                      htmlFor="isDefault"
                      className="text-xs font-normal cursor-pointer"
                    >
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Tạo địa chỉ
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <CheckoutMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
                disabled={isPending}
              />
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
