import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    VarietyResponse,
} from "@/lib/api/services/fetchVariety";

interface VarietyDetailModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedVariety: VarietyResponse | null;
}

const VarietyDetailModal = ({
    isOpen,
    onOpenChange,
    selectedVariety,
}: VarietyDetailModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                    Chi tiết Giống Cá: {selectedVariety?.varietyName}
                </DialogTitle>
            </DialogHeader>
            {selectedVariety && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Tên giống
                                </Label>
                                <p className="text-base font-semibold text-gray-800">
                                    {selectedVariety.varietyName}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Quốc gia xuất xứ
                                </Label>
                                <p className="text-base text-gray-800">
                                    {selectedVariety.originCountry}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 col-span-2">
                            <Label className="text-sm font-medium text-gray-600">
                                Đặc điểm/Mô tả
                            </Label>
                            <p className="text-base text-gray-800">
                                {selectedVariety.characteristic || "Chưa có mô tả"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default VarietyDetailModal;