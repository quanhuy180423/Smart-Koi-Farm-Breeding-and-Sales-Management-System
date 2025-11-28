"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useDeleteIncidentType } from "@/hooks/useIncidentType";

interface DeleteIncidentTypeConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  incidentTypeId: number | null;
  incidentTypeName: string | null;
}

export default function DeleteIncidentTypeConfirmDialog({
  isOpen,
  onOpenChange,
  incidentTypeId,
  incidentTypeName,
}: DeleteIncidentTypeConfirmDialogProps) {
  const { mutate: deleteIncidentType, isPending } = useDeleteIncidentType();

  const handleConfirmDelete = () => {
    if (incidentTypeId !== null) {
      deleteIncidentType(incidentTypeId, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Xóa loại sự cố
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa loại sự cố `&quot;`{incidentTypeName}
            `&quot;`? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
