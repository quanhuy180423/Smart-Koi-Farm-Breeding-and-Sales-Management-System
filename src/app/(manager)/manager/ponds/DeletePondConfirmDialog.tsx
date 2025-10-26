import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PondResponse } from "@/lib/api/services/fetchPond";
import { Loader2, Trash2 } from "lucide-react";

interface DeletePondConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pondToDelete: PondResponse | null;
  onConfirm: () => void;
  isPending: boolean;
}

const DeletePondConfirmDialog = ({
  isOpen,
  onOpenChange,
  pondToDelete,
  onConfirm,
  isPending,
}: DeletePondConfirmDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Xác nhận xóa Hồ cá</DialogTitle>
        <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
      </DialogHeader>
      <p>
        Bạn có chắc chắn muốn xóa hồ cá{" "}
        <span className="font-semibold text-red-600">
          {pondToDelete?.pondName}
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

export default DeletePondConfirmDialog;
