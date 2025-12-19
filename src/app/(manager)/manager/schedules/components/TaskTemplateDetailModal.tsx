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
    <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="text-lg font-semibold">
          Chi tiết công việc
        </DialogTitle>
        <DialogDescription>
          Thông tin chi tiết về mẫu công việc
        </DialogDescription>
      </DialogHeader>
      {selectedTask && (
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Task Name Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-xs text-gray-600 uppercase tracking-wide">
              Tên công việc
            </Label>
            <p className="text-base font-semibold text-gray-900 mt-1.5">
              {selectedTask.taskName}
            </p>
          </div>

          {/* Duration Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-xs text-gray-600 uppercase tracking-wide">
              Thời lượng mặc định
            </Label>
            <p className="text-base text-gray-900 mt-1.5">
              <span className="font-semibold">
                {selectedTask.defaultDuration}
              </span>{" "}
              phút
            </p>
          </div>

          {/* Description Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-xs text-gray-600 uppercase tracking-wide">
              Mô tả
            </Label>
            <p className="text-sm text-gray-900 mt-1.5 whitespace-pre-wrap leading-relaxed">
              {selectedTask.description}
            </p>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-xs text-gray-600 uppercase tracking-wide">
              Ghi chú
            </Label>
            <p className="text-sm text-gray-900 mt-1.5 whitespace-pre-wrap leading-relaxed">
              {selectedTask.notesTask || (
                <span className="italic text-gray-500">Không có ghi chú</span>
              )}
            </p>
          </div>

          {/* Metadata section */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <div>
                <span className="font-medium">Tạo lúc:</span>{" "}
                <span className="text-gray-700">
                  {formatDate(
                    selectedTask.createdAt,
                    DATE_FORMATS.DATETIME_24H,
                  )}
                </span>
              </div>
              {selectedTask.updatedAt && (
                <div>
                  <span className="font-medium">Cập nhật lúc:</span>{" "}
                  <span className="text-gray-700">
                    {formatDate(
                      selectedTask.updatedAt,
                      DATE_FORMATS.DATETIME_24H,
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default TaskTemplateDetailModal;
