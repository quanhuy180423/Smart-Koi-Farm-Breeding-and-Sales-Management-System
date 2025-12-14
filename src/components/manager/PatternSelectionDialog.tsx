import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPatternsByVariety } from "@/hooks/usePattern";
import { Pattern } from "@/lib/api/services/fetchPattern";
import { BaseResponse, PagedResponse } from "@/lib/api/apiClient";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PatternSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (patternId: number, patternName: string) => void;
  varietyId: number | null;
  initialSelectedId?: number;
}
export default function PatternSelectionDialog({
  isOpen,
  onOpenChange,
  onSelect,
  varietyId,
  initialSelectedId,
}: PatternSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialSelectedId
  );
  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);
  const { data: patternsData, isLoading } = useGetPatternsByVariety(varietyId);

  type PatternsApiShape =
    | Pattern[]
    | BaseResponse<Pattern[]>
    | BaseResponse<PagedResponse<Pattern>>
    | PagedResponse<Pattern>
    | undefined;

  const extractPatterns = (data: PatternsApiShape): Pattern[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // BaseResponse<Pattern[]> or BaseResponse<PagedResponse<Pattern>>
    if ("result" in data) {
      const result = (data as BaseResponse<Pattern[] | PagedResponse<Pattern>>).result;
      if (Array.isArray(result)) return result as Pattern[];
      if (result && "data" in result && Array.isArray((result as PagedResponse<Pattern>).data)) {
        return (result as PagedResponse<Pattern>).data;
      }
    }

    // PagedResponse<Pattern>
    if ("data" in data && Array.isArray((data as PagedResponse<Pattern>).data)) {
      return (data as PagedResponse<Pattern>).data;
    }

    return [];
  };

  const patterns: Pattern[] = extractPatterns(patternsData as PatternsApiShape);

  const filtered = patterns.filter((p) => {
    if (!searchTerm) return true;
    return (
      p.patternName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleConfirm = () => {
    if (selectedId) {
      const selected = patterns.find((p) => p.id === selectedId);
      if (selected) onSelect(selectedId, selected.patternName);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Chọn hoa văn</DialogTitle>
          <DialogDescription>
            Chọn hoa văn tương ứng với giống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm hoa văn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải danh sách hoa văn...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead className="w-[45%]">Tên hoa văn</TableHead>
                    <TableHead className="w-[50%]">Mô tả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-500 py-4"
                      >
                        Không tìm thấy hoa văn.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => (
                      <TableRow
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className={
                          p.id === selectedId
                            ? "bg-blue-50/50 cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                        }
                      >
                        <TableCell>
                          <input
                            type="radio"
                            checked={p.id === selectedId}
                            onChange={() => setSelectedId(p.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {p.patternName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {p.description || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId || isLoading}>
            Chọn hoa văn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
