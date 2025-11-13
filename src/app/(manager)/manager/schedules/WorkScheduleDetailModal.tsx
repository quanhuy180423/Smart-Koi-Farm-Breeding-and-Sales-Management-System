"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Droplets, FileText, Calendar, User } from "lucide-react";
import { WorkSchedule } from "@/lib/api/services/fetchWorkSchedule";
import { formatTimeToHHMM } from "@/lib/utils/formatTime";
import {
  getWorkScheduleStatusColor,
  getWorkScheduleStatusText,
  getRoleLabel,
} from "@/lib/utils/enum";

interface WorkScheduleDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workSchedule: WorkSchedule | null;
}

export default function WorkScheduleDetailModal({
  isOpen,
  onOpenChange,
  workSchedule,
}: WorkScheduleDetailModalProps) {
  if (!workSchedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {workSchedule.taskTemplateName}
              </DialogTitle>
              <DialogDescription>
                Thông tin chi tiết công việc
              </DialogDescription>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={`text-sm ${getWorkScheduleStatusColor(workSchedule.status)}`}
                >
                  {getWorkScheduleStatusText(workSchedule.status)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Scheduled Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Ngày thực hiện
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(workSchedule.scheduledDate).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Giờ thực hiện
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatTimeToHHMM(workSchedule.startTime)} -{" "}
                      {formatTimeToHHMM(workSchedule.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Mô tả công việc
                </p>
                <p className="text-sm text-gray-700">
                  {workSchedule.taskTemplate.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Staff Assignments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">
                Nhân viên được phân công
              </h3>
            </div>
            {workSchedule.staffAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {workSchedule.staffAssignments.map((staff) => (
                  <Card
                    key={staff.staffId}
                    className="bg-blue-50 border-blue-200"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <p className="font-medium text-gray-900">
                            {staff.staffName}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRoleLabel(staff.role).colorClass}`}
                          >
                            {getRoleLabel(staff.role).label}
                          </Badge>
                          {staff.completedAt ? (
                            <div className="space-y-1 text-xs text-gray-600 pt-1">
                              <p className="text-green-600 font-medium">
                                ✓ Đã hoàn thành
                              </p>
                              <p>
                                {new Date(staff.completedAt).toLocaleString(
                                  "vi-VN",
                                )}
                              </p>
                              {staff.completionNotes && (
                                <p className="italic text-gray-700">
                                  {staff.completionNotes}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-yellow-600 font-medium">
                              Chưa hoàn thành
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Không có nhân viên được phân công
              </p>
            )}
          </div>

          {/* Pond Assignments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Ao được phân công</h3>
            </div>
            {workSchedule.pondAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {workSchedule.pondAssignments.map((pond) => (
                  <Card
                    key={pond.pondId}
                    className="bg-green-50 border-green-200"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Droplets className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="font-medium text-gray-900">
                          {pond.pondName}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Không có ao được phân công
              </p>
            )}
          </div>

          {/* Notes */}
          {workSchedule.notes && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 mb-2">
                      Ghi chú
                    </p>
                    <p className="text-sm text-amber-800">
                      {workSchedule.notes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="space-y-2 text-xs text-gray-600">
                <p>
                  <span className="font-medium">Tạo bởi:</span>{" "}
                  {workSchedule.createdByName}
                </p>
                <p>
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {new Date(workSchedule.createdAt).toLocaleString("vi-VN")}
                </p>
                {workSchedule.updatedAt && (
                  <p>
                    <span className="font-medium">Cập nhật:</span>{" "}
                    {new Date(workSchedule.updatedAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
