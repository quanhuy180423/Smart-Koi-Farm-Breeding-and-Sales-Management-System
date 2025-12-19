"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalCount?: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export function PaginationWithLinks({
  pageSize,
  totalCount,
  page,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  const handlePageChange = (pageNumber: number | string) => {
    const pageNum =
      typeof pageNumber === "string" ? parseInt(pageNumber) : pageNumber;
    onPageChange(pageNum);
  };

  const renderPageNumbers = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);

      if (page > 3) items.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) items.push(i);

      if (page < totalPages - 2) items.push("...");

      items.push(totalPages);
    }
    return items;
  };

  if (totalPages <= 1 && !onPageSizeChange) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className,
      )}
    >
      {/* Page Size Selector */}
      {/* {onPageSizeChange && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>mục / trang</span>
        </div>
      )} */}

      {/* Pagination Controls */}
      <Pagination>
        <PaginationContent>
          {/* Nút lùi */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && handlePageChange(page - 1)}
              aria-disabled={page <= 1}
              className={cn(
                page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>

          {/* Danh sách số trang */}
          {renderPageNumbers().map((number, index) => (
            <PaginationItem key={index}>
              {number === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(number)}
                  isActive={page === number}
                  className={cn(
                    "cursor-pointer",
                    page === number &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 font-bold",
                  )}
                >
                  {number}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Nút tiến */}
          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && handlePageChange(page + 1)}
              aria-disabled={page >= totalPages}
              className={cn(
                page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
