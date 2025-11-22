"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  ShoppingCart,
  Loader2,
  MapPin,
  Plus,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetCart, useConverCartToOrder } from "@/hooks/useCart";
import { useCreatePayment } from "@/hooks/useOrderPayment";
import {
  useGetCustomerAddresses,
  useCreateAddress,
} from "@/hooks/useCustomerAddress";
import { useCalculateShippingFee } from "@/hooks/useShippingFee";
import { ShippingFeeCalculateResponse } from "@/lib/api/services/fetchShippingFee";
import { PaymentMethod } from "@/lib/api/services/fetchOrderPayment";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { getFishSizeLabel } from "@/lib/utils/enum";
import { ShippingFeeDetailDialog } from "@/components/checkout/ShippingFeeDetailDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
// 1. Import dynamic from next/dynamic
import dynamic from "next/dynamic";

// 2. Replace the static import with a dynamic import with ssr: false
const CheckoutMap = dynamic(
  () => import("@/app/(customer)/profile/addresses/components/CheckoutMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading, isError, refetch } = useGetCart();
  const {
    data: addresses,
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses,
  } = useGetCustomerAddresses();
  const { mutate: convertToOrder, isPending: isSubmitting } =
    useConverCartToOrder();
  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePayment();
  const { mutate: createAddress, isPending: isCreatingAddress } =
    useCreateAddress();
  const {
    mutateAsync: calculateShippingFee,
    isPending: isCalculatingShippingFee,
  } = useCalculateShippingFee();

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({
    fullAddress: "",
    city: "",
    ward: "",
    streetAddress: "",
    latitude: 21.0285,
    longitude: 105.8542,
    recipientPhone: "",
    isDefault: false,
  });
  const [orderData, setOrderData] = useState({
    // Payment
    paymentMethod: "vnpay",

    // Terms
    agreeTerms: false,
    subscribeNewsletter: false,
  });
  const [shippingFeeData, setShippingFeeData] =
    useState<ShippingFeeCalculateResponse | null>(null);
  const [showShippingFeeDialog, setShowShippingFeeDialog] = useState(false);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [addresses, selectedAddressId]);

  const handleQuickAddInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setQuickAddForm((prev) => {
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

  const handleQuickAddCheckboxChange = (checked: boolean) => {
    setQuickAddForm((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleQuickAddMapClick = (lat: number, lng: number) => {
    setQuickAddForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleQuickAddSubmit = () => {
    // Validate required fields
    if (
      !quickAddForm.city ||
      !quickAddForm.ward ||
      !quickAddForm.streetAddress ||
      !quickAddForm.recipientPhone
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate phone
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(quickAddForm.recipientPhone)) {
      toast.error(
        "Số điện thoại không hợp lệ (cần có 10 chữ số, bắt đầu từ 0)",
      );
      return;
    }

    createAddress(quickAddForm, {
      onSuccess: (data) => {
        toast.success("Địa chỉ đã được thêm thành công");
        setShowQuickAddModal(false);
        // Reset form
        setQuickAddForm({
          fullAddress: "",
          city: "",
          ward: "",
          streetAddress: "",
          latitude: 21.0285,
          longitude: 105.8542,
          recipientPhone: "",
          isDefault: false,
        });
        // Refetch addresses and select the new one
        refetchAddresses();
        if (data.result?.id) {
          setSelectedAddressId(data.result.id);
        }
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Không thể tạo địa chỉ",
        );
      },
    });
  };

  const items = cartData?.cartItems || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartData?.totalPrice || 0;

  const getTotalItems = () => totalItems;
  const getTotalPrice = () => totalPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculateShippingAndContinue = async () => {
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      // Map cart items to shipping fee request format
      const itemsForShippingFee = items.map((item) => ({
        koiFishId: item.koiFishId || null,
        packetFishId: item.packetFishId || null,
        quantity: item.quantity,
      }));

      const result = await calculateShippingFee({
        items: itemsForShippingFee,
        customerAddressId: selectedAddressId,
      });

      if (result?.isSuccess && result?.result) {
        setShippingFeeData(result.result);
        toast.success("Tính phí vận chuyển thành công");
        setStep(2);
      } else {
        toast.error(
          result?.message || "Không thể tính phí vận chuyển. Vui lòng thử lại",
        );
      }
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(
        errorMessage ||
          "Có lỗi xảy ra khi tính phí vận chuyển. Vui lòng thử lại",
      );
    }
  };

  const handleSubmitOrder = () => {
    convertToOrder(
      {
        customerAddressId: selectedAddressId || undefined,
        shippingFee: shippingFeeData?.totalShippingFee || 0,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess && data.result?.id) {
            // Đơn hàng được tạo thành công, khởi tạo thanh toán VNPay
            createPayment({
              orderId: data.result.id,
              method: PaymentMethod.VNPAY,
            });
            // Hook sẽ tự động chuyển hướng tới payment URL
          } else {
            router.push("/checkout/failure");
          }
        },
        onError: () => {
          router.push("/checkout/failure");
        },
      },
    );
  };

  const isStep1Valid = selectedAddressId && !isLoadingAddresses;
  const isStep2Valid = orderData.paymentMethod && orderData.agreeTerms;
  const selectedAddress = addresses?.find(
    (addr) => addr.id === selectedAddressId,
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <LoadingState message="Đang tải giỏ hàng..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Lỗi khi tải giỏ hàng"
              message="Có lỗi xảy ra. Vui lòng thử lại."
              onRetry={() => refetch()}
            />
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <EmptyState
              icon={ShoppingCart}
              title="Giỏ hàng trống"
              description="Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán."
              action={{
                label: "Xem danh mục sản phẩm",
                onClick: () => router.push("/catalog"),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Thanh toán
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {getTotalItems()} sản phẩm trong giỏ hàng
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 md:space-x-4 bg-card rounded-full px-4 py-2 shadow-sm border">
                <div
                  className={`flex items-center space-x-2 transition-colors ${
                    step >= 1 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step >= 1
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    Thông tin giao hàng
                  </span>
                </div>
                <div className="w-4 md:w-8 h-px bg-border" />
                <div
                  className={`flex items-center space-x-2 transition-colors ${
                    step >= 2 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step >= 2
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > 2 ? <CheckCircle className="h-4 w-4" /> : "2"}
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    Thanh toán
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Thông tin giao hàng
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng chọn địa chỉ giao hàng
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    {/* Address Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Địa chỉ giao hàng{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowQuickAddModal(true)}
                          className="gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Thêm mới</span>
                        </Button>
                      </div>

                      {isLoadingAddresses ? (
                        <div className="flex items-center justify-center p-6">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="ml-2 text-sm text-muted-foreground">
                            Đang tải địa chỉ...
                          </span>
                        </div>
                      ) : addresses && addresses.length > 0 ? (
                        <>
                          <Select
                            value={selectedAddressId?.toString() || ""}
                            onValueChange={(value) =>
                              setSelectedAddressId(parseInt(value))
                            }
                          >
                            <SelectTrigger className="transition-colors border-2 hover:border-primary/50 focus:border-primary">
                              <SelectValue placeholder="Chọn địa chỉ giao hàng" />
                            </SelectTrigger>
                            <SelectContent>
                              {addresses.map((addr) => (
                                <SelectItem
                                  key={addr.id}
                                  value={addr.id.toString()}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                      {addr.customerName} - {addr.fullAddress}
                                    </span>
                                    {addr.isDefault && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-2"
                                      >
                                        Mặc định
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Selected Address Details */}
                          {selectedAddress && (
                            <Card className="bg-primary/5 border-primary/20">
                              <CardContent className="pt-4">
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="font-medium">
                                        {selectedAddress.customerName}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedAddress.fullAddress}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <p className="text-muted-foreground">
                                        Thành phố
                                      </p>
                                      <p className="font-medium">
                                        {selectedAddress.city}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">
                                        Phường/Xã
                                      </p>
                                      <p className="font-medium">
                                        {selectedAddress.ward}
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-muted-foreground">
                                        Điện thoại
                                      </p>
                                      <p className="font-medium">
                                        {selectedAddress.recipientPhone}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      ) : (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            Bạn chưa có địa chỉ nào. Vui lòng nhập địa chỉ giao
                            hàng dưới đây.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Fallback: Manual Address Input */}
                    {!selectedAddress && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingAddress"
                          className="text-sm font-medium"
                        >
                          Hoặc nhập địa chỉ thủ công{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="shippingAddress"
                          placeholder="VD: 123 Đường ABC, Phường XYZ, Quận ABC, TP. Hồ Chí Minh"
                          disabled
                          className="bg-muted/30 text-muted-foreground cursor-not-allowed"
                          value="Vui lòng chọn một địa chỉ từ danh sách trên"
                        />
                      </div>
                    )}
                    <div className="flex justify-end items-center pt-4">
                      <Button
                        onClick={handleCalculateShippingAndContinue}
                        disabled={!isStep1Valid || isCalculatingShippingFee}
                        className="px-8"
                      >
                        {isCalculatingShippingFee ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tính phí...
                          </>
                        ) : (
                          <>
                            Tiếp tục
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <>
                  <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Phương thức thanh toán
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Thanh toán an toàn qua cổng VNPay
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup
                        value={orderData.paymentMethod}
                        onValueChange={(value) =>
                          handleInputChange("paymentMethod", value)
                        }
                        className="space-y-3"
                      >
                        {/* VNPay Payment Method */}
                        <div
                          className={`relative flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer hover:bg-muted/50 ${
                            orderData.paymentMethod === "vnpay"
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          <RadioGroupItem
                            value="vnpay"
                            id="vnpay"
                            className="mt-1"
                          />
                          <Label
                            htmlFor="vnpay"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <CreditCard className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-semibold">
                                  Thanh toán qua VNPay
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Thanh toán trực tuyến an toàn qua cổng VNPay.
                                  Hỗ trợ tất cả thẻ tín dụng, thẻ ghi nợ và ví
                                  điện tử.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                  <Shield className="h-3 w-3" />
                                  Bảo mật cao - Thanh toán online tối ưu
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Momo Payment Method (thêm sau) - Ẩn tạm thời */}
                        {/*
                      <div className={`relative flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer hover:bg-muted/50 ${
                        orderData.paymentMethod === "momo"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-muted-foreground/30"
                      }`}>
                        <RadioGroupItem value="momo" id="momo" className="mt-1" />
                        <Label htmlFor="momo" className="flex-1 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold">Thanh toán qua Momo</p>
                              <p className="text-sm text-muted-foreground">
                                Thanh toán nhanh qua ứng dụng Momo.
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      */}
                      </RadioGroup>

                      {/* VNPay Information */}
                      {orderData.paymentMethod === "vnpay" && (
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-3 text-blue-900">
                              Thông tin thanh toán VNPay:
                            </h4>
                            <div className="space-y-2 text-sm text-blue-800">
                              <p>
                                ✓ Thanh toán qua tất cả ngân hàng tại Việt Nam
                              </p>
                              <p>
                                ✓ Hỗ trợ ví điện tử (VN Pay, Momo, Zalo Pay,
                                ...)
                              </p>
                              <p>
                                ✓ Hoàn tiền nhanh chóng nếu giao dịch thất bại
                              </p>
                              <p>✓ An toàn, bảo mật, được chứng thực</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={orderData.agreeTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange("agreeTerms", checked)
                            }
                          />
                          <Label htmlFor="terms" className="text-sm">
                            Tôi đồng ý với{" "}
                            <Link
                              href="/polycies"
                              className="text-primary hover:underline"
                            >
                              điều khoản và điều kiện
                            </Link>{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="px-6"
                          disabled={isSubmitting}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Quay lại
                        </Button>
                        <Button
                          onClick={handleSubmitOrder}
                          disabled={
                            !isStep2Valid || isSubmitting || isCreatingPayment
                          }
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-2.5 shadow-lg disabled:opacity-50"
                        >
                          {isSubmitting || isCreatingPayment ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              {isSubmitting
                                ? "Đang tạo đơn hàng..."
                                : "Đang khởi tạo thanh toán..."}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Hoàn tất đặt hàng
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-lg border-0 bg-card/50 backdrop-blur-sm pt-2 gap-3">
                <CardHeader className="border-b pb-2!">
                  <CardTitle className="flex items-center justify-between">
                    <span>Đơn hàng của bạn</span>
                    <Badge variant="secondary" className="font-normal">
                      {getTotalItems()} sản phẩm
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4">
                  <div className="space-y-3">
                    {items.map((item) => {
                      const itemName =
                        item.koiFish?.rfid ||
                        item.packetFish?.name ||
                        "Sản phẩm";
                      const itemImage =
                        item.koiFish?.images?.[0] ||
                        item.packetFish?.images?.[0] ||
                        "/placeholder.svg";
                      const itemVariety =
                        item.koiFish?.variety?.varietyName ||
                        item.packetFish?.varietyPacketFishes
                          .map((variety) => variety?.varietyName)
                          .join(", ") ||
                        "";

                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <Image
                              src={itemImage}
                              alt={itemName}
                              className="object-cover"
                              fill
                              sizes="56px"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="font-semibold text-sm truncate">
                              {itemName}
                            </p>
                            {itemVariety && (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1.5 py-0.5"
                                >
                                  {itemVariety}
                                </Badge>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                              {getFishSizeLabel(item.koiFish?.size)}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                                x{item.quantity}
                              </span>
                              <span className="font-bold text-sm text-primary">
                                {formatCurrency(item.itemTotalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tạm tính ({getTotalItems()} sản phẩm)
                      </span>
                      <span className="font-medium">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">
                          Phí vận chuyển
                        </span>
                        {shippingFeeData && (
                          <button
                            type="button"
                            onClick={() => setShowShippingFeeDialog(true)}
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Chi tiết phí vận chuyển"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="text-right">
                        {shippingFeeData ? (
                          <span
                            className={`font-medium ${
                              shippingFeeData.totalShippingFee === 0
                                ? "text-green-600"
                                : ""
                            }`}
                          >
                            {shippingFeeData.totalShippingFee === 0
                              ? "Miễn phí"
                              : formatPrice(shippingFeeData.totalShippingFee)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Chưa tính
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Thuế VAT</span>
                      <span className="text-muted-foreground">Đã bao gồm</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary text-xl">
                        {formatPrice(
                          getTotalPrice() +
                            (shippingFeeData?.totalShippingFee || 0),
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-sm">Chính sách & Ưu đãi</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground p-2 bg-green-50/50 rounded-lg border border-green-200/50">
                        <div className="p-1 bg-green-100 rounded-full">
                          <Shield className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Bảo hành sức khỏe cá 30 ngày</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground p-2 bg-blue-50/50 rounded-lg border border-blue-200/50">
                        <div className="p-1 bg-blue-100 rounded-full">
                          <Truck className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Miễn phí vận chuyển toàn quốc</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground p-2 bg-purple-50/50 rounded-lg border border-purple-200/50">
                        <div className="p-1 bg-purple-100 rounded-full">
                          <CheckCircle className="h-3 w-3 text-purple-600" />
                        </div>
                        <span>Hỗ trợ kỹ thuật 24/7</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Fee Detail Dialog */}
      <ShippingFeeDetailDialog
        open={showShippingFeeDialog}
        onOpenChange={setShowShippingFeeDialog}
        shippingFeeData={shippingFeeData}
      />

      {/* Quick Add Address Modal */}
      <Dialog
        open={showQuickAddModal}
        onOpenChange={(open) => {
          setShowQuickAddModal(open);
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ nhanh</DialogTitle>
            <DialogDescription>
              Nhập thông tin địa chỉ hoặc tìm kiếm trên bản đồ để xác định vị
              trí
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form Fields */}
            <div className="space-y-3">
              {/* Full Address - Read Only */}
              <div className="space-y-1">
                <Label htmlFor="qa-fullAddress" className="text-sm">
                  Địa chỉ đầy đủ
                </Label>
                <Input
                  id="qa-fullAddress"
                  value={quickAddForm.fullAddress}
                  disabled
                  className="h-9 bg-muted/30 text-black font-semibold cursor-not-allowed"
                  placeholder="Tự động điền..."
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <Label htmlFor="qa-city" className="text-sm">
                  Thành phố
                </Label>
                <Input
                  id="qa-city"
                  name="city"
                  placeholder="VD: Hà Nội"
                  value={quickAddForm.city}
                  onChange={handleQuickAddInputChange}
                  disabled={isCreatingAddress}
                  className="h-9"
                />
              </div>

              {/* Ward */}
              <div className="space-y-1">
                <Label htmlFor="qa-ward" className="text-sm">
                  Phường/Xã
                </Label>
                <Input
                  id="qa-ward"
                  name="ward"
                  placeholder="VD: Hàng Trống"
                  value={quickAddForm.ward}
                  onChange={handleQuickAddInputChange}
                  disabled={isCreatingAddress}
                  className="h-9"
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <Label htmlFor="qa-streetAddress" className="text-sm">
                  Số nhà/Đường phố
                </Label>
                <Input
                  id="qa-streetAddress"
                  name="streetAddress"
                  placeholder="VD: 123 Đường ABC"
                  value={quickAddForm.streetAddress}
                  onChange={handleQuickAddInputChange}
                  disabled={isCreatingAddress}
                  className="h-9"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="qa-phone" className="text-sm">
                  Số điện thoại
                </Label>
                <Input
                  id="qa-phone"
                  name="recipientPhone"
                  placeholder="VD: 0987654321"
                  value={quickAddForm.recipientPhone}
                  onChange={handleQuickAddInputChange}
                  disabled={isCreatingAddress}
                  maxLength={10}
                  className="h-9"
                />
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="qa-isDefault"
                  checked={quickAddForm.isDefault}
                  onCheckedChange={handleQuickAddCheckboxChange}
                  disabled={isCreatingAddress}
                />
                <Label
                  htmlFor="qa-isDefault"
                  className="text-xs font-normal cursor-pointer"
                >
                  Đặt làm địa chỉ mặc định
                </Label>
              </div>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-2">
              <CheckoutMap
                latitude={quickAddForm.latitude}
                longitude={quickAddForm.longitude}
                onLocationChange={handleQuickAddMapClick}
                // disabled={isPending}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowQuickAddModal(false)}
              disabled={isCreatingAddress}
            >
              Hủy
            </Button>
            <Button onClick={handleQuickAddSubmit} disabled={isCreatingAddress}>
              {isCreatingAddress ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm địa chỉ
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
