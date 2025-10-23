import { PaginationSection } from "@/components/common/PaginationSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetPondTypes } from "@/hooks/usePondType";
import { PondTypeSearchParams } from "@/lib/api/services/fetchPondType";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PondTypeSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (pondTypeId: string) => void;
    initialSelectedId: string;
}

const PAGE_SIZE_OPTIONS: number[] = [5, 10, 20]

const PondTypeSelectionDialog = ({
    isOpen,
    onOpenChange,
    onSelect,
    initialSelectedId,
}: PondTypeSelectionDialogProps) => {
    const [typeSearchTerm, setTypeSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(initialSelectedId);
    const [typeSearchParams, setTypeSearchParams] =
        useState<PondTypeSearchParams>({
            pageIndex: 1,
            pageSize: PAGE_SIZE_OPTIONS[0],
            search: "",
        });

    useEffect(() => {
        setSelectedId(initialSelectedId);
    }, [initialSelectedId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTypeSearchParams((prev) => ({
                ...prev,
                search: typeSearchTerm,
                pageIndex: 1,
            }));
        }, 300);
        return () => clearTimeout(timer);
    }, [typeSearchTerm]);

    const { data: typesData, isLoading: isTableLoading } =
        useGetPondTypes(typeSearchParams);
    const pondTypes = typesData?.data || [];
    const totalItems = typesData?.totalItems || 0;
    const totalPages = typesData?.totalPages || 1;

    const handlePageChange = (page: number) =>
        setTypeSearchParams((prev) => ({ ...prev, pageIndex: page }));
    const handlePageSizeChange = (size: number) =>
        setTypeSearchParams((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));

    const handleConfirm = () => {
        if (selectedId) {
            onSelect(selectedId);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Chọn Loại Hồ</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Tìm kiếm loại hồ theo tên..."
                        value={typeSearchTerm}
                        onChange={(e) => setTypeSearchTerm(e.target.value)}
                        className="w-full"
                    />

                    {isTableLoading ? (
                        <div className="flex items-center justify-center py-10 text-gray-500">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang tải danh sách loại hồ...
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[5%]">#</TableHead>
                                        <TableHead className="w-[20%]">Tên Loại Hồ</TableHead>
                                        <TableHead className="w-[20%]">Sức Chứa Khuyến Nghị</TableHead>
                                        <TableHead className="w-[55%]">Mô tả</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pondTypes.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-gray-500 py-4"
                                            >
                                                Không tìm thấy loại hồ nào.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pondTypes.map((type) => (
                                            <TableRow
                                                key={type.id}
                                                onClick={() => setSelectedId(String(type.id))}
                                                className={
                                                    String(type.id) === String(selectedId)
                                                        ? "bg-blue-50/50 cursor-pointer"
                                                        : "hover:bg-gray-50 cursor-pointer"
                                                }
                                            >
                                                <TableCell>
                                                    <input
                                                        type="radio"
                                                        checked={String(type.id) === String(selectedId)}
                                                        onChange={() => setSelectedId(String(type.id))}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {type.typeName}
                                                </TableCell>
                                                <TableCell>
                                                    {type.recommendedCapacity.toLocaleString()} Lít
                                                </TableCell>
                                                <TableCell className="truncate text-sm text-gray-500">
                                                    {type.description || "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {totalItems > 0 && (
                                <PaginationSection
                                    totalItems={totalItems}
                                    postsPerPage={typeSearchParams.pageSize}
                                    currentPage={typeSearchParams.pageIndex}
                                    setCurrentPage={handlePageChange}
                                    totalPages={totalPages}
                                    setPageSize={handlePageSizeChange}
                                    hasNextPage={typesData?.hasNextPage}
                                    hasPreviousPage={typesData?.hasPreviousPage}
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
                        Chọn Loại Hồ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PondTypeSelectionDialog;