"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BreedingProcessResponse, BreedingStatus } from "@/lib/api/services/fetchBreedingProcess";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { getBreedingStatusLabel } from "@/lib/utils/enum";
import { BreedingStageCard } from "./BreedingStageCard";
import { useGetEggBatchByBreedingProcessId } from "@/hooks/useEggBatch";
import { useGetIncubationDailyRecordByEggBatchId } from "@/hooks/useIncubationDailyRecord";
import { IncubationDailyRecordResponse } from "@/lib/api/services/fetchIncubationDailyRecord";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useGetFryFishByBreedingProcessId } from "@/hooks/useFryFish";
import { useGetFrySurvivalRecords } from "@/hooks/useFrySurvivalRecord";
import { FrySurvivalRecordResponse } from "@/lib/api/services/fetchFrySurvivalRecord";
import { cn } from "@/lib/utils";
import { useGetClassificationStageByBreedingProcessId } from "@/hooks/useClassificationStage";
import { ClassificationRecordResponse } from "@/lib/api/services/fetchClassificationRecord";

interface BreedingDetailDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    breedingProcess: BreedingProcessResponse | null;
}

export const BreedingDetailDialog = ({
    isOpen,
    onOpenChange,
    breedingProcess,
}: BreedingDetailDialogProps) => {
    const breedingId = breedingProcess?.id;

    const DEFAULT_PAGE_SIZE = 5;
    const [incubationPagingRequest, setIncubationPagingRequest] = useState({ pageIndex: 1, pageSize: DEFAULT_PAGE_SIZE });
    const [frySurvivalPagingRequest, setFrySurvivalPagingRequest] = useState({ pageIndex: 1, pageSize: DEFAULT_PAGE_SIZE });

    const { data: eggBatch } = useGetEggBatchByBreedingProcessId(breedingId);
    const { data: fryFish } = useGetFryFishByBreedingProcessId(breedingId);
    const {
        data: classificationStages,
        isLoading: isLoadingClassification
    } = useGetClassificationStageByBreedingProcessId(breedingId);

    const {
        data: incubationDailyRecords,
        isLoading: isLoadingDailyRecords,
        isFetching: isFetchingDailyRecords
    } = useGetIncubationDailyRecordByEggBatchId(
        eggBatch?.id,
        incubationPagingRequest
    );

    const {
        data: frySurvivalRecords,
        isLoading: isLoadingFryRecords,
        isFetching: isFetchingFryRecords
    } = useGetFrySurvivalRecords({
        ...frySurvivalPagingRequest,
        fryFishId: fryFish?.id
    });

    const incubationRecords = incubationDailyRecords?.data || [];
    const fryRecords = frySurvivalRecords?.data || [];
    const classificationRecords = classificationStages?.classificationRecords || [];

    const handleIncubationPreviousPage = () => {
        setIncubationPagingRequest(prev => ({ ...prev, pageIndex: Math.max(1, prev.pageIndex - 1) }));
    };

    const handleIncubationNextPage = () => {
        setIncubationPagingRequest(prev => ({
            ...prev,
            pageIndex: Math.min(incubationDailyRecords?.totalPages || 1, prev.pageIndex + 1)
        }));
    };

    const handleFrySurvivalPreviousPage = () => {
        setFrySurvivalPagingRequest(prev => ({ ...prev, pageIndex: Math.max(1, prev.pageIndex - 1) }));
    };

    const handleFrySurvivalNextPage = () => {
        setFrySurvivalPagingRequest(prev => ({
            ...prev,
            pageIndex: Math.min(frySurvivalRecords?.totalPages || 1, prev.pageIndex + 1)
        }));
    };

    const getProcessStatus = (currentStatus: BreedingStatus, checkStatus: BreedingStatus): 'Hoàn thành' | 'Đang diễn ra' | 'Sắp tới' | 'Thất bại' => {
        if (!currentStatus) return "Sắp tới";
        const checkList: Record<BreedingStatus, number> = {
            [BreedingStatus.PAIRING]: 1,
            [BreedingStatus.SPAWNED]: 2,
            [BreedingStatus.EGG_BATCH]: 3,
            [BreedingStatus.FRY_FISH]: 4,
            [BreedingStatus.CLASSIFICATION]: 5,
            [BreedingStatus.COMPLETE]: 6,
            [BreedingStatus.FAILED]: 99,
        }

        if (currentStatus === BreedingStatus.FAILED) return "Thất bại";

        const currentVal = checkList[currentStatus];
        const checkVal = checkList[checkStatus];

        if (currentVal < checkVal) return "Sắp tới";
        if (currentVal === checkVal) return "Đang diễn ra";
        if (currentVal > checkVal) return "Hoàn thành";

        return "Sắp tới";
    }

    const currentBreedingStatus = breedingProcess?.status || BreedingStatus.PAIRING;

    // const classificationDisplayDate = classificationStages?.createdAt
    //     ? formatDate(classificationStages.createdAt, DATE_FORMATS.MEDIUM_DATE)
    //     : breedingProcess.endDate ? formatDate(breedingProcess.endDate, DATE_FORMATS.MEDIUM_DATE) : 'Chưa có';

    const totalKept = classificationRecords.reduce((sum, record) => sum + (record.highQualifiedCount || 0) + (record.qualifiedCount || 0), 0);
    const totalCulled = classificationRecords.reduce((sum, record) => sum + (record.unqualifiedCount || 0), 0);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết đợt lai</DialogTitle>
                    <DialogDescription>Xem toàn bộ tiến trình sinh sản</DialogDescription>
                </DialogHeader>

                {breedingProcess && (
                    <div className="space-y-4 text-sm">
                        {/* --- Thông tin cơ bản --- */}
                        <Card>
                            <CardHeader><CardTitle>Thông tin cơ bản</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                <p><b>Mã chu kỳ:</b> {breedingProcess.code}</p>
                                <p><b>Trạng thái:</b> {getBreedingStatusLabel(currentBreedingStatus).label}</p>
                                <p><b>Cá đực (RFID):</b> {breedingProcess.maleKoiRFID}</p>
                                <p><b>Cá cái (RFID):</b> {breedingProcess.femaleKoiRFID}</p>
                                <p><b>Ngày bắt đầu:</b> {formatDate(breedingProcess.startDate, DATE_FORMATS.MEDIUM_DATE)}</p>
                                <p><b>Ngày kết thúc dự kiến:</b> {formatDate(breedingProcess.endDate, DATE_FORMATS.MEDIUM_DATE) || "Chưa xác định"}</p>
                            </CardContent>
                        </Card>

                        {/* --- Tiến trình sinh sản (Timeline) --- */}
                        <Card>
                            <CardHeader><CardTitle>Tiến trình sinh sản</CardTitle></CardHeader>
                            <CardContent className="space-y-0 p-3">

                                {/* 1. Ghép cặp */}
                                <BreedingStageCard
                                    title="Ghép cặp"
                                    date={formatDate(breedingProcess.startDate, DATE_FORMATS.MEDIUM_DATE)}
                                    status={getProcessStatus(currentBreedingStatus, BreedingStatus.PAIRING)}
                                >
                                    <p className="text-muted-foreground">Cá đực (RFID): {breedingProcess.maleKoiRFID}</p>
                                    <p className="text-muted-foreground">Cá cái (RFID): {breedingProcess.femaleKoiRFID}</p>
                                </BreedingStageCard>

                                {/* 2. Đẻ trứng */}
                                <BreedingStageCard
                                    title="Đẻ trứng"
                                    date={eggBatch?.spawnDate ? formatDate(eggBatch.spawnDate, DATE_FORMATS.MEDIUM_DATE) : "Chưa có"}
                                    status={getProcessStatus(currentBreedingStatus, BreedingStatus.SPAWNED)}
                                >
                                    <p className="text-muted-foreground">Số lượng trứng: <span className="font-semibold">{eggBatch?.quantity || 0}</span> trứng</p>
                                    <p className="text-muted-foreground">Tỷ lệ thụ tinh: <span className="font-semibold">{(eggBatch?.fertilizationRate || 0) * 100}%</span></p>
                                </BreedingStageCard>

                                {/* 3. Ấp trứng */}
                                <BreedingStageCard
                                    title="Ấp trứng"
                                    date={eggBatch?.hatchingTime ? formatDate(eggBatch.hatchingTime, DATE_FORMATS.MEDIUM_DATE) : "Chưa có"}
                                    status={getProcessStatus(currentBreedingStatus, BreedingStatus.EGG_BATCH)}
                                >
                                    {getProcessStatus(currentBreedingStatus, BreedingStatus.EGG_BATCH) !== 'Sắp tới' &&
                                        getProcessStatus(currentBreedingStatus, BreedingStatus.EGG_BATCH) !== 'Thất bại' ? (
                                        <div className="space-y-3">
                                            {/* Thống kê nhanh */}
                                            <p className="text-muted-foreground">
                                                Tổng trứng ban đầu: <span className="font-semibold">{eggBatch?.quantity}</span> | Ngày dự kiến nở: <span className="font-semibold">{formatDate(eggBatch?.hatchingTime, DATE_FORMATS.MEDIUM_DATE)}</span>
                                            </p>

                                            <h4 className="font-semibold text-gray-700 mt-3">
                                                Theo dõi Ấp trứng hàng ngày {isFetchingDailyRecords && <Loader2 className="h-4 w-4 inline-block ml-2 animate-spin text-blue-500" />}
                                            </h4>

                                            <div className="overflow-x-auto border rounded-lg">
                                                <Table className="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[80px]">Ngày</TableHead>
                                                            <TableHead>Trứng Khỏe</TableHead>
                                                            <TableHead>Trứng Hỏng</TableHead>
                                                            <TableHead>Trứng Nở</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {incubationRecords.length > 0 ? incubationRecords.map((record: IncubationDailyRecordResponse) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="font-medium">{record.dayNumber}</TableCell>
                                                                <TableCell>{record.healthyEggs}</TableCell>
                                                                <TableCell className="text-red-500">{record.rottenEggs}</TableCell>
                                                                <TableCell className="text-green-600">{record.hatchedEggs}</TableCell>
                                                            </TableRow>
                                                        )) : (<TableRow><TableCell colSpan={4} className="h-12 text-center text-gray-500">
                                                            {isLoadingDailyRecords || isFetchingDailyRecords ? "Đang tải dữ liệu..." : "Chưa có bản ghi theo dõi ấp trứng."}</TableCell></TableRow>)}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Incubation Pagination - ĐÃ SỬA LỖI ẨN KHI KHÔNG CÓ DATA */}
                                            {incubationDailyRecords && incubationDailyRecords.totalItems > 0 && (
                                                <div className="flex items-center justify-between py-2 px-1">
                                                    <div className="text-xs text-muted-foreground">
                                                        Hiển thị {incubationRecords.length} trong tổng số {incubationDailyRecords.totalItems} bản ghi.
                                                    </div>
                                                    <div className="space-x-2 flex items-center">
                                                        <div className="text-xs text-muted-foreground">Trang {incubationDailyRecords.pageIndex} trên {incubationDailyRecords.totalPages}</div>
                                                        <Button variant="outline" size="sm" onClick={handleIncubationPreviousPage} disabled={incubationDailyRecords.pageIndex === 1 || isFetchingDailyRecords}><ChevronLeft className="h-4 w-4" /></Button>
                                                        <Button variant="outline" size="sm" onClick={handleIncubationNextPage} disabled={(incubationDailyRecords.pageIndex === incubationDailyRecords.totalPages) || isFetchingDailyRecords}><ChevronRight className="h-4 w-4" /></Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className={cn("font-medium", getProcessStatus(currentBreedingStatus, BreedingStatus.EGG_BATCH) === 'Thất bại' ? 'text-red-600' : 'text-muted-foreground')}>
                                            {getProcessStatus(currentBreedingStatus, BreedingStatus.EGG_BATCH) === 'Thất bại' ? "Giai đoạn ấp trứng đã thất bại." : "Giai đoạn ấp trứng chưa bắt đầu."}
                                        </p>
                                    )}
                                </BreedingStageCard>

                                {/* 4. Nuôi Cá Bột (FRY_FISH) */}
                                <BreedingStageCard
                                    title="Nuôi Cá Bột"
                                    // date={fryFish?.createdAt ? formatDate(fryFish.createdAt, DATE_FORMATS.MEDIUM_DATE) : "Chưa có"}
                                    date="Chưa có"
                                    status={getProcessStatus(currentBreedingStatus, BreedingStatus.FRY_FISH)}
                                    isLast={getProcessStatus(currentBreedingStatus, BreedingStatus.CLASSIFICATION) === 'Sắp tới'}
                                >
                                    {getProcessStatus(currentBreedingStatus, BreedingStatus.FRY_FISH) !== 'Sắp tới' &&
                                        getProcessStatus(currentBreedingStatus, BreedingStatus.FRY_FISH) !== 'Thất bại' ? (
                                        <div className="space-y-3">
                                            <p className="text-muted-foreground">Cá bột được chuyển từ hồ: <span className="font-semibold">{fryFish?.pondId || '...'}</span></p>
                                            <p className="text-muted-foreground">Tổng số cá bột ban đầu: <span className="font-semibold">{fryFish?.initialCount || '...'}</span></p>

                                            <h4 className="font-semibold text-gray-700 mt-3">
                                                Theo dõi Tỷ lệ sống sót cá bột
                                                {isFetchingFryRecords && <Loader2 className="h-4 w-4 inline-block ml-2 animate-spin text-blue-500" />}
                                            </h4>

                                            <div className="overflow-x-auto border rounded-lg">
                                                <Table className="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[80px]">Ngày #</TableHead>
                                                            <TableHead>Ngày ghi nhận</TableHead>
                                                            <TableHead>Tỷ lệ Sống sót</TableHead>
                                                            <TableHead>Số lượng sống</TableHead>
                                                            <TableHead className="w-[30%]">Ghi chú</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {fryRecords.length > 0 ? fryRecords.map((record: FrySurvivalRecordResponse) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="font-medium">{record.dayNumber}</TableCell>
                                                                <TableCell>{formatDate(record.createdAt, DATE_FORMATS.SHORT_DATE)}</TableCell>
                                                                <TableCell className="font-semibold text-green-600">{(record.survivalRate * 100).toFixed(1)}%</TableCell>
                                                                <TableCell>{record.countAlive}</TableCell>
                                                                <TableCell className="truncate max-w-xs">{record.note}</TableCell>
                                                            </TableRow>
                                                        )) : (
                                                            <TableRow>
                                                                <TableCell colSpan={5} className="h-12 text-center text-gray-500">
                                                                    {isLoadingFryRecords || isFetchingFryRecords ? "Đang tải dữ liệu..." : "Chưa có bản ghi theo dõi sống sót."}
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Fry Survival Pagination - ĐÃ SỬA LỖI ẨN KHI KHÔNG CÓ DATA */}
                                            {frySurvivalRecords && frySurvivalRecords.totalItems > 0 && (
                                                <div className="flex items-center justify-between py-2 px-1">
                                                    <div className="text-xs text-muted-foreground">
                                                        Hiển thị {fryRecords.length} trong {frySurvivalRecords.totalItems} bản ghi.
                                                    </div>
                                                    <div className="space-x-2 flex items-center">
                                                        <div className="text-xs text-muted-foreground">
                                                            Trang {frySurvivalPagingRequest.pageIndex} trên {frySurvivalRecords.totalPages}
                                                        </div>
                                                        <Button variant="outline" size="sm" onClick={handleFrySurvivalPreviousPage} disabled={frySurvivalPagingRequest.pageIndex <= 1 || isFetchingFryRecords}><ChevronLeft className="h-4 w-4" /></Button>
                                                        <Button variant="outline" size="sm" onClick={handleFrySurvivalNextPage} disabled={frySurvivalPagingRequest.pageIndex >= (frySurvivalRecords.totalPages) || isFetchingFryRecords}><ChevronRight className="h-4 w-4" /></Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className={cn("font-medium", getProcessStatus(currentBreedingStatus, BreedingStatus.FRY_FISH) === 'Thất bại' ? 'text-red-600' : 'text-muted-foreground')}>
                                            {getProcessStatus(currentBreedingStatus, BreedingStatus.FRY_FISH) === 'Thất bại' ? "Giai đoạn nuôi cá bột đã thất bại." : "Giai đoạn nuôi cá bột chưa bắt đầu."}
                                        </p>
                                    )}
                                </BreedingStageCard>

                                {/* 5. Tuyển chọn (CLASSIFICATION) */}
                                <BreedingStageCard
                                    title="Tuyển chọn"
                                    // date={classificationDisplayDate}
                                    date="Chưa có"
                                    status={getProcessStatus(currentBreedingStatus, BreedingStatus.CLASSIFICATION)}
                                    isLast={getProcessStatus(currentBreedingStatus, BreedingStatus.COMPLETE) === 'Sắp tới'}
                                >
                                    {isLoadingClassification ? (
                                        <div className="flex justify-center py-4 text-gray-500"><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Đang tải dữ liệu tuyển chọn...</div>
                                    ) : (getProcessStatus(currentBreedingStatus, BreedingStatus.CLASSIFICATION) !== 'Sắp tới' &&
                                        getProcessStatus(currentBreedingStatus, BreedingStatus.CLASSIFICATION) !== 'Thất bại' ? (
                                        <div className="space-y-3">
                                            <p className="text-muted-foreground">Tổng số cá được phân loại: <span className="font-semibold">{classificationStages?.totalCount || 0}</span></p>
                                            <p className="text-muted-foreground">Tổng số cá được giữ lại (Show/High/Pond): <span className="font-semibold text-green-600">{totalKept}</span></p>
                                            <p className="text-muted-foreground">Tổng số cá loại bỏ (Culled): <span className="font-semibold text-red-600">{totalCulled}</span></p>

                                            <h4 className="font-semibold text-gray-700 mt-4">Kết quả chi tiết qua các đợt tuyển:</h4>

                                            <div className="overflow-x-auto border rounded-lg">
                                                <Table className="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[120px]">Đợt Tuyển</TableHead>
                                                            <TableHead>Show</TableHead>
                                                            <TableHead>High</TableHead>
                                                            <TableHead>Pond</TableHead>
                                                            <TableHead>Culled</TableHead>
                                                            <TableHead className="w-[30%]">Ghi chú</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {classificationRecords.length > 0 ? classificationRecords.map((record: ClassificationRecordResponse, index) => (
                                                            <TableRow key={record.id}>
                                                                <TableCell className="font-medium">Đợt {index + 1} ({record.stageName})</TableCell>
                                                                <TableCell className="text-blue-600">{record.highQualifiedCount || 0}</TableCell>
                                                                <TableCell className="text-green-600">{record.qualifiedCount || 0}</TableCell>
                                                                <TableCell>{record.unqualifiedCount || 0}</TableCell>
                                                                <TableCell className="text-red-600">{record.unqualifiedCount || 0}</TableCell>
                                                                <TableCell className="truncate max-w-xs">{record.notes}</TableCell>
                                                            </TableRow>
                                                        )) : (
                                                            <TableRow>
                                                                <TableCell colSpan={6} className="h-12 text-center text-gray-500">
                                                                    Chưa có bản ghi phân loại nào được tạo.
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={cn("font-medium", getProcessStatus(currentBreedingStatus, BreedingStatus.CLASSIFICATION) === 'Thất bại' ? 'text-red-600' : 'text-muted-foreground')}>
                                            {getProcessStatus(currentBreedingStatus, BreedingStatus.CLASSIFICATION) === 'Thất bại' ? "Giai đoạn tuyển chọn đã thất bại/bị bỏ qua." : "Giai đoạn tuyển chọn chưa bắt đầu."}
                                        </p>
                                    ))}
                                </BreedingStageCard>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};