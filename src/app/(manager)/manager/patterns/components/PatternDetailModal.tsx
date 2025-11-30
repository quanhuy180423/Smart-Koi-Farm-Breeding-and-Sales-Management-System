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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Pattern } from "@/lib/api/services/fetchPattern";
import {
  useGetPatternVarieties,
  useRemoveVarietyFromPattern,
} from "@/hooks/usePattern";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { Button } from "@/components/ui/button";
import AssignVarietyDialog from "./AssignVarietyDialog";

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
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết hoa văn: {pattern?.patternName}</DialogTitle>
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
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tên hoa văn
                </label>
                <p className="text-sm text-gray-900">{pattern?.patternName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Mô tả
                </label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {pattern?.description}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="varieties" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsAssignDialogOpen(true)}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Gán Giống Cá
              </Button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
              <div className="text-center py-8">
                <p className="text-muted-foreground">Không có giống cá nào</p>
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
