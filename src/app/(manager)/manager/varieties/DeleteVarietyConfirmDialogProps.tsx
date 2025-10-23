import * as React from "react";
import {
    Trash2,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    VarietyResponse,
} from "@/lib/api/services/fetchVariety";

interface DeleteVarietyConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    varietyToDelete: VarietyResponse | null;
    onConfirm: () => void;
    isPending: boolean;
}

const DeleteVarietyConfirmDialog = ({
    isOpen,
    onOpenChange,
    varietyToDelete,
    onConfirm,
    isPending,
}: DeleteVarietyConfirmDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Xác nhận xóa Giống Cá</DialogTitle>
                <DialogDescription>
                    Hành động này không thể hoàn tác.
                </DialogDescription>
            </DialogHeader>
            <p>
                Bạn có chắc chắn muốn xóa giống cá{" "}
                <span className="font-semibold text-red-600">
                    {varietyToDelete?.varietyName}
                </span>{" "}
                này không?
            </p>
            <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Hủy
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={onConfirm}
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Xác nhận Xóa
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default DeleteVarietyConfirmDialog;