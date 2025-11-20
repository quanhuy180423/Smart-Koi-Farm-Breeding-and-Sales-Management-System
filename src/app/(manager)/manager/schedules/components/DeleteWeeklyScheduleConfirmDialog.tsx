"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteWeeklyScheduleConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string | null;
  onConfirm: () => void;
  isPending: boolean;
}

const DeleteWeeklyScheduleConfirmDialog = ({
  isOpen,
  onOpenChange,
  templateName,
  onConfirm,
  isPending,
}: DeleteWeeklyScheduleConfirmDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl">Xóa mẫu lịch</DialogTitle>
            <DialogDescription className="mt-1">
              Hành động này không thể hoàn tác
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-gray-700">
            Bạn có chắc chắn muốn xóa mẫu lịch{" "}
            <span className="font-semibold text-red-600">{templateName}</span>?
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-700">Điều này sẽ:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Xóa mẫu lịch khỏi hệ thống</li>
            <li>Không ảnh hưởng đến các công việc đã tạo</li>
            <li>Không thể khôi phục lại</li>
          </ul>
        </div>
      </div>

      <DialogFooter className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Hủy
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xóa...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Xác nhận xóa
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteWeeklyScheduleConfirmDialog;
