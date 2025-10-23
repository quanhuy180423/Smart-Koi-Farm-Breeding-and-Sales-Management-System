import { PaginationSection } from "@/components/common/PaginationSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAreas } from "@/hooks/useArea";
import { AreaSearchParams } from "@/lib/api/services/fetchArea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AreaSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (areaId: string) => void;
    initialSelectedId: string;
}

const PAGE_SIZE_OPTIONS: number[] = [5, 10, 20]

const AreaSelectionDialog = ({
    isOpen,
    onOpenChange,
    onSelect,
    initialSelectedId,
}: AreaSelectionDialogProps) => {
    const [areaSearchTerm, setAreaSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(initialSelectedId);
    const [areaSearchParams, setAreaSearchParams] = useState<AreaSearchParams>({
        pageIndex: 1,
        pageSize: PAGE_SIZE_OPTIONS[0],
        search: "",
    });

    useEffect(() => {
        setSelectedId(initialSelectedId);
    }, [initialSelectedId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAreaSearchParams((prev) => ({
                ...prev,
                search: areaSearchTerm,
                pageIndex: 1,
            }));
        }, 300);
        return () => clearTimeout(timer);
    }, [areaSearchTerm]);

    const { data: areasData, isLoading: isTableLoading } =
        useGetAreas(areaSearchParams);
    const areas = areasData?.data || [];
    const totalItems = areasData?.totalItems || 0;
    const totalPages = areasData?.totalPages || 0;

    const handlePageChange = (page: number) =>
        setAreaSearchParams((prev) => ({ ...prev, pageIndex: page }));
    const handlePageSizeChange = (size: number) =>
        setAreaSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));

    const handleConfirm = () => {
        if (selectedId) {
            onSelect(selectedId);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Chọn Khu vực</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Tìm kiếm khu vực theo tên..."
                        value={areaSearchTerm}
                        onChange={(e) => setAreaSearchTerm(e.target.value)}
                        className="w-full"
                    />

                    {isTableLoading ? (
                        <div className="flex items-center justify-center py-10 text-gray-500">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang tải danh sách khu vực...
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[5%]">#</TableHead>
                                        <TableHead className="w-[30%]">Tên Khu vực</TableHead>
                                        <TableHead className="w-[20%]">Diện tích (m²)</TableHead>
                                        <TableHead className="w-[45%]">Mô tả</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {areas.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-gray-500 py-4"
                                            >
                                                Không tìm thấy khu vực nào.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        areas.map((area) => (
                                            <TableRow
                                                key={area.id}
                                                onClick={() => setSelectedId(String(area.id))}
                                                className={
                                                    String(area.id) === String(selectedId)
                                                        ? "bg-blue-50/50 cursor-pointer"
                                                        : "hover:bg-gray-50 cursor-pointer"
                                                }
                                            >
                                                <TableCell>
                                                    <input
                                                        type="radio"
                                                        checked={String(area.id) === String(selectedId)}
                                                        onChange={() => setSelectedId(String(area.id))}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {area.areaName}
                                                </TableCell>
                                                <TableCell>{area.totalAreaSQM}</TableCell>
                                                <TableCell className="truncate text-sm text-gray-500">
                                                    {area.description || "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {totalItems > 0 && (
                                <PaginationSection
                                    totalItems={totalItems}
                                    postsPerPage={areaSearchParams.pageSize}
                                    currentPage={areaSearchParams.pageIndex}
                                    setCurrentPage={handlePageChange}
                                    totalPages={totalPages}
                                    setPageSize={handlePageSizeChange}
                                    hasNextPage={areasData?.hasNextPage}
                                    hasPreviousPage={areasData?.hasPreviousPage}
                                    pageSizeOptions={[5, 10, 20]}
                                />
                            )}
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedId || isTableLoading}
                    >
                        Chọn Khu vực
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AreaSelectionDialog;