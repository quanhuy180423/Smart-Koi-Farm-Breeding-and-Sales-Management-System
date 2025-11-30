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
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import PondSelectionDialog from "./PondSelectionDialog";
import {
  getWaterAlertSeverityColor,
  getWaterAlertSeverityText,
  getAlertTypeText,
} from "@/lib/utils/enum/formatEnum";

interface WaterAlertListProps {
  pondId?: number;
}

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
          <div className="rounded-lg border">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-[5%]">#</TableHead>
                  <TableHead className="font-semibold w-[10%]">Hồ</TableHead>
                  <TableHead className="font-semibold w-[12%]">
                    Tham số
                  </TableHead>
                  <TableHead className="font-semibold w-[12%]">
                    Giá trị đo
                  </TableHead>
                  <TableHead className="font-semibold w-[12%]">
                    Loại cảnh báo
                  </TableHead>
                  <TableHead className="font-semibold w-[10%]">
                    Mức độ
                  </TableHead>
                  <TableHead className="font-semibold w-[20%]">
                    Thông báo
                  </TableHead>
                  <TableHead className="font-semibold w-[12%]">
                    Thời gian
                  </TableHead>
                  <TableHead className="font-semibold w-[17%]">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataToDisplay.map((alert, index) => (
                  <TableRow key={alert.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm text-muted-foreground w-[5%]">
                      {(searchParams.pageIndex - 1) * searchParams.pageSize +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {alert.pondName}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {alert.parameterName}
                    </TableCell>
                    <TableCell className="text-sm font-medium truncate">
                      {alert.measuredValue}
                    </TableCell>
                    <TableCell className="truncate">
                      <Badge variant="outline" className="text-xs">
                        {getAlertTypeText(alert.alertType as AlertType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getWaterAlertSeverityColor(
                          alert.severity as Severity,
                        )} font-semibold text-xs`}
                      >
                        {getWaterAlertSeverityText(alert.severity as Severity)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      <p className="line-clamp-2 truncate">{alert.message}</p>
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
            <PaginationWithLinks
              totalCount={totalItems}
              pageSize={searchParams.pageSize}
              page={searchParams.pageIndex}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
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
