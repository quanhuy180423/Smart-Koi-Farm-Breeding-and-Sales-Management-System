"use client";

import { useRouter } from "next/navigation";
import { Eye, Trash2, Plus, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useGetBreedingProcesses } from "@/hooks/useBreedingProcess";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import {
  BreedingProcessResponse,
  BreedingProcessSearchParams,
} from "@/lib/api/services/fetchBreedingProcess";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import {
  getBreedingResultLabel,
  getBreedingStatusLabel,
} from "@/lib/utils/enum";
import { BreedingDetailDialog } from "./BreedingDetailDialog";
import { Input } from "@/components/ui/input";

export default function BreedingManagement() {
  const router = useRouter();

  // Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [breedingToDelete, setBreedingToDelete] =
    useState<BreedingProcessResponse>();

  // Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBreeding, setSelectedBreeding] =
    useState<BreedingProcessResponse | null>(null);

  // Search & Debounce
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState<string>("");

  // Pagination State
  const [searchParams, setSearchParams] = useState<BreedingProcessSearchParams>(
    {
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
      status: undefined,
    },
  );

  // Fetch Data
  const { data, isLoading } = useGetBreedingProcesses(searchParams);
  const breedingProcesses = data?.data || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debounceSearchTerm,
      pageIndex: 1,
    }));
  }, [debounceSearchTerm]);

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

  const handleDelete = async () => {
    try {
      toast.success("Đã hủy đợt lai thành công");
      setIsDeleteModalOpen(false);
      setBreedingToDelete(undefined);
    } catch {
      toast.error("Hủy thất bại");
    }
  };

  const handleCreateBreeding = () => {
    router.push("/manager/breeding/new");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý sinh sản
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý quá trình sinh sản cá Koi
          </p>
        </div>
        <Button onClick={handleCreateBreeding}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm cặp sinh sản mới
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đợt lai</CardTitle>
          <CardDescription>
            Danh sách chi tiết các đợt lai cá hiện có
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 mb-6 bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-400 pl-10"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">Cá đực</TableHead>
                    <TableHead className="w-[10%]">Cá cái</TableHead>
                    <TableHead className="w-[20%]">Thời gian diễn ra</TableHead>
                    <TableHead className="w-[20%]">Giai đoạn</TableHead>
                    <TableHead className="w-[20%]">Kết quả</TableHead>
                    <TableHead className="w-[20%] text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {breedingProcesses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-gray-500 py-6"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    breedingProcesses.map((process) => (
                      <TableRow key={process.id}>
                        <TableCell className="truncate">
                          RFID: {process.maleKoiRFID}
                        </TableCell>
                        <TableCell className="truncate">
                          RFID: {process.femaleKoiRFID}
                        </TableCell>
                        <TableCell>
                          {formatDate(
                            process.startDate,
                            DATE_FORMATS.MEDIUM_DATE,
                          )}{" "}
                          -{" "}
                          {formatDate(
                            process.endDate,
                            DATE_FORMATS.MEDIUM_DATE,
                          )}
                        </TableCell>

                        <TableCell>
                          {(() => {
                            const label = getBreedingStatusLabel(
                              process.status,
                            );
                            return (
                              <Badge
                                className={`font-semibold ${label.colorClass}`}
                              >
                                {label.label}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="truncate">
                          {(() => {
                            const label = getBreedingResultLabel(
                              process.result,
                            );
                            return (
                              <Badge
                                className={`font-semibold ${label.colorClass}`}
                              >
                                {label.label}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Chi tiết"
                            onClick={() => {
                              setSelectedBreeding(process);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            title="Hủy"
                            onClick={() => {
                              setBreedingToDelete(process);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationSection
                  totalItems={totalItems}
                  postsPerPage={searchParams.pageSize}
                  currentPage={searchParams.pageIndex}
                  setCurrentPage={handlePageChange}
                  totalPages={totalPages}
                  setPageSize={handlePageSizeChange}
                  hasNextPage={data?.hasNextPage}
                  hasPreviousPage={data?.hasPreviousPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đợt lai</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn hủy đợt lai{" "}
            <span className="font-semibold text-red-600">
              {breedingToDelete?.maleKoiRFID} -{" "}
              {breedingToDelete?.femaleKoiRFID}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Quay lại
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <BreedingDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        breedingProcess={selectedBreeding}
      />
    </div>
  );
}
