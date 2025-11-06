"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShippingFeeCalculateResponse,
  ShippingBox,
} from "@/lib/api/services/fetchShippingFee";
import { Separator } from "@/components/ui/separator";

interface ShippingFeeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shippingFeeData: ShippingFeeCalculateResponse | null;
}

export function ShippingFeeDetailDialog({
  open,
  onOpenChange,
  shippingFeeData,
}: ShippingFeeDetailDialogProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết phí vận chuyển</DialogTitle>
          <DialogDescription>
            Tính toán dựa trên địa chỉ giao hàng và sản phẩm trong giỏ
          </DialogDescription>
        </DialogHeader>

        {shippingFeeData && (
          <div className="space-y-4 py-4">
            {/* Boxes Information */}
            {shippingFeeData.boxes && shippingFeeData.boxes.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Thông tin thùng:</p>
                <div className="space-y-2">
                  {shippingFeeData.boxes.map(
                    (box: ShippingBox, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{box.boxName}</p>
                            <p className="text-xs text-muted-foreground">
                              Số lượng: {box.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {formatPrice(box.subtotal)}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatPrice(box.feePerBox)}/thùng
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            <Separator className="my-2" />

            {/* Fee Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Phí theo thùng:</span>
                <span className="font-semibold">
                  {formatPrice(shippingFeeData.boxFee)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Phí theo khoảng cách:
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ({shippingFeeData.distanceKm} km)
                  </p>
                </div>
                <span className="font-semibold">
                  {formatPrice(shippingFeeData.distanceFee)}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-center text-base font-bold bg-primary/5 p-3 rounded-lg border border-primary/20">
                <span>Tổng phí vận chuyển:</span>
                <span className="text-primary">
                  {formatPrice(shippingFeeData.totalShippingFee)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {shippingFeeData.notes && (
              <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">Ghi chú:</span>{" "}
                  {shippingFeeData.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
