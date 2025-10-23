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
    PondTypeResponse,
} from "@/lib/api/services/fetchPondType";

interface DeletePondTypeConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    pondTypeToDelete: PondTypeResponse | null;
    onConfirm: () => void;
    isPending: boolean;
}

const DeletePondTypeConfirmDialog = ({
    isOpen,
    onOpenChange,
    pondTypeToDelete,
    onConfirm,
    isPending,
}: DeletePondTypeConfirmDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Xác nhận xóa Loại Hồ</DialogTitle>
                <DialogDescription>
                    Hành động này không thể hoàn tác.
                </DialogDescription>
            </DialogHeader>
            <p>
                Bạn có chắc chắn muốn xóa loại hồ{" "}
                <span className="font-semibold text-red-600">
                    {pondTypeToDelete?.typeName}
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

export default DeletePondTypeConfirmDialog;