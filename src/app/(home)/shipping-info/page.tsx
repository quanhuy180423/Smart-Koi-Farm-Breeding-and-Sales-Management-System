"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  Loader2,
  AlertCircle,
  Info,
  Calculator,
} from "lucide-react";
import formatCurrency from "@/lib/utils/numbers";
import { useGetAllShippingBoxes } from "@/hooks/useShippingBox";
import { useGetAllShippingDistances } from "@/hooks/useShippingDistance";

export default function ShippingInfoPage() {
  const {
    data: shippingBoxes,
    isLoading: isLoadingBoxes,
    isError: isErrorBoxes,
  } = useGetAllShippingBoxes();

  const {
    data: shippingDistances,
    isLoading: isLoadingDistances,
    isError: isErrorDistances,
  } = useGetAllShippingDistances();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Thông tin vận chuyển
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Chi tiết về phí vận chuyển theo kích thước hộp và khoảng cách giao
          hàng
        </p>
      </div>

      <div className="space-y-8">
        {/* Box Size Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Kích thước hộp vận chuyển</CardTitle>
                  <CardDescription>
                    Phí vận chuyển dựa trên kích thước hộp và sức chứa cá Koi
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBoxes ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải thông tin...
                  </span>
                </div>
              ) : isErrorBoxes ? (
                <div className="flex items-center justify-center p-12">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <span className="ml-2 text-muted-foreground">
                    Có lỗi khi tải thông tin
                  </span>
                </div>
              ) : !shippingBoxes || shippingBoxes.length === 0 ? (
                <div className="text-center p-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có thông tin về kích thước hộp
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shippingBoxes.map((box) => (
                    <Card
                      key={box.id}
                      className="relative hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{box.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground italic">
                          {box.notes}
                        </p>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Phí vận chuyển:
                            </span>
                            <span className="font-bold text-lg text-primary">
                              {formatCurrency(box.fee)}
                            </span>
                          </div>
                          <div className="border-t pt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Số lượng cá:
                              </span>
                              <Badge variant="outline" className="bg-blue-50">
                                {box.maxKoiCount || "∞"} con
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Kích thước cá:
                              </span>
                              <Badge variant="outline" className="bg-green-50">
                                {box.maxKoiSizeInch || "∞"} inch
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Cân nặng hộp:
                              </span>
                              <Badge variant="outline" className="bg-amber-50">
                                {box.weightCapacityLb} lb
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* {shippingBoxes && shippingBoxes.length > 0 && (
                <div className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <p>
                        Hộp vận chuyển sẽ được chọn tự động dựa trên kích thước
                        và số lượng cá trong đơn hàng của bạn. Phí vận chuyển
                        được tính theo hộp phù hợp nhất.
                      </p>
                    </div>
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Distance Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Phí vận chuyển theo khoảng cách</CardTitle>
                  <CardDescription>
                    Phí vận chuyển được tính dựa trên khoảng cách giao hàng
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDistances ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải thông tin...
                  </span>
                </div>
              ) : isErrorDistances ? (
                <div className="flex items-center justify-center p-12">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <span className="ml-2 text-muted-foreground">
                    Có lỗi khi tải thông tin
                  </span>
                </div>
              ) : !shippingDistances || shippingDistances.length === 0 ? (
                <div className="text-center p-12">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Chưa có thông tin về khoảng cách vận chuyển
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shippingDistances.map((distance) => {
                    const exampleDistance = distance.maxDistanceKm;
                    const exampleCost =
                      distance.baseFee + exampleDistance * distance.pricePerKm;

                    return (
                      <Card
                        key={distance.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {distance.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {distance.minDistanceKm} -{" "}
                              {distance.maxDistanceKm} km
                            </Badge>
                          </div>
                          {distance.description && (
                            <CardDescription className="text-sm">
                              {distance.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">
                                Phí cơ sở
                              </div>
                              <div className="font-bold text-lg">
                                {formatCurrency(distance.baseFee)}
                              </div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">
                                Giá mỗi km
                              </div>
                              <div className="font-bold text-lg">
                                {formatCurrency(distance.pricePerKm)}
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <div className="text-sm text-muted-foreground mb-2">
                              Công thức tính phí:
                            </div>
                            <div className="text-sm bg-muted p-2 rounded">
                              Phí cơ sở + (Khoảng cách × Giá/km)
                            </div>
                          </div>

                          <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                            <div className="text-sm text-muted-foreground mb-1">
                              Ví dụ cho {exampleDistance}km:
                            </div>
                            <div className="text-sm mb-1">
                              {formatCurrency(distance.baseFee)} + (
                              {exampleDistance} ×{" "}
                              {formatCurrency(distance.pricePerKm)})
                            </div>
                            <div className="font-bold text-lg text-primary">
                              = {formatCurrency(exampleCost)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* {shippingDistances && shippingDistances.length > 0 && (
                <div className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <p>
                        Phí vận chuyển cuối cùng sẽ được tính dựa trên khoảng
                        cách thực tế từ trại cá đến địa chỉ giao hàng của bạn.
                        Vui lòng liên hệ để biết chính xác phí vận chuyển.
                      </p>
                    </div>
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Total Fee Formula Section */}
        <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Công thức tính tổng phí vận chuyển</CardTitle>
                <CardDescription>
                  Cách tính phí vận chuyển cuối cùng cho đơn hàng của bạn
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-primary/20">
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-primary">
                  Tổng phí vận chuyển
                </div>
                <div className="text-xl font-semibold text-muted-foreground">
                  =
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-muted-foreground mb-1">
                      Phí hộp vận chuyển
                    </div>
                    <div className="font-bold text-lg text-blue-700">
                      Phí hộp
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-center">+</div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-muted-foreground mb-1">
                      Phí khoảng cách
                    </div>
                    <div className="font-bold text-sm text-green-700">
                      Phí cơ sở + (Km × Giá/km)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">
                      Phí hộp
                    </div>
                    <div className="text-sm text-blue-800">
                      Được chọn tự động dựa trên số lượng và kích thước cá trong
                      đơn hàng
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                <div className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-green-900 mb-1">
                      Phí khoảng cách
                    </div>
                    <div className="text-sm text-green-800">
                      Được tính dựa trên khoảng cách từ trại đến địa chỉ giao
                      hàng
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-2">Ví dụ minh họa:</p>
                  <div className="space-y-1">
                    <p>
                      • Bạn đặt 3 con cá Koi kích thước 8 inch → Chọn hộp Medium
                      (
                      {shippingBoxes && shippingBoxes.length > 0
                        ? formatCurrency(shippingBoxes[0].fee)
                        : "250.000đ"}
                      )
                    </p>
                    <p>
                      • Khoảng cách giao hàng 30km, giá 2.000đ/km, phí cơ sở
                      30.000đ
                    </p>
                    <p className="font-bold text-amber-700 mt-2">
                      → Tổng phí ={" "}
                      {shippingBoxes && shippingBoxes.length > 0
                        ? formatCurrency(shippingBoxes[0].fee)
                        : "250.000đ"}{" "}
                      + (30.000đ + 30km × 2.000đ) ={" "}
                      {shippingBoxes && shippingBoxes.length > 0
                        ? formatCurrency(
                            shippingBoxes[0].fee + 30000 + 30 * 2000,
                          )
                        : "340.000đ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
