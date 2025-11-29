"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useDeletePattern } from "@/hooks/usePattern";

interface DeletePatternConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patternId: number | null;
  patternName: string | null;
}

export default function DeletePatternConfirmDialog({
  isOpen,
  onOpenChange,
  patternId,
  patternName,
}: DeletePatternConfirmDialogProps) {
  const { mutate: deletePattern, isPending } = useDeletePattern();

  const handleDelete = () => {
    if (patternId) {
      deletePattern(patternId, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa hoa văn `&quot;`
            <span className="font-semibold">{patternName}</span>`&quot;`? Hành
            động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
