"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Loader2, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IncidentType,
  IncidentTypeSearchParams,
} from "@/lib/api/services/fetchIncidentType";
import { useGetIncidentTypes } from "@/hooks/useIncidentType";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AddIncidentTypeModal from "./components/AddIncidentTypeModal";
import EditIncidentTypeModal from "./components/EditIncidentTypeModal";
import DeleteIncidentTypeConfirmDialog from "./components/DeleteIncidentTypeConfirmDialog";
import IncidentTypeDetailModal from "./components/IncidentTypeDetailModal";
import { Eye } from "lucide-react";

const severityColors: Record<string, { bg: string; text: string }> = {
  Low: { bg: "bg-blue-100", text: "text-blue-800" },
  Medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
  High: { bg: "bg-red-100", text: "text-red-800" },
};

const severityLabels: Record<string, string> = {
  Low: "Thấp",
  Medium: "Trung bình",
  High: "Cao",
};

export default function IncidentTypeManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedIncidentType, setSelectedIncidentType] =
    useState<IncidentType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [incidentTypeToDelete, setIncidentTypeToDelete] =
    useState<IncidentType | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterBreeding, setFilterBreeding] = useState<boolean | undefined>();

  const [searchParams, setSearchParams] = useState<IncidentTypeSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const { data: incidentTypesData, isLoading } =
    useGetIncidentTypes(searchParams);

  const incidentTypes: IncidentType[] = incidentTypesData?.data || [];
  const totalCount = incidentTypesData?.totalItems || 0;
  const totalPages = incidentTypesData?.totalPages || 0;
  const currentPage = searchParams.pageIndex || 1;

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 1,
    }));
  };

  const handleDetailClick = (incidentType: IncidentType) => {
    setSelectedIncidentType(incidentType);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (incidentType: IncidentType) => {
    setSelectedIncidentType(incidentType);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (incidentType: IncidentType) => {
    setIncidentTypeToDelete(incidentType);
    setIsDeleteConfirmOpen(true);
  };

  const applyFilters = () => {
    setSearchParams((prev) => ({
      ...prev,
      affectsBreeding: filterBreeding,
      pageIndex: 1,
    }));
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    setFilterBreeding(undefined);
    setSearchParams((prev) => ({
      ...prev,
      affectsBreeding: undefined,
      pageIndex: 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý loại sự cố
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý các loại sự cố có thể xảy ra tại trang trại
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách loại sự cố</CardTitle>
          <CardDescription>Tổng cộng: {totalCount} loại sự cố</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm loại sự cố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : incidentTypes.length > 0 ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead className="w-[20%]">Tên loại sự cố</TableHead>
                      <TableHead className="w-[28%]">Mô tả</TableHead>
                      <TableHead className="w-[15%] text-center">
                        Mức độ mặc định
                      </TableHead>
                      <TableHead className="w-[12%] text-center">
                        Nhân giống
                      </TableHead>
                      <TableHead className="w-[13%] text-center">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidentTypes.map((incidentType, index) => (
                      <TableRow
                        key={incidentType.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="text-center font-medium text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium truncate">
                          {incidentType.name}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 truncate">
                          {incidentType.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${
                              severityColors[incidentType.defaultSeverity].bg
                            } ${
                              severityColors[incidentType.defaultSeverity].text
                            }`}
                            variant="outline"
                          >
                            {severityLabels[incidentType.defaultSeverity]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              incidentType.affectsBreeding
                                ? "default"
                                : "secondary"
                            }
                          >
                            {incidentType.affectsBreeding ? "Có" : "Không"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDetailClick(incidentType)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4 text-green-600 hover:text-green-800" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(incidentType)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(incidentType)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationWithLinks
                  pageSize={
                    searchParams.pageSize || PAGE_SIZE_OPTIONS_DEFAULT[0]
                  }
                  page={currentPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không có loại sự cố nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddIncidentTypeModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <IncidentTypeDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        incidentType={selectedIncidentType}
      />

      <EditIncidentTypeModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        incidentType={selectedIncidentType}
      />

      <DeleteIncidentTypeConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        incidentTypeId={incidentTypeToDelete?.id || null}
        incidentTypeName={incidentTypeToDelete?.name || null}
      />

      {/* Filter Dialog */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bộ lọc</DialogTitle>
            <DialogDescription>Lọc loại sự cố theo tiêu chí</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-breeding"
                  checked={filterBreeding === true}
                  onCheckedChange={(checked) =>
                    setFilterBreeding(checked === true ? true : undefined)
                  }
                />
                <Label htmlFor="filter-breeding" className="cursor-pointer">
                  Ảnh hưởng đến nhân giống
                </Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
              <Button onClick={applyFilters}>Áp dụng</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
