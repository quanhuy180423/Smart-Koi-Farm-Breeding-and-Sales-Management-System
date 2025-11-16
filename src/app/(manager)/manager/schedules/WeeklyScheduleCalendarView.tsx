import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  WeeklyScheduleTemplate,
  TemplateItem,
} from "@/lib/api/services/fetchWeeklyScheduleTemplate";
import { Clock, Edit2, Trash2 } from "lucide-react";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";

interface WeeklyScheduleCalendarViewProps {
  templates: WeeklyScheduleTemplate[];
  isLoading: boolean;
  onDelete?: (id: number, name: string) => void;
}

const DAYS_OF_WEEK = [
  { key: "Monday", label: "Thứ 2" },
  { key: "Tuesday", label: "Thứ 3" },
  { key: "Wednesday", label: "Thứ 4" },
  { key: "Thursday", label: "Thứ 5" },
  { key: "Friday", label: "Thứ 6" },
  { key: "Saturday", label: "Thứ 7" },
  { key: "Sunday", label: "Chủ nhật" },
];

const WeeklyScheduleCalendarView = ({
  templates,
  isLoading,
  onDelete,
}: WeeklyScheduleCalendarViewProps) => {
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Không có mẫu lịch nào</p>
      </div>
    );
  }

  const renderTasksByDay = (templateItems: TemplateItem[], dayKey: string) => {
    const dayTasks = templateItems.filter((item) => item.dayOfWeek === dayKey);
    return dayTasks;
  };

  return (
    <div className="space-y-6">
      {templates.map((template) => (
        <Card key={template.id} className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {template.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    router.push(`/manager/schedules/edit/${template.id}`)
                  }
                  className="text-blue-600 hover:bg-blue-50"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(template.id, template.name)}
                  className="text-red-600 hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const dayTasks = renderTasksByDay(
                  template.templateItems,
                  day.key,
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
                            className="bg-white border border-blue-200 rounded p-2 text-xs"
                          >
                            <p className="font-medium text-blue-900 truncate">
                              {task.taskTemplate.taskName}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatTimeToHHMM(task.startTime)} -{" "}
                                {formatTimeToHHMM(task.endTime)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Metadata */}
            <div className="mt-4 pt-4 border-t text-xs text-gray-500 space-y-1">
              <p>
                Tạo lúc:{" "}
                <span className="text-gray-700">
                  {formatDate(template.createdAt, DATE_FORMATS.DATETIME_24H)}
                </span>
              </p>
              {template.updatedAt && (
                <p>
                  Cập nhật lúc:{" "}
                  <span className="text-gray-700">
                    {formatDate(template.updatedAt, DATE_FORMATS.DATETIME_24H)}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeeklyScheduleCalendarView;
