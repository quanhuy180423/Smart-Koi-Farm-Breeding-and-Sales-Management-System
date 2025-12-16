"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Loader2, Clock, X } from "lucide-react";
import { TaskTemplateResponse } from "@/lib/api/services/fetchTaskTemplate";
import {
  TemplateItemRequest,
  WeeklyScheduleTemplateRequest,
  DayOfWeekEnum,
} from "@/lib/api/services/fetchWeeklyScheduleTemplate";
import { useCreateWeeklyScheduleTemplate } from "@/hooks/useWeeklyScheduleTemplate";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import TaskSelectionPopup from "../components/TaskSelectionPopup";
import toast from "react-hot-toast";
import { TimePicker } from "@/components/ui/time-picker";

interface TemplateItemWithTask extends TemplateItemRequest {
  taskTemplate?: TaskTemplateResponse;
  tempId?: string;
}

const DAYS_OF_WEEK = [
  { key: DayOfWeekEnum.Sunday, label: "Chủ nhật" },
  { key: DayOfWeekEnum.Monday, label: "Thứ 2" },
  { key: DayOfWeekEnum.Tuesday, label: "Thứ 3" },
  { key: DayOfWeekEnum.Wednesday, label: "Thứ 4" },
  { key: DayOfWeekEnum.Thursday, label: "Thứ 5" },
  { key: DayOfWeekEnum.Friday, label: "Thứ 6" },
  { key: DayOfWeekEnum.Saturday, label: "Thứ 7" },
];

export default function CreateWeeklyScheduleTemplatePage() {
  const router = useRouter();
  const { mutate: createTemplate, isPending } =
    useCreateWeeklyScheduleTemplate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateItems, setTemplateItems] = useState<TemplateItemWithTask[]>(
    []
  );
  const [isTaskSelectionOpen, setIsTaskSelectionOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeekEnum>>(
    new Set()
  );
  const [startTime, setStartTime] = useState<string>("06:00:00");

  const handleSelectTask = (task: TaskTemplateResponse) => {
    if (selectedDays.size === 0) {
      toast.error("Vui lòng chọn ít nhất một ngày");
      return;
    }

    const newItems: TemplateItemWithTask[] = Array.from(selectedDays).map(
      (day) => ({
        taskTemplateId: task.id,
        dayOfWeek: day,
        startTime,
        taskTemplate: task,
        tempId: `${Date.now()}-${Math.random()}-${day}`,
      })
    );

    setTemplateItems([...templateItems, ...newItems]);
    setSelectedDays(new Set());
  };

  const handleDayToggle = (day: DayOfWeekEnum) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(day)) {
      newSelectedDays.delete(day);
    } else {
      newSelectedDays.add(day);
    }
    setSelectedDays(newSelectedDays);
  };

  const handleRemoveItem = (tempId?: string) => {
    if (tempId) {
      setTemplateItems(templateItems.filter((item) => item.tempId !== tempId));
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Vui lòng điền đầy đủ tên và mô tả");
      return;
    }

    if (templateItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một công việc");
      return;
    }

    // Convert template items to request format
    const payload: WeeklyScheduleTemplateRequest = {
      name,
      description,
      templateItems: templateItems.map((item) => ({
        taskTemplateId: item.taskTemplateId,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
      })),
    };

    createTemplate(payload, {
      onSuccess: () => {
        router.push("/manager/schedules?tab=template");
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tạo mẫu lịch trong tuần
          </h1>
          <p className="text-muted-foreground">
            Tạo một mẫu lịch làm việc mới cho trang trại
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin mẫu lịch</CardTitle>
          <CardDescription>
            Nhập tên, mô tả và chọn công việc cho từng ngày
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Template Info Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name" className="text-sm font-medium">
                Tên mẫu lịch *
              </Label>
              <Input
                id="template-name"
                placeholder="VD: Lịch làm việc tuần đầu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-300 focus:border-blue-500 mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="template-description"
                className="text-sm font-medium"
              >
                Mô tả *
              </Label>
              <Textarea
                id="template-description"
                placeholder="Mô tả chi tiết mẫu lịch..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-2 border-gray-300 focus:border-blue-500 min-h-[100px] mt-1"
              />
            </div>
          </div>

          {/* Add Template Items Section */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Thêm công việc
              </h3>

              {/* Days Selection */}
              <div className="mb-4">
                <Label className="text-xs font-medium text-gray-600 block mb-2">
                  Chọn ngày trong tuần
                </Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => handleDayToggle(day.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDays.has(day.key)
                          ? "bg-blue-500 text-white border border-blue-600"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time and Task Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="start-time"
                    className="text-xs font-medium text-gray-600"
                  >
                    Thời gian bắt đầu
                  </Label>
                  <div className="mt-1">
                    <TimePicker
                      value={startTime ? startTime.substring(0, 5) : undefined}
                      onChange={(value) => {
                        if (value) {
                          setStartTime(`${value}:00`);
                        } else {
                          setStartTime("");
                        }
                      }}
                      placeholder="Chọn giờ"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => setIsTaskSelectionOpen(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Chọn công việc
                  </Button>
                </div>
              </div>
            </div>

            {/* Template Items List - Calendar View */}
            {templateItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden bg-white mt-6">
                <h4 className="text-sm font-semibold text-gray-700 p-4 pb-0">
                  Danh sách công việc đã thêm
                </h4>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2 p-4"
                  style={{ gridAutoColumns: "minmax(150px, 1fr)" }}
                >
                  {DAYS_OF_WEEK.map((day) => {
                    const dayTasks = templateItems.filter(
                      (item) => item.dayOfWeek === day.key
                    );
                    return (
                      <div
                        key={day.key}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50 min-h-[200px] flex flex-col"
                      >
                        <h3 className="font-semibold text-sm text-gray-800 mb-3 pb-2 border-b">
                          {day.label}
                        </h3>

                        {dayTasks.length === 0 ? (
                          <div className="flex items-center justify-center flex-1">
                            <p className="text-xs text-gray-400">
                              Không có công việc
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 flex-1">
                            {dayTasks.map((task, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-blue-200 rounded p-2 text-xs group relative"
                              >
                                <p className="font-medium text-blue-900 truncate pr-6">
                                  {task.taskTemplate?.taskName}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-gray-600">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {formatTimeToHHMM(task.startTime)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(task.tempId)}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Xóa"
                                >
                                  <X className="h-3 w-3 text-red-600 hover:text-red-800" />
                                </button>
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

            {templateItems.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
                {`Chưa thêm công việc nào. Nhấn "Chọn công việc" để thêm.`}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="px-6"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="px-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo mẫu lịch"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <TaskSelectionPopup
        isOpen={isTaskSelectionOpen}
        onOpenChange={setIsTaskSelectionOpen}
        onSelect={handleSelectTask}
      />
    </div>
  );
}
