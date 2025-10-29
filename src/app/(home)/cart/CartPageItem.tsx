// src/components/cart/CartPageItem.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteItem, useUpdateItem } from "@/hooks/useCart";
import { CartItemResponse } from "@/lib/api/services/fetchCart";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartPageItemProps {
    item: CartItemResponse;
}

export function CartPageItem({ item }: CartPageItemProps) {
    const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
    const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

    const handleUpdateQuantity = (newQuantity: number) => {
        updateItem({ id: item.id, item: { quantity: newQuantity } });
    };

    const handleConfirmRemove = () => {
        deleteItem(item.id);
    };

    const isMutating = isUpdating || isDeleting;

    return (
        <Card className={`py-0 transition-opacity ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardContent className="p-4 md:p-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="relative w-full h-48 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0 border">
                        <Image
                            src={item.koiFishImage || item.packetFishImage || "/placeholder.svg"}
                            alt={item.koiFishName || item.packetFishName || ""}
                            className="object-cover"
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 96px, 160px"
                        />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3 sm:space-y-2">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 pr-2">
                                <h3 className="font-semibold text-lg sm:text-base md:text-lg line-clamp-2">
                                    {item.koiFishName || item.packetFishName || ""}
                                </h3>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={isMutating}
                                        className="text-destructive hover:text-white hover:bg-destructive flex-shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                                        <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
                                    </DialogHeader>
                                    <p>
                                        Bạn có chắc muốn xóa{" "}
                                        <span className="font-semibold text-destructive">{item.koiFishName || item.packetFishName}</span>?
                                    </p>
                                    <DialogFooter className="mt-4">
                                        <Button variant="outline">Hủy</Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleConfirmRemove}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Xác nhận xóa
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex items-end justify-between sm:flex-row sm:items-center sm:justify-between gap-3">
                            {item.packetFishId != null ? (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent"
                                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                                        disabled={isMutating || item.quantity <= 1}
                                    >
                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
                                    </Button>
                                    <span className="w-12 text-center font-medium bg-muted px-2 py-1 rounded text-sm">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent"
                                        onClick={() => handleUpdateQuantity(item.quantity + 1)}
                                        disabled={isMutating}
                                    >
                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-8"></div>
                            )}
                            <div className="text-right">
                                <p className="font-bold text-lg sm:text-base md:text-lg text-primary">
                                    {formatCurrency(item.itemTotalPrice || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}