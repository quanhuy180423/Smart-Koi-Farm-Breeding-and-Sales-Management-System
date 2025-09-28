"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState({
    // Customer Info
    fullName: "",
    email: "",
    phone: "",

    // Shipping Address
    address: "",
    ward: "",
    district: "",
    city: "",

    // Payment
    paymentMethod: "cod",

    // Notes
    notes: "",

    // Terms
    agreeTerms: false,
    subscribeNewsletter: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random failure for testing (remove in production)
      if (Math.random() < 0.3) {
        // 30% chance of failure for testing
        throw new Error("Simulated payment failure");
      }

      // Here you would typically send the order to your backend
      console.log("Order submitted:", {
        ...orderData,
        items,
        total: getTotalPrice(),
      });

      // Clear cart and redirect to success page
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Error submitting order:", error);
      // Redirect to failure page
      router.push("/checkout/failure");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = orderData.fullName && orderData.email && orderData.phone;
  const isStep2Valid =
    orderData.address && orderData.ward && orderData.district && orderData.city;
  const isStep3Valid = orderData.paymentMethod && orderData.agreeTerms;

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
                    Thông tin
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
                    Giao hàng
                  </span>
                </div>
                <div className="w-4 md:w-8 h-px bg-border" />
                <div
                  className={`flex items-center space-x-2 transition-colors ${
                    step >= 3 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step >= 3
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    3
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
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Thông tin khách hàng
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng điền đầy đủ thông tin để chúng tôi liên hệ xác
                      nhận đơn hàng
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Họ và tên <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          value={orderData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          placeholder="Nhập họ và tên đầy đủ"
                          className={`transition-colors ${
                            orderData.fullName
                              ? "border-green-500 bg-green-50/50"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Số điện thoại{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          value={orderData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="0xxxxxxxxx"
                          className={`transition-colors ${
                            orderData.phone
                              ? "border-green-500 bg-green-50/50"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Địa chỉ email{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={orderData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="example@email.com"
                        className={`transition-colors ${
                          orderData.email
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
                      <Button
                        onClick={() => setStep(2)}
                        disabled={!isStep1Valid}
                        className="px-8"
                      >
                        Tiếp tục
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Địa chỉ giao hàng
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Chúng tôi sẽ giao cá Koi tận nơi theo địa chỉ bạn cung cấp
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Địa chỉ cụ thể{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={orderData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Số nhà, tên đường (VD: 123 Đường ABC, Khu vực XYZ)"
                        className={`transition-colors ${
                          orderData.address
                            ? "border-green-500 bg-green-50/50"
                            : ""
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="ward" className="text-sm font-medium">
                          Phường/Xã <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="ward"
                          value={orderData.ward}
                          onChange={(e) =>
                            handleInputChange("ward", e.target.value)
                          }
                          placeholder="Phường/Xã"
                          className={`transition-colors ${
                            orderData.ward
                              ? "border-green-500 bg-green-50/50"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="district"
                          className="text-sm font-medium"
                        >
                          Quận/Huyện <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="district"
                          value={orderData.district}
                          onChange={(e) =>
                            handleInputChange("district", e.target.value)
                          }
                          placeholder="Quận/Huyện"
                          className={`transition-colors ${
                            orderData.district
                              ? "border-green-500 bg-green-50/50"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          Tỉnh/Thành phố{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={orderData.city}
                          onValueChange={(value) =>
                            handleInputChange("city", value)
                          }
                        >
                          <SelectTrigger
                            className={`w-full transition-colors ${
                              orderData.city
                                ? "border-green-500 bg-green-50/50"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hanoi">Hà Nội</SelectItem>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="danang">Đà Nẵng</SelectItem>
                            <SelectItem value="haiphong">Hải Phòng</SelectItem>
                            <SelectItem value="cantho">Cần Thơ</SelectItem>
                            <SelectItem value="other">
                              Tỉnh/Thành khác
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Ghi chú đặc biệt (tùy chọn)
                      </Label>
                      <Textarea
                        id="notes"
                        value={orderData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        placeholder="Ghi chú về thời gian giao hàng, yêu cầu đặc biệt..."
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        VD: Giao hàng sau 5h chiều, liên hệ trước khi giao...
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="px-6"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                        className="px-8"
                      >
                        Tiếp tục
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Phương thức thanh toán
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Chọn phương thức thanh toán phù hợp với bạn
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
                      <div
                        className={`relative flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer hover:bg-muted/50 ${
                          orderData.paymentMethod === "cod"
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <RadioGroupItem value="cod" id="cod" className="mt-1" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                              <Truck className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold">
                                Thanh toán khi nhận hàng (COD)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Thanh toán bằng tiền mặt khi nhận cá. An toàn và
                                thuận tiện.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Được khuyến khích
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div
                        className={`relative flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer hover:bg-muted/50 ${
                          orderData.paymentMethod === "bank"
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <RadioGroupItem
                          value="bank"
                          id="bank"
                          className="mt-1"
                        />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold">
                                Chuyển khoản ngân hàng
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Chuyển khoản trước khi giao hàng. Xử lý nhanh
                                chóng.
                              </p>
                              <div className="flex items-center gap-2 text-xs text-blue-600">
                                <Shield className="h-3 w-3" />
                                Bảo mật cao
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {orderData.paymentMethod === "bank" && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">
                            Thông tin chuyển khoản:
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Ngân hàng:</strong> Vietcombank
                            </p>
                            <p>
                              <strong>Số tài khoản:</strong> 1234567890
                            </p>
                            <p>
                              <strong>Chủ tài khoản:</strong> TRANG TRAI CA KOI
                            </p>
                            <p>
                              <strong>Nội dung:</strong> [Họ tên] - [Số điện
                              thoại]
                            </p>
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
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={orderData.subscribeNewsletter}
                          onCheckedChange={(checked) =>
                            handleInputChange("subscribeNewsletter", checked)
                          }
                        />
                        <Label htmlFor="newsletter" className="text-sm">
                          Đăng ký nhận thông tin khuyến mãi
                        </Label>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="px-6"
                        disabled={isSubmitting}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button
                        onClick={handleSubmitOrder}
                        disabled={!isStep3Valid || isSubmitting}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-2.5 shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Đang xử lý...
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
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover"
                            fill
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-semibold text-sm truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0.5"
                            >
                              {item.variety}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.size} • {item.age}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                              x{item.quantity}
                            </span>
                            <span className="font-bold text-sm text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
