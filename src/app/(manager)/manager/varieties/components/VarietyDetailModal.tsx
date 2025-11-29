"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { VarietyResponse } from "@/lib/api/services/fetchVariety";
import { useGetPatternsByVariety } from "@/hooks/usePattern";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";

interface VarietyDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVariety: VarietyResponse | null;
}

const VarietyDetailModal = ({
  isOpen,
  onOpenChange,
  selectedVariety,
}: VarietyDetailModalProps) => {
  const [patternPage] = useState(1);
  const { data: patternsData, isLoading } = useGetPatternsByVariety(
    selectedVariety?.id || null,
    {
      pageIndex: patternPage,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
    },
  );

  const patterns = patternsData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Chi tiết Giống Cá: {selectedVariety?.varietyName}
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về giống cá</DialogDescription>
        </DialogHeader>
        {selectedVariety && (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Thông tin chung</TabsTrigger>
              <TabsTrigger value="patterns">
                Hoa văn ({patternsData?.totalItems || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Tên giống
                    </Label>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedVariety.varietyName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Quốc gia xuất xứ
                    </Label>
                    <p className="text-base text-gray-800">
                      {selectedVariety.originCountry}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 col-span-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Đặc điểm/Mô tả
                  </Label>
                  <p className="text-base text-gray-800">
                    {selectedVariety.characteristic || "Chưa có mô tả"}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : patterns.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">STT</TableHead>
                        <TableHead>Tên hoa văn</TableHead>
                        <TableHead>Mô tả</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patterns.map((pattern, index) => (
                        <TableRow
                          key={pattern.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="text-center font-medium text-gray-500">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {pattern.patternName}
                          </TableCell>
                          <TableCell className="max-w-xs text-sm text-gray-600 truncate">
                            {pattern.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Không có hoa văn nào cho giống cá này
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VarietyDetailModal;
