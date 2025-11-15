"use client";

import { useEffect, useState } from "react";
import {
  AlertType,
  Severity,
  WaterAlertSearchParams,
} from "@/lib/api/services/fetchWaterAlert";
import { useGetWaterAlerts } from "@/hooks/useWaterAlert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter, X } from "lucide-react";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { EmptyState } from "@/components/common/EmptyState";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import PondSelectionDialog from "./PondSelectionDialog";

interface WaterAlertListProps {
  pondId?: number;
}

const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case Severity.LOW:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case Severity.MEDIUM:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case Severity.HIGH:
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case Severity.URGENT:
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getSeverityLabel = (severity: Severity) => {
  switch (severity) {
    case Severity.LOW:
      return "Thấp";
    case Severity.MEDIUM:
      return "Trung bình";
    case Severity.HIGH:
      return "Cao";
    case Severity.URGENT:
      return "Khẩn cấp";
    default:
      return severity;
  }
};

const getAlertTypeLabel = (alertType: AlertType) => {
  switch (alertType) {
    case AlertType.HIGH:
      return "Cao";
    case AlertType.LOW:
      return "Thấp";
    case AlertType.RAPID_CHANGE:
      return "Thay đổi nhanh";
    default:
      return alertType;
  }
};

export function WaterAlertList({ pondId }: WaterAlertListProps) {
  const [searchParams, setSearchParams] = useState<WaterAlertSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    pondId: pondId,
  });

  const [filterIsResolved, setFilterIsResolved] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterAlertType, setFilterAlertType] = useState<string>("all");
  const [selectedPondName, setSelectedPondName] = useState<string | undefined>(
    undefined,
  );
  const [isPondDialogOpen, setIsPondDialogOpen] = useState(false);

  const {
    data: alertsData,
    isLoading,
    error,
  } = useGetWaterAlerts(searchParams);

  const dataToDisplay = alertsData?.data || [];
  const totalItems = alertsData?.totalItems || 0;
  const totalPages = alertsData?.totalPages || 0;

  // Auto-apply filters when filter values change
  useEffect(() => {
    const isResolved =
      filterIsResolved === "all" ? undefined : filterIsResolved === "resolved";
    const severity =
      filterSeverity !== "all" ? (filterSeverity as Severity) : undefined;
    const alertType =
      filterAlertType !== "all" ? (filterAlertType as AlertType) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      isResolved,
      severity,
      alertType,
      pageIndex: 1,
    }));
  }, [filterIsResolved, filterSeverity, filterAlertType]);

  const handleSelectPond = (pondId: number, pondName: string) => {
    setSelectedPondName(pondName);
    setSearchParams((prev) => ({
      ...prev,
      pondId: pondId,
      pageIndex: 1,
    }));
  };

  const handleClearPond = () => {
    setSelectedPondName(undefined);
    setSearchParams((prev) => ({
      ...prev,
      pondId: undefined,
      pageIndex: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 1,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Hồ cá</label>
          <button
            onClick={() => setIsPondDialogOpen(true)}
            className="w-full px-3 py-2 text-sm text-left border border-input rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between"
          >
            <span className="flex-1">
              {selectedPondName ? (
                <span>{selectedPondName}</span>
              ) : (
                <span className="text-muted-foreground">Chọn hồ</span>
              )}
            </span>
            {selectedPondName ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearPond();
                }}
                className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
                title="Xóa lựa chọn"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            ) : (
              <Filter className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trạng thái</label>
          <Select value={filterIsResolved} onValueChange={setFilterIsResolved}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="unresolved">Chưa giải quyết</SelectItem>
              <SelectItem value="resolved">Đã giải quyết</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mức độ</label>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Chọn mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value={Severity.LOW}>Thấp</SelectItem>
              <SelectItem value={Severity.MEDIUM}>Trung bình</SelectItem>
              <SelectItem value={Severity.HIGH}>Cao</SelectItem>
              <SelectItem value={Severity.URGENT}>Khẩn cấp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Loại cảnh báo</label>
          <Select value={filterAlertType} onValueChange={setFilterAlertType}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value={AlertType.HIGH}>Cao</SelectItem>
              <SelectItem value={AlertType.LOW}>Thấp</SelectItem>
              <SelectItem value={AlertType.RAPID_CHANGE}>
                Thay đổi nhanh
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Có lỗi xảy ra khi tải dữ liệu: {error.message}</p>
        </div>
      ) : !dataToDisplay || dataToDisplay.length === 0 ? (
        <EmptyState
          title="Không có cảnh báo nước"
          description="Hiện tại không có cảnh báo nước nào cần chú ý"
        />
      ) : (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Hồ</TableHead>
                  <TableHead className="font-semibold">Tham số</TableHead>
                  <TableHead className="font-semibold">Giá trị đo</TableHead>
                  <TableHead className="font-semibold">Loại cảnh báo</TableHead>
                  <TableHead className="font-semibold">Mức độ</TableHead>
                  <TableHead className="font-semibold">Thông báo</TableHead>
                  <TableHead className="font-semibold">Thời gian</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataToDisplay.map((alert) => (
                  <TableRow key={alert.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {alert.pondName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {alert.parameterName}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {alert.measuredValue}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getAlertTypeLabel(alert.alertType as AlertType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getSeverityColor(
                          alert.severity as Severity,
                        )} font-semibold text-xs`}
                      >
                        {getSeverityLabel(alert.severity as Severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs">
                      <p className="line-clamp-2">{alert.message}</p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(alert.createdAt, "dd/MM HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.isResolved ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {alert.isResolved
                          ? `Đã giải quyết (${alert.resolvedByUserName})`
                          : "Chưa giải quyết"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <PaginationSection
              totalItems={totalItems}
              postsPerPage={searchParams.pageSize}
              currentPage={searchParams.pageIndex}
              setCurrentPage={handlePageChange}
              totalPages={totalPages}
              setPageSize={handlePageSizeChange}
              hasNextPage={alertsData?.hasNextPage}
              hasPreviousPage={alertsData?.hasPreviousPage}
            />
          )}
        </>
      )}

      {/* Pond Selection Dialog */}
      <PondSelectionDialog
        isOpen={isPondDialogOpen}
        onOpenChange={setIsPondDialogOpen}
        onSelect={handleSelectPond}
        initialSelectedId={searchParams.pondId}
      />
    </div>
  );
}
