"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCart, useConverCartToOrder } from "@/hooks/useCart";
import { useCreatePayment } from "@/hooks/useOrderPayment";
import { PaymentMethod } from "@/lib/api/services/fetchOrderPayment";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { getFishSizeLabel } from "@/lib/utils/enum";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading, isError, refetch } = useGetCart();
  const { mutate: convertToOrder, isPending: isSubmitting } =
    useConverCartToOrder();
  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePayment();

  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    // Shipping Info
    shippingAddress: "",
    contactNumber: "",

    // Payment
    paymentMethod: "vnpay",

    // Terms
    agreeTerms: false,
    subscribeNewsletter: false,
  });

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

  const handleSubmitOrder = () => {
    convertToOrder(
      {
        shippingFee: 0,
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

  const isStep1Valid = orderData.shippingAddress && orderData.contactNumber;
  const isStep2Valid = orderData.paymentMethod && orderData.agreeTerms;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-bold mb-4">Đang tải giỏ hàng...</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Vui lòng chờ một chút
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-destructive/10 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Lỗi khi tải giỏ hàng</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Có lỗi xảy ra. Vui lòng thử lại.
            </p>
            <div className="space-y-4">
              <Button size="lg" className="px-8" onClick={() => refetch()}>
                <Loader2 className="mr-2 h-4 w-4" />
                Tải lại
              </Button>
              <div>
                <Button asChild variant="outline" size="lg" className="px-11!">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Về trang chủ
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-muted/50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/catalog">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Xem danh mục cá Koi
                </Link>
              </Button>
              <div>
                <Button asChild variant="outline" size="lg" className="px-11!">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Về trang chủ
                  </Link>
                </Button>
              </div>
            </div>
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
                      Vui lòng cung cấp địa chỉ giao hàng và số liên hệ
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="shippingAddress"
                        className="text-sm font-medium"
                      >
                        Địa chỉ giao hàng{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shippingAddress"
                        value={orderData.shippingAddress}
                        onChange={(e) =>
                          handleInputChange("shippingAddress", e.target.value)
                        }
                        placeholder="VD: 123 Đường ABC, Phường XYZ, Quận ABC, TP. Hồ Chí Minh"
                        className={`transition-colors ${
                          orderData.shippingAddress
                            ? "border-green-500 bg-green-50/50"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="contactNumber"
                        className="text-sm font-medium"
                      >
                        Số điện thoại liên hệ{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contactNumber"
                        value={orderData.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                        placeholder="0xxxxxxxxx"
                        className={`transition-colors ${
                          orderData.contactNumber
                            ? "border-green-500 bg-green-50/50"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <p className="text-xs text-muted-foreground">
                        Các trường có dấu{" "}
                        <span className="text-destructive">*</span> là bắt buộc
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="px-6"
                        >
                          Bỏ qua
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!isStep1Valid}
                          className="px-8"
                        >
                          Tiếp tục
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
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
                                Thanh toán trực tuyến an toàn qua cổng VNPay. Hỗ
                                trợ tất cả thẻ tín dụng, thẻ ghi nợ và ví điện
                                tử.
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
                              ✓ Hỗ trợ ví điện tử (VN Pay, Momo, Zalo Pay, ...)
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển
                      </span>
                      <span className="text-green-600 font-medium">
                        Miễn phí
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Thuế VAT</span>
                      <span className="text-muted-foreground">Đã bao gồm</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary text-xl">
                        {formatPrice(getTotalPrice())}
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
    </div>
  );
}
