"use client";

import { useEffect, useState } from "react";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentSearchParams,
} from "@/lib/api/services/fetchIncident";
import { useGetIncidents } from "@/hooks/useIncident";
import { useDebounce } from "@/hooks/useDebounce";
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
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates/formatDate";
import { EmptyState } from "@/components/common/EmptyState";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import PondSelectionDialogForIncident from "./PondSelectionDialogForIncident";
import KoiFishSelectionDialogForIncident from "./KoiFishSelectionDialogForIncident";
import {
  getIncidentSeverityColor,
  getIncidentSeverityText,
  getIncidentStatusColor,
  getIncidentStatusText,
} from "@/lib/utils/enum/formatEnum";

type FilterValue<T> = "all" | T;

const isIncidentSeverity = (value: unknown): value is IncidentSeverity => {
  return Object.values(IncidentSeverity).includes(value as IncidentSeverity);
};

const isIncidentStatus = (value: unknown): value is IncidentStatus => {
  return Object.values(IncidentStatus).includes(value as IncidentStatus);
};

export function IncidentList() {
  const [searchParams, setSearchParams] = useState<IncidentSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterSeverity, setFilterSeverity] =
    useState<FilterValue<IncidentSeverity>>("all");
  const [filterStatus, setFilterStatus] =
    useState<FilterValue<IncidentStatus>>("all");
  const [selectedPondName, setSelectedPondName] = useState<string | undefined>(
    undefined,
  );
  const [selectedKoiFishName, setSelectedKoiFishName] = useState<
    string | undefined
  >(undefined);
  const [isPondDialogOpen, setIsPondDialogOpen] = useState(false);
  const [isKoiFishDialogOpen, setIsKoiFishDialogOpen] = useState(false);

  const {
    data: incidentsData,
    isLoading,
    error,
  } = useGetIncidents(searchParams);

  const dataToDisplay = incidentsData?.data || [];
  const totalItems = incidentsData?.totalItems || 0;

  // Auto-apply filters when filter values change
  useEffect(() => {
    const severity = isIncidentSeverity(filterSeverity)
      ? filterSeverity
      : undefined;
    const status = isIncidentStatus(filterStatus) ? filterStatus : undefined;

    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm || undefined,
      severity,
      status,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm, filterSeverity, filterStatus]);

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

  const handleSelectKoiFish = (koiFishId: number, koiFishName: string) => {
    setSelectedKoiFishName(koiFishName);
    setSearchParams((prev) => ({
      ...prev,
      koiFishId: koiFishId,
      pageIndex: 1,
    }));
  };

  const handleClearKoiFish = () => {
    setSelectedKoiFishName(undefined);
    setSearchParams((prev) => ({
      ...prev,
      koiFishId: undefined,
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

  const handleSeverityChange = (value: string) => {
    if (value === "all" || isIncidentSeverity(value)) {
      setFilterSeverity(value === "all" ? "all" : value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === "all" || isIncidentStatus(value)) {
      setFilterStatus(value === "all" ? "all" : value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          {/* Pond Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hồ cá</label>
            <button
              onClick={() => setIsPondDialogOpen(true)}
              className="w-full px-3 py-2 text-sm text-left border border-input rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-between"
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

          {/* Koi Fish Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cá Koi</label>
            <button
              onClick={() => setIsKoiFishDialogOpen(true)}
              className="w-full px-3 py-2 text-sm text-left border border-input rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-between"
            >
              <span className="flex-1">
                {selectedKoiFishName ? (
                  <span>{selectedKoiFishName}</span>
                ) : (
                  <span className="text-muted-foreground">Chọn cá</span>
                )}
              </span>
              {selectedKoiFishName ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearKoiFish();
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

          {/* Severity Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mức độ</label>
            <Select value={filterSeverity} onValueChange={handleSeverityChange}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Chọn mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={IncidentSeverity.LOW}>Thấp</SelectItem>
                <SelectItem value={IncidentSeverity.MEDIUM}>
                  Trung bình
                </SelectItem>
                <SelectItem value={IncidentSeverity.HIGH}>Cao</SelectItem>
                <SelectItem value={IncidentSeverity.URGENT}>
                  Khẩn cấp
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select value={filterStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={IncidentStatus.REPORTED}>
                  Đã báo cáo
                </SelectItem>
                <SelectItem value={IncidentStatus.INVESTIGATING}>
                  Đang điều tra
                </SelectItem>
                <SelectItem value={IncidentStatus.RESOLVED}>
                  Đã giải quyết
                </SelectItem>
                <SelectItem value={IncidentStatus.CANCELLED}>Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>
            Có lỗi xảy ra khi tải dữ liệu:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      ) : !dataToDisplay || dataToDisplay.length === 0 ? (
        <EmptyState
          title="Không có sự cố nào"
          description="Hiện tại không có sự cố nào phù hợp với bộ lọc"
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-[5%]">#</TableHead>
                  <TableHead className="font-semibold w-[15%]">
                    Tiêu đề
                  </TableHead>
                  <TableHead className="font-semibold w-[12%]">Loại</TableHead>
                  <TableHead className="font-semibold w-[18%]">Mô tả</TableHead>
                  <TableHead className="font-semibold w-[10%]">
                    Mức độ
                  </TableHead>
                  <TableHead className="font-semibold w-[12%]">
                    Trạng thái
                  </TableHead>
                  <TableHead className="font-semibold w-[15%]">
                    Báo cáo bởi
                  </TableHead>
                  <TableHead className="font-semibold w-[13%]">
                    Thời gian xảy ra
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataToDisplay.map((incident, index) => (
                  <TableRow key={incident.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm text-muted-foreground w-[5%]">
                      {(searchParams.pageIndex - 1) * searchParams.pageSize +
                        index +
                        1}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {incident.incidentTitle}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {incident.incidentTypeName}
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      <p className="line-clamp-2 truncate">
                        {incident.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getIncidentSeverityColor(incident.severity)} font-semibold text-xs`}
                      >
                        {getIncidentSeverityText(incident.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getIncidentStatusColor(incident.status)} font-semibold text-xs`}
                      >
                        {getIncidentStatusText(incident.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {incident.reportedByUserName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(
                        incident.occurredAt,
                        DATE_FORMATS.MEDIUM_DATE,
                      )}
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

      {/* Dialogs */}
      <PondSelectionDialogForIncident
        isOpen={isPondDialogOpen}
        onOpenChange={setIsPondDialogOpen}
        onSelect={handleSelectPond}
        initialSelectedId={searchParams.pondId}
      />

      <KoiFishSelectionDialogForIncident
        isOpen={isKoiFishDialogOpen}
        onOpenChange={setIsKoiFishDialogOpen}
        onSelect={handleSelectKoiFish}
        initialSelectedId={searchParams.koiFishId}
      />
    </div>
  );
}
