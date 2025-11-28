import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TaskTemplateResponse,
  TaskTemplatePagedRequest,
} from "@/lib/api/services/fetchTaskTemplate";
import { useGetTaskTemplates } from "@/hooks/useTaskTemplate";
import { useDebounce } from "@/hooks/useDebounce";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";

interface TaskSelectionPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (task: TaskTemplateResponse) => void;
}

export default function TaskSelectionPopup({
  isOpen,
  onOpenChange,
  onSelect,
}: TaskSelectionPopupProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [searchParams, setSearchParams] = useState<TaskTemplatePagedRequest>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    isDeleted: false,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const { data: pagedResponse, isLoading } = useGetTaskTemplates(searchParams);
  const taskTemplates = pagedResponse?.data || [];
  const totalItems = pagedResponse?.totalItems || 0;

  const handleSetCurrentPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSetPageSize = (size: number) => {
    setSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleSelectTask = (task: TaskTemplateResponse) => {
    onSelect(task);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-fit max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chọn công việc
          </DialogTitle>
          <DialogDescription>Chọn công việc từ danh sách mẫu</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm công việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-gray-400 pl-10"
            />
          </div>

          {/* Tasks Table */}
          <div className="border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center px-2">
                        STT
                      </TableHead>
                      <TableHead className="px-3 py-3 min-w-[200px]">
                        Tên công việc
                      </TableHead>
                      <TableHead className="px-3 py-3 hidden sm:table-cell min-w-[250px]">
                        Mô tả
                      </TableHead>
                      <TableHead className="w-24 text-center px-2">
                        Thời lượng
                      </TableHead>
                      <TableHead className="w-32 text-center px-2">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskTemplates.length > 0 ? (
                      taskTemplates.map((task, index) => (
                        <TableRow key={task.id} className="hover:bg-muted/50">
                          <TableCell className="w-12 text-center font-medium text-xs px-2 py-3">
                            {index +
                              1 +
                              (searchParams.pageIndex - 1) *
                                searchParams.pageSize}
                          </TableCell>
                          <TableCell className="px-3 py-3 min-w-[200px]">
                            <div className="flex flex-col gap-1">
                              <p className="font-medium text-sm">
                                {task.taskName}
                              </p>
                              <p
                                className="text-xs text-muted-foreground sm:hidden truncate"
                                title={task.description}
                              >
                                {task.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-3 hidden sm:table-cell min-w-[250px]">
                            <div
                              className="text-sm truncate"
                              title={task.description}
                            >
                              {task.description}
                            </div>
                          </TableCell>
                          <TableCell className="w-24 text-center text-sm px-2 py-3 whitespace-nowrap">
                            {task.defaultDuration}m
                          </TableCell>
                          <TableCell className="w-32 px-2 py-3">
                            <div className="flex items-center justify-center">
                              <Button
                                size="sm"
                                onClick={() => handleSelectTask(task)}
                              >
                                Chọn
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-8"
                        >
                          Không có công việc nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <PaginationWithLinks
              totalCount={totalItems}
              pageSize={searchParams.pageSize}
              page={searchParams.pageIndex}
              onPageChange={handleSetCurrentPage}
              onPageSizeChange={handleSetPageSize}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
