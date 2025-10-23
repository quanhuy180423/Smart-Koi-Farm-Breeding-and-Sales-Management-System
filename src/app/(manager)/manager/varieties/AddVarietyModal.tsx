import * as React from "react";
import {
    Plus,
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
import { VarietyFormState } from "./page";


interface AddVarietyModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newVariety: VarietyFormState;
    setNewVariety: React.Dispatch<React.SetStateAction<VarietyFormState>>;
    handleAddVariety: () => void;
    isPending: boolean;
}

const AddVarietyModal = ({
    isOpen,
    onOpenChange,
    newVariety,
    setNewVariety,
    handleAddVariety,
    isPending,
}: AddVarietyModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                    Thêm Giống Cá mới
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="varietyName" className="text-sm font-medium text-gray-700">
                            Tên giống cá *
                        </Label>
                        <Input
                            id="varietyName"
                            placeholder="Ví dụ: Kohaku, Showa, Huyết Long..."
                            value={newVariety.varietyName}
                            onChange={(e) =>
                                setNewVariety({ ...newVariety, varietyName: e.target.value })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="originCountry"
                            className="text-sm font-medium text-gray-700"
                        >
                            Quốc gia xuất xứ *
                        </Label>
                        <Input
                            id="originCountry"
                            placeholder="Ví dụ: Nhật Bản, Việt Nam"
                            value={newVariety.originCountry}
                            onChange={(e) =>
                                setNewVariety({
                                    ...newVariety,
                                    originCountry: e.target.value,
                                })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="characteristic" className="text-sm font-medium text-gray-700">
                        Đặc điểm/Mô tả
                    </Label>
                    <Textarea
                        id="characteristic"
                        placeholder="Mô tả đặc điểm nổi bật của giống cá này..."
                        value={newVariety.characteristic}
                        onChange={(e) =>
                            setNewVariety({ ...newVariety, characteristic: e.target.value })
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
                        onClick={handleAddVariety}
                        disabled={isPending || !newVariety.varietyName || !newVariety.originCountry}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        Thêm giống cá
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
    </Dialog>
);

export default AddVarietyModal;