import { PondResponse } from "@/lib/api/services/fetchPond";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getPondStatusLabel } from "@/lib/utils/enum";
import { formatDate } from "@/lib/utils/dates";

interface PondDetailModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPond: PondResponse | null;
}

const PondDetailModal = ({ isOpen, onOpenChange, selectedPond }: PondDetailModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                    Chi tiết hồ cá: {selectedPond?.pondName}
                </DialogTitle>
            </DialogHeader>
            {selectedPond && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Tên hồ
                                </Label>
                                <p className="text-base font-semibold text-gray-800">
                                    {selectedPond.pondName}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Địa điểm
                                </Label>
                                <p className="text-base text-gray-800">
                                    {selectedPond.location}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Khu vực
                                </Label>
                                <p className="text-base text-gray-800">
                                    {selectedPond.areaName}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Kích thước (Dài x Rộng)
                                </Label>
                                <p className="text-base text-gray-800">
                                    {selectedPond.lengthMeters}m x {selectedPond.widthMeters}m
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Độ sâu
                                </Label>
                                <p className="text-base text-gray-800">
                                    {selectedPond.depthMeters}m
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Sức chứa (Lít)
                                </Label>
                                <p className="text-base text-gray-800">
                                    {selectedPond.capacityLiters.toLocaleString()} Lít
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">
                                    Trạng thái
                                </Label>
                                <div className="mt-1">
                                    <span
                                        className={
                                            getPondStatusLabel(selectedPond.pondStatus).colorClass
                                        }
                                    >
                                        {getPondStatusLabel(selectedPond.pondStatus).label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-600">
                            Ngày tạo
                        </Label>
                        <p className="text-base text-gray-800 mt-1">
                            {formatDate(selectedPond.createdAt, "HH:mm dd/MM/yyyy")}
                        </p>
                    </div>
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default PondDetailModal;