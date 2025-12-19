"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Palette, FileText, Fish } from "lucide-react";
import { Pattern } from "@/lib/api/services/fetchPattern";
import {
  useGetPatternVarieties,
  useRemoveVarietyFromPattern,
} from "@/hooks/usePattern";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { Button } from "@/components/ui/button";
import AssignVarietyDialog from "./AssignVarietyDialog";
import { Label } from "@/components/ui/label";

interface PatternDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pattern: Pattern | null;
}

export default function PatternDetailModal({
  isOpen,
  onOpenChange,
  pattern,
}: PatternDetailModalProps) {
  const [varietyPage] = useState(1);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const { data: varietiesData, isLoading } = useGetPatternVarieties(
    pattern?.id || null,
    {
      pageIndex: varietyPage,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
    },
  );
  const { mutate: removeVariety, isPending: isRemoving } =
    useRemoveVarietyFromPattern();

  const varieties = varietiesData?.data || [];

  const handleRemoveVariety = (varietyId: number) => {
    if (pattern?.id) {
      removeVariety({
        varietyId,
        patternId: pattern.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Chi tiết hoa văn: {pattern?.patternName}
          </DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và các loại cá có hoa văn này
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="varieties">
              Giống cá ({varietiesData?.totalItems || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            {/* Pattern Badge */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Palette className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <Label className="text-sm font-medium text-gray-600">
                      Tên hoa văn
                    </Label>
                    <Badge
                      variant="outline"
                      className="mt-1 text-base font-semibold"
                    >
                      {pattern?.patternName}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">
                      Mô tả
                    </label>
                    <p className="text-base text-gray-800 mt-1 whitespace-pre-wrap">
                      {pattern?.description || "Chưa có mô tả"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="varieties" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Fish className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Danh sách giống cá
                </h3>
              </div>
              <Button
                onClick={() => setIsAssignDialogOpen(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Gán Giống Cá
              </Button>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Đang tải danh sách giống cá...
                </p>
              </div>
            ) : varieties.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead>Tên giống</TableHead>
                      <TableHead>Đặc điểm</TableHead>
                      <TableHead>Quốc gia</TableHead>
                      <TableHead className="text-center w-16">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {varieties.map((variety, index) => (
                      <TableRow key={variety.id} className="hover:bg-muted/50">
                        <TableCell className="text-center font-medium text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {variety.varietyName}
                        </TableCell>
                        <TableCell className="max-w-xs text-sm text-gray-600 truncate">
                          {variety.characteristic}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {variety.originCountry}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVariety(variety.id)}
                            disabled={isRemoving}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Fish className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-600 mb-1">
                  Chưa có giống cá
                </p>
                <p className="text-sm text-muted-foreground">
                  Chưa có giống cá nào được gán cho hoa văn này
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AssignVarietyDialog
          isOpen={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          patternId={pattern?.id || 0}
        />
      </DialogContent>
    </Dialog>
  );
}
