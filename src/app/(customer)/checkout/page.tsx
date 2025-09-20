"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
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

  const handleSubmitOrder = () => {
    // Here you would typically send the order to your backend
    console.log("Order submitted:", {
      ...orderData,
      items,
      total: getTotalPrice(),
    });

    // Clear cart and redirect to success page
    clearCart();
    router.push("/checkout/success");
  };

  const isStep1Valid = orderData.fullName && orderData.email && orderData.phone;
  const isStep2Valid =
    orderData.address && orderData.ward && orderData.district && orderData.city;
  const isStep3Valid = orderData.paymentMethod && orderData.agreeTerms;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-muted-foreground mb-8">
            Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.
          </p>
          <Button asChild>
            <Link href="/catalog">Xem danh mục cá Koi</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại giỏ hàng
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Thanh toán</h1>
              <p className="text-muted-foreground">
                {getTotalItems()} sản phẩm
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  1
                </div>
                <span className="font-medium">Thông tin</span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div
                className={`flex items-center space-x-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  2
                </div>
                <span className="font-medium">Giao hàng</span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div
                className={`flex items-center space-x-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  3
                </div>
                <span className="font-medium">Thanh toán</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input
                          id="fullName"
                          value={orderData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          value={orderData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={orderData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        disabled={!isStep1Valid}
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Địa chỉ giao hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Địa chỉ cụ thể *</Label>
                      <Input
                        id="address"
                        value={orderData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Số nhà, tên đường"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="ward">Phường/Xã *</Label>
                        <Input
                          id="ward"
                          value={orderData.ward}
                          onChange={(e) =>
                            handleInputChange("ward", e.target.value)
                          }
                          placeholder="Phường/Xã"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        <Input
                          id="district"
                          value={orderData.district}
                          onChange={(e) =>
                            handleInputChange("district", e.target.value)
                          }
                          placeholder="Quận/Huyện"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                        <Select
                          value={orderData.city}
                          onValueChange={(value) =>
                            handleInputChange("city", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tỉnh/thành" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hanoi">Hà Nội</SelectItem>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="danang">Đà Nẵng</SelectItem>
                            <SelectItem value="haiphong">Hải Phong</SelectItem>
                            <SelectItem value="cantho">Cần Thơ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                      <Textarea
                        id="notes"
                        value={orderData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        placeholder="Ghi chú thêm về đơn hàng..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Quay lại
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Phương thức thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={orderData.paymentMethod}
                      onValueChange={(value) =>
                        handleInputChange("paymentMethod", value)
                      }
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">
                                Thanh toán khi nhận hàng (COD)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Thanh toán bằng tiền mặt khi nhận cá
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">
                                Chuyển khoản ngân hàng
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Chuyển khoản trước khi giao hàng
                              </p>
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
                            href="/"
                            className="text-primary hover:underline"
                          >
                            điều khoản và điều kiện
                          </Link>{" "}
                          *
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

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Quay lại
                      </Button>
                      <Button
                        onClick={handleSubmitOrder}
                        disabled={!isStep3Valid}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Đặt hàng
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Đơn hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.variety}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} • {item.age}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs">x{item.quantity}</span>
                            <span className="font-medium text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thuế VAT</span>
                      <span>Đã bao gồm</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      <span>Bảo hành sức khỏe cá 30 ngày</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3" />
                      <span>Miễn phí vận chuyển toàn quốc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      <span>Hỗ trợ kỹ thuật 24/7</span>
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
