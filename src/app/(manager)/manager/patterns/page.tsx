"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pattern, PatternSearchParams } from "@/lib/api/services/fetchPattern";
import { useGetPatterns } from "@/hooks/usePattern";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import AddPatternModal from "./components/AddPatternModal";
import EditPatternModal from "./components/EditPatternModal";
import DeletePatternConfirmDialog from "./components/DeletePatternConfirmDialog";
import PatternDetailModal from "./components/PatternDetailModal";

export default function PatternManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedDetailPattern, setSelectedDetailPattern] =
    useState<Pattern | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [patternToDelete, setPatternToDelete] = useState<Pattern | null>(null);

  const [searchParams, setSearchParams] = useState<PatternSearchParams>({
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

  const { data: patternsData, isLoading } = useGetPatterns(searchParams);

  const patterns: Pattern[] = patternsData?.data || [];
  const totalCount = patternsData?.totalItems || 0;
  const totalPages = patternsData?.totalPages || 0;
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

  const handleViewClick = (pattern: Pattern) => {
    setSelectedDetailPattern(pattern);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (pattern: Pattern) => {
    setSelectedPattern(pattern);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (pattern: Pattern) => {
    setPatternToDelete(pattern);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý hoa văn</h1>
          <p className="text-gray-500 mt-1">
            Quản lý các loại hoa văn của cá Koi
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hoa văn</CardTitle>
          <CardDescription>Tổng cộng: {totalCount} hoa văn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm hoa văn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : patterns.length > 0 ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead>Tên hoa văn</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patterns.map((pattern, index) => (
                      <TableRow key={pattern.id} className="hover:bg-muted/50">
                        <TableCell className="text-center font-medium text-gray-500">
                          {(currentPage - 1) * searchParams.pageSize +
                            index +
                            1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {pattern.patternName}
                        </TableCell>
                        <TableCell className="max-w-xs text-sm text-gray-600 truncate">
                          {pattern.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="Thao tác"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() => handleViewClick(pattern)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-green-600" />
                                  Chi tiết
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleEditClick(pattern)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(pattern)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không có hoa văn nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddPatternModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <EditPatternModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        pattern={selectedPattern}
      />

      <DeletePatternConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        patternId={patternToDelete?.id || null}
        patternName={patternToDelete?.patternName || null}
      />

      <PatternDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        pattern={selectedDetailPattern}
      />
    </div>
  );
}
