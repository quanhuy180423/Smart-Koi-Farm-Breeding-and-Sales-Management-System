"use client";

import * as React from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Fish, Globe, FileText, Palette } from "lucide-react";
import { VarietyResponse } from "@/lib/api/services/fetchVariety";
import { useGetPatternsByVariety } from "@/hooks/usePattern";

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
  const { data: patternsData, isLoading } = useGetPatternsByVariety(
    selectedVariety?.id || null,
  );

  const patterns = patternsData || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="border-b pb-4">
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
                Hoa văn ({patterns.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Fish className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-600">
                          Tên giống
                        </Label>
                        <Badge
                          variant="outline"
                          className="mt-1 text-base font-semibold"
                        >
                          {selectedVariety.varietyName}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Globe className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-600">
                          Quốc gia xuất xứ
                        </Label>
                        <p className="text-base text-gray-800 mt-1">
                          {selectedVariety.originCountry}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-600">
                        Đặc điểm/Mô tả
                      </Label>
                      <p className="text-base text-gray-800 mt-1">
                        {selectedVariety.characteristic || "Chưa có mô tả"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Palette className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Danh sách hoa văn
                </h3>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Đang tải danh sách hoa văn...
                  </p>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Palette className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-600 mb-1">
                    Không có hoa văn
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Chưa có hoa văn nào được thêm cho giống cá này
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
