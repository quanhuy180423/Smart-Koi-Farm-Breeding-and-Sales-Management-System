import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TaskTemplateResponse } from "@/lib/api/services/fetchTaskTemplate";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";

interface TaskTemplateDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: TaskTemplateResponse | null;
}

const TaskTemplateDetailModal = ({
  isOpen,
  onOpenChange,
  selectedTask,
}: TaskTemplateDetailModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Chi tiết công việc: {selectedTask?.taskName}
        </DialogTitle>
        <DialogDescription>Thông tin chi tiết về công việc</DialogDescription>
      </DialogHeader>
      {selectedTask && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Tên công việc
                </Label>
                <p className="text-base font-semibold text-gray-800 mt-1">
                  {selectedTask.taskName}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Thời lượng mặc định
                </Label>
                <p className="text-base text-gray-800 mt-1">
                  {selectedTask.defaultDuration} phút
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Ghi chú
                </Label>
                <p className="text-base text-gray-800 mt-1 whitespace-pre-wrap">
                  {selectedTask.notesTask || "Không có ghi chú"}
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Mô tả
                </Label>
                <p className="text-base text-gray-800 mt-1 whitespace-pre-wrap">
                  {selectedTask.description}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata section */}
          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <p>
              Tạo lúc:{" "}
              <span className="text-gray-700">
                {formatDate(selectedTask.createdAt, DATE_FORMATS.DATETIME_24H)}
              </span>
            </p>
            {selectedTask.updatedAt && (
              <p>
                Cập nhật lúc:{" "}
                <span className="text-gray-700">
                  {formatDate(
                    selectedTask.updatedAt,
                    DATE_FORMATS.DATETIME_24H,
                  )}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default TaskTemplateDetailModal;
