import * as React from "react";
import {
    Edit,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    VarietyResponse,
} from "@/lib/api/services/fetchVariety";

interface EditVarietyModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingVariety: VarietyResponse | null;
    setEditingVariety: React.Dispatch<React.SetStateAction<VarietyResponse | null>>;
    handleUpdateVariety: () => void;
    isPending: boolean;
}

const EditVarietyModal = ({
    isOpen,
    onOpenChange,
    editingVariety,
    setEditingVariety,
    handleUpdateVariety,
    isPending,
}: EditVarietyModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                    Chỉnh sửa Giống Cá: {editingVariety?.varietyName}
                </DialogTitle>
            </DialogHeader>
            {editingVariety && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="editVarietyName" className="text-sm font-medium text-gray-700">
                                Tên giống cá *
                            </Label>
                            <Input
                                id="editVarietyName"
                                value={editingVariety.varietyName}
                                onChange={(e) =>
                                    setEditingVariety({
                                        ...editingVariety,
                                        varietyName: e.target.value,
                                    })
                                }
                                className="border-2 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="editOriginCountry"
                                className="text-sm font-medium text-gray-700"
                            >
                                Quốc gia xuất xứ *
                            </Label>
                            <Input
                                id="editOriginCountry"
                                value={editingVariety.originCountry}
                                onChange={(e) =>
                                    setEditingVariety({
                                        ...editingVariety,
                                        originCountry: e.target.value,
                                    })
                                }
                                className="border-2 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="editCharacteristic" className="text-sm font-medium text-gray-700">
                            Đặc điểm/Mô tả
                        </Label>
                        <Textarea
                            id="editCharacteristic"
                            value={editingVariety.characteristic}
                            onChange={(e) =>
                                setEditingVariety({
                                    ...editingVariety,
                                    characteristic: e.target.value,
                                })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="pt-4 border-t mt-6">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="px-6"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpdateVariety}
                            disabled={isPending || !editingVariety.varietyName || !editingVariety.originCountry}
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Edit className="mr-2 h-4 w-4" />
                            )}
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default EditVarietyModal;