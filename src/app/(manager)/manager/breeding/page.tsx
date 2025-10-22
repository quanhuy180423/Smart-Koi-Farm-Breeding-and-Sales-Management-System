"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Trash2, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { PaginationSection } from "@/components/common/PaginationSection";
import { BreedingProcessResponse } from "@/lib/api/services/fetchBreedingProcess";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import {
  getBreedingResultLabel,
  getBreedingStatusLabel,
  getHealthStatusLabel,
} from "@/lib/utils/enum";

export default function BreedingManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [breedingToDelete, setBreedingToDelete] =
    useState<BreedingProcessResponse>();

  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const { data, isLoading } = useGetBreedingProcesses({ pageIndex, pageSize });
  const breedingProcesses = data?.data || [];

  // Phân trang
  const totalRecords = data?.totalItems || 0;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageIndex", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", size.toString());
    params.set("pageIndex", "1");
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async () => {
    try {
      toast.success("Đã xóa đợt lai thành công");
      setIsDeleteModalOpen(false);
      setBreedingToDelete(undefined);
    } catch {
      toast.error("Xóa thất bại");
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
                    <TableHead className="w-[20%]">Ngày diễn ra</TableHead>
                    <TableHead className="w-[20%]">Trạng thái</TableHead>
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
                          <Button size="sm" variant="ghost" title="Chi tiết">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            title="Xóa"
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

              {/* 📄 Pagination Section */}
              <PaginationSection
                totalPosts={totalRecords}
                postsPerPage={pageSize}
                currentPage={pageIndex}
                setCurrentPage={handlePageChange}
                totalPages={totalPages}
                setPageSize={handlePageSizeChange}
                hasNextPage={data?.hasNextPage}
                hasPreviousPage={data?.hasPreviousPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa đợt lai</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn xóa đợt lai{" "}
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
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
