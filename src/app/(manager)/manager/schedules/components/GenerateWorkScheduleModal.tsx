"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  Clock,
  List,
  ChevronDown,
  Plus,
} from "lucide-react";
import StaffSelectionModal from "./StaffSelectionModal";
import PondSelectionModal from "./PondSelectionModal";
import { WeeklyScheduleTemplate } from "@/lib/api/services/fetchWeeklyScheduleTemplate";
import { DayOfWeekEnum } from "@/lib/api/services/fetchWeeklyScheduleTemplate";
import { useGenerateWorkSchedules } from "@/hooks/useWeeklyScheduleTemplate";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import { toLocalDateString } from "@/lib/utils/dates";
import toast from "react-hot-toast";
import { DatePickerSchedule } from "@/components/ui/DatePickerSchedule";

interface GenerateWorkScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templates: WeeklyScheduleTemplate[];
  isLoadingTemplates: boolean;
}

const DAYS_OF_WEEK_VN = {
  [DayOfWeekEnum.Sunday]: "Chủ nhật",
  [DayOfWeekEnum.Monday]: "Thứ 2",
  [DayOfWeekEnum.Tuesday]: "Thứ 3",
  [DayOfWeekEnum.Wednesday]: "Thứ 4",
  [DayOfWeekEnum.Thursday]: "Thứ 5",
  [DayOfWeekEnum.Friday]: "Thứ 6",
  [DayOfWeekEnum.Saturday]: "Thứ 7",
};

export default function GenerateWorkScheduleModal({
  isOpen,
  onOpenChange,
  templates,
  isLoadingTemplates,
}: GenerateWorkScheduleModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [startDate, setStartDate] = useState<string>(
    toLocalDateString(new Date()),
  );
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedPondIds, setSelectedPondIds] = useState<Set<number>>(
    new Set(),
  );
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);

  const { mutate: generate, isPending } = useGenerateWorkSchedules();

  const toggleStaffSelection = (staffId: number) => {
    const newSelection = new Set(selectedStaffIds);
    if (newSelection.has(staffId)) {
      newSelection.delete(staffId);
    } else {
      newSelection.add(staffId);
    }
    setSelectedStaffIds(newSelection);
  };

  const togglePondSelection = (pondId: number) => {
    const newSelection = new Set(selectedPondIds);
    if (newSelection.has(pondId)) {
      newSelection.delete(pondId);
    } else {
      newSelection.add(pondId);
    }
    setSelectedPondIds(newSelection);
  };

  const toggleDayExpanded = (day: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleGenerate = () => {
    if (!selectedTemplateId || !startDate) return;

    if (selectedStaffIds.size === 0) {
      console.log(selectedStaffIds.size);
      toast.error("Vui lòng chọn ít nhất một nhân viên để tạo lịch làm việc.");
      return;
    }

    generate(
      {
        weeklyScheduleTemplateId: selectedTemplateId,
        startDate,
        staffIds: Array.from(selectedStaffIds),
        pondIds: Array.from(selectedPondIds),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedTemplateId(null);
          setStartDate(toLocalDateString(new Date()));
          setSelectedStaffIds(new Set());
          setSelectedPondIds(new Set());
        },
      },
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo lịch làm việc từ mẫu</DialogTitle>
            <DialogDescription>
              Chọn mẫu lịch và ngày bắt đầu để tạo 7 ngày làm việc tiếp theo
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto space-y-6 py-4">
            {/* Start Date Selection */}
            <DatePickerSchedule
              label="Ngày bắt đầu"
              value={startDate}
              onChange={setStartDate}
              minDate={new Date()}
            />

            {/* Staff Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nhân viên *
              </label>
              <Button
                variant="outline"
                className="w-full justify-start h-10"
                onClick={() => setIsStaffModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Chọn nhân viên ({selectedStaffIds.size})
              </Button>
              {selectedStaffIds.size > 0 && (
                <div className="text-xs text-gray-500">
                  Đã chọn {selectedStaffIds.size} nhân viên
                </div>
              )}
            </div>

            {/* Pond Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Hồ (Tùy chọn)
              </label>
              <Button
                variant="outline"
                className="w-full justify-start h-10"
                onClick={() => setIsPondModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Chọn hồ ({selectedPondIds.size})
              </Button>
              {selectedPondIds.size > 0 && (
                <div className="text-xs text-gray-500">
                  Đã chọn {selectedPondIds.size} hồ
                </div>
              )}
            </div>

            {/* Templates List */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Chọn mẫu lịch
              </label>
              {isLoadingTemplates ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : templates.length === 0 ? (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Không có mẫu lịch nào. Vui lòng tạo mẫu lịch trước.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedTemplateId === template.id
                          ? "border-2 border-blue-500 bg-blue-50"
                          : "border border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedTemplateId(template.id)}
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">
                            {template.templateItems.length} công việc
                          </span>
                          {template.isActive && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Hoạt động
                            </span>
                          )}
                        </div>

                        {/* Template Items Preview - Grouped by Day */}
                        {selectedTemplateId === template.id && (
                          <div className="mt-3 pt-3 border-t space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <List className="h-4 w-4 text-blue-600" />
                              <p className="text-sm font-semibold text-gray-900">
                                Chi tiết công việc theo thứ
                              </p>
                            </div>
                            <div className="space-y-2">
                              {Object.values(DayOfWeekEnum).map((dayEnum) => {
                                const dayItems = template.templateItems.filter(
                                  (item) => item.dayOfWeek === dayEnum,
                                );
                                if (dayItems.length === 0) return null;

                                const isExpanded = expandedDays.has(dayEnum);
                                const dayLabel =
                                  DAYS_OF_WEEK_VN[dayEnum as DayOfWeekEnum];

                                return (
                                  <div
                                    key={dayEnum}
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                  >
                                    {/* Day Header - Dropdown Trigger */}
                                    <button
                                      onClick={() => toggleDayExpanded(dayEnum)}
                                      className="w-full flex items-center justify-between px-3 py-2 bg-linear-to-r from-blue-50 to-blue-25 hover:from-blue-100 hover:to-blue-50 transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-blue-900">
                                          {dayLabel}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {dayItems.length} công việc
                                        </Badge>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 text-blue-600 transition-transform ${
                                          isExpanded ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>

                                    {/* Day Content - Tasks */}
                                    {isExpanded && (
                                      <div className="bg-gray-50 px-3 py-2 space-y-2 border-t">
                                        {dayItems.map((item, idx) => (
                                          <div
                                            key={item.id}
                                            className="flex items-start gap-3 pb-2 last:pb-0 border-b last:border-b-0"
                                          >
                                            <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                                              {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-gray-900 wrap-break-word">
                                                {item.taskTemplate.taskName}
                                              </p>
                                              <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                  {formatTimeToHHMM(
                                                    item.startTime,
                                                  )}{" "}
                                                  -{" "}
                                                  {formatTimeToHHMM(
                                                    item.endTime,
                                                  )}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selectedTemplateId || !startDate || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo lịch"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Selection Modal */}
      <StaffSelectionModal
        isOpen={isStaffModalOpen}
        onOpenChange={setIsStaffModalOpen}
        selectedStaffIds={selectedStaffIds}
        onToggleStaff={toggleStaffSelection}
      />

      {/* Pond Selection Modal */}
      <PondSelectionModal
        isOpen={isPondModalOpen}
        onOpenChange={setIsPondModalOpen}
        selectedPondIds={selectedPondIds}
        onTogglePond={togglePondSelection}
      />
    </>
  );
}
