import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BreedingProcessResponse,
  BreedingStatus,
} from "@/lib/api/services/fetchBreedingProcess";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { getBreedingStatusLabel } from "@/lib/utils/enum";
import { BreedingStageCard } from "./BreedingStageCard";
import { IncubationDailyRecordResponse } from "@/lib/api/services/fetchIncubationDailyRecord";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { FrySurvivalRecordResponse } from "@/lib/api/services/fetchFrySurvivalRecord";
import { cn } from "@/lib/utils";
import { ClassificationRecordResponse } from "@/lib/api/services/fetchClassificationRecord";
import { useGetBreedingDetail } from "@/hooks/useBreedingProcess";

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

  const { data: breedingDetail, isLoading } = useGetBreedingDetail(breedingId);

  const batch = breedingDetail?.batch;
  const fryFish = breedingDetail?.fryFish;
  const classificationStage = breedingDetail?.classificationStage;

  const incubationDailyRecords = batch?.incubationDailyRecords || [];
  const frySurvivalRecords = fryFish?.frySurvivalRecords || [];
  const classificationRecords =
    classificationStage?.classificationRecords || [];

  const getProcessStatus = (
    currentStatus: BreedingStatus,
    checkStatus: BreedingStatus,
  ): "Hoàn thành" | "Đang diễn ra" | "Sắp tới" | "Thất bại" => {
    if (!currentStatus) return "Sắp tới";
    const checkList: Record<BreedingStatus, number> = {
      [BreedingStatus.PAIRING]: 1,
      [BreedingStatus.SPAWNED]: 2,
      [BreedingStatus.EGG_BATCH]: 3,
      [BreedingStatus.FRY_FISH]: 4,
      [BreedingStatus.CLASSIFICATION]: 5,
      [BreedingStatus.COMPLETE]: 6,
      [BreedingStatus.FAILED]: 99,
    };

    if (currentStatus === BreedingStatus.FAILED) return "Thất bại";

    const currentVal = checkList[currentStatus];
    const checkVal = checkList[checkStatus];

    if (currentVal < checkVal) return "Sắp tới";
    if (currentVal === checkVal) return "Đang diễn ra";
    if (currentVal > checkVal) return "Hoàn thành";

    return "Sắp tới";
  };

  const currentBreedingStatus =
    breedingProcess?.status || BreedingStatus.PAIRING;

  // const classificationDisplayDate = classificationStages?.createdAt
  //     ? formatDate(classificationStages.createdAt, DATE_FORMATS.MEDIUM_DATE)
  //     : breedingProcess.endDate ? formatDate(breedingProcess.endDate, DATE_FORMATS.MEDIUM_DATE) : 'Chưa có';

  const totalKept = classificationRecords.reduce(
    (sum, record) =>
      sum +
      (record.highQualifiedCount || 0) +
      (record.showQualifiedCount || 0) +
      (record.pondQualifiedCount || 0),
    0,
  );
  const totalCulled = classificationRecords.reduce(
    (sum, record) => sum + (record.cullQualifiedCount || 0),
    0,
  );

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
            <Card className="border-0 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium">Mã chu kỳ</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {breedingProcess.code}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur border border-purple-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Trạng thái
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {getBreedingStatusLabel(currentBreedingStatus).label}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur border border-orange-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Cá đực (RFID)
                  </p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono">
                    {breedingProcess.maleKoiRFID}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur border border-pink-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Cá cái (RFID)
                  </p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono">
                    {breedingProcess.femaleKoiRFID}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur border border-green-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Ngày bắt đầu
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {formatDate(
                      breedingProcess.startDate,
                      DATE_FORMATS.MEDIUM_DATE,
                    )}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur border border-red-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium">
                    Ngày kết thúc dự kiến
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {breedingProcess.endDate
                      ? formatDate(
                          breedingProcess.endDate,
                          DATE_FORMATS.MEDIUM_DATE,
                        )
                      : "Chưa xác định"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* --- Tiến trình sinh sản (Timeline) --- */}
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải dữ liệu...
              </div>
            ) : (
              <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Tiến trình sinh sản
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        Theo dõi từng giai đoạn phát triển từ ghép cặp đến tuyển
                        chọn
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {/* 1. Ghép cặp */}
                  <BreedingStageCard
                    title="Ghép cặp"
                    date={formatDate(
                      breedingProcess.startDate,
                      DATE_FORMATS.MEDIUM_DATE,
                    )}
                    status={getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.PAIRING,
                    )}
                  >
                    <p className="text-muted-foreground">
                      Cá đực (RFID): {breedingProcess.maleKoiRFID}
                    </p>
                    <p className="text-muted-foreground">
                      Cá cái (RFID): {breedingProcess.femaleKoiRFID}
                    </p>
                  </BreedingStageCard>

                  {/* 2. Đẻ trứng */}
                  <BreedingStageCard
                    title="Đẻ trứng"
                    date={
                      batch?.spawnDate
                        ? formatDate(batch.spawnDate, DATE_FORMATS.MEDIUM_DATE)
                        : "Chưa có"
                    }
                    status={getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.SPAWNED,
                    )}
                  >
                    {getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.SPAWNED,
                    ) !== "Sắp tới" &&
                    getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.SPAWNED,
                    ) !== "Thất bại" ? (
                      <>
                        <p className="text-muted-foreground">
                          Số lượng trứng:{" "}
                          <span className="font-semibold">
                            {batch?.quantity || 0}
                          </span>{" "}
                          trứng
                        </p>
                        <p className="text-muted-foreground">
                          Tỷ lệ thụ tinh:{" "}
                          <span className="font-semibold">
                            {(batch?.fertilizationRate || 0) * 100}%
                          </span>
                        </p>
                      </>
                    ) : (
                      <p
                        className={cn(
                          "font-medium",
                          getProcessStatus(
                            currentBreedingStatus,
                            BreedingStatus.SPAWNED,
                          ) === "Thất bại"
                            ? "text-red-600"
                            : "text-muted-foreground",
                        )}
                      >
                        {getProcessStatus(
                          currentBreedingStatus,
                          BreedingStatus.SPAWNED,
                        ) === "Thất bại"
                          ? "Giai đoạn đã đẻ đã thất bại."
                          : "Giai đoạn đã đẻ chưa bắt đầu."}
                      </p>
                    )}
                  </BreedingStageCard>

                  {/* 3. Ấp trứng */}
                  <BreedingStageCard
                    title="Ấp trứng"
                    date={
                      batch?.endDate
                        ? formatDate(batch.endDate, DATE_FORMATS.MEDIUM_DATE)
                        : "Chưa có"
                    }
                    status={getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.EGG_BATCH,
                    )}
                  >
                    {getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.EGG_BATCH,
                    ) !== "Sắp tới" &&
                    getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.EGG_BATCH,
                    ) !== "Thất bại" ? (
                      <div className="space-y-4">
                        {/* Thống kê nhanh */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-xs text-orange-600 font-medium">
                              Tổng trứng ban đầu
                            </p>
                            <p className="text-2xl font-bold text-orange-700 mt-1">
                              {batch?.quantity || 0}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-3">
                            <p className="text-xs text-cyan-600 font-medium">
                              Ngày dự kiến nở
                            </p>
                            <p className="text-2xl font-bold text-cyan-700 mt-1">
                              {formatDate(
                                batch?.hatchingTime,
                                DATE_FORMATS.MEDIUM_DATE,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Theo dõi Ấp trứng hàng ngày
                          </h4>
                        </div>

                        <div className="overflow-x-auto border rounded-xl border-gray-200 shadow-sm">
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[20%] text-center">
                                  Ngày
                                </TableHead>
                                <TableHead className="w-[20%] text-center">
                                  Trứng Khỏe
                                </TableHead>
                                <TableHead className="w-[20%] text-center">
                                  Trứng Hỏng
                                </TableHead>
                                <TableHead className="w-[20%] text-center">
                                  Trứng Nở
                                </TableHead>
                                <TableHead className="w-[20%] text-center">
                                  Trạng thái
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {incubationDailyRecords.length > 0 ? (
                                incubationDailyRecords.map(
                                  (
                                    record: IncubationDailyRecordResponse,
                                    idx,
                                  ) => (
                                    <TableRow
                                      key={record.id}
                                      className={cn(
                                        "hover:bg-blue-50 transition-colors",
                                        idx % 2 === 0
                                          ? "bg-white"
                                          : "bg-slate-50/50",
                                      )}
                                    >
                                      <TableCell className="font-medium text-gray-700 text-center">
                                        {formatDate(
                                          record.dayNumber,
                                          DATE_FORMATS.SHORT_DATE,
                                        )}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                                          {record.healthyEggs || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold">
                                          {record.rottenEggs || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                                          {record.hatchedEggs || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {record.success ? (
                                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 border border-green-200">
                                            ✓ Hoàn thành
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-200">
                                            ○ Chưa có
                                          </span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="h-12 text-center text-gray-400 italic"
                                  >
                                    Chưa có bản ghi theo dõi ấp trứng
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={cn(
                          "font-medium",
                          getProcessStatus(
                            currentBreedingStatus,
                            BreedingStatus.EGG_BATCH,
                          ) === "Thất bại"
                            ? "text-red-600"
                            : "text-muted-foreground",
                        )}
                      >
                        {getProcessStatus(
                          currentBreedingStatus,
                          BreedingStatus.EGG_BATCH,
                        ) === "Thất bại"
                          ? "Giai đoạn ấp trứng đã thất bại."
                          : "Giai đoạn ấp trứng chưa bắt đầu."}
                      </p>
                    )}
                  </BreedingStageCard>

                  <BreedingStageCard
                    title="Nuôi Cá Bột"
                    date={
                      fryFish?.endDate
                        ? formatDate(fryFish.endDate, DATE_FORMATS.MEDIUM_DATE)
                        : "Chưa có"
                    }
                    status={getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.FRY_FISH,
                    )}
                    isLast={
                      getProcessStatus(
                        currentBreedingStatus,
                        BreedingStatus.CLASSIFICATION,
                      ) === "Sắp tới"
                    }
                  >
                    {getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.FRY_FISH,
                    ) !== "Sắp tới" &&
                    getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.FRY_FISH,
                    ) !== "Thất bại" ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-xs text-purple-600 font-medium">
                            Tổng số cá bột ban đầu
                          </p>
                          <p className="text-2xl font-bold text-purple-700 mt-1">
                            {fryFish?.initialCount || 0}
                          </p>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Theo dõi Tỷ lệ sống sót cá bột
                          </h4>
                        </div>

                        <div className="overflow-x-auto border rounded-xl border-gray-200 shadow-sm">
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[20%] text-center">
                                  Ngày ghi nhận
                                </TableHead>
                                <TableHead className="w-[20%] text-center">
                                  Tỷ lệ Sống sót
                                </TableHead>
                                <TableHead className="w-[20%] text-center">
                                  Số lượng sống
                                </TableHead>
                                <TableHead className="w-[40%] text-center">
                                  Ghi chú
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {frySurvivalRecords.length > 0 ? (
                                frySurvivalRecords.map(
                                  (record: FrySurvivalRecordResponse, idx) => (
                                    <TableRow
                                      key={record.id}
                                      className={cn(
                                        "hover:bg-purple-50 transition-colors",
                                        idx % 2 === 0
                                          ? "bg-white"
                                          : "bg-slate-50/50",
                                      )}
                                    >
                                      <TableCell className="font-medium text-gray-700 text-center">
                                        {formatDate(
                                          record.createdAt,
                                          DATE_FORMATS.SHORT_DATE,
                                        )}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded text-sm font-bold">
                                          {record.survivalRate?.toFixed(1) || 0}
                                          %
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                                          {record.countAlive || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-600 text-center">
                                        {record.note || (
                                          <span className="text-gray-400">
                                            -
                                          </span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    className="h-12 text-center text-gray-400 italic"
                                  >
                                    Chưa có bản ghi theo dõi sống sót
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={cn(
                          "font-medium",
                          getProcessStatus(
                            currentBreedingStatus,
                            BreedingStatus.FRY_FISH,
                          ) === "Thất bại"
                            ? "text-red-600"
                            : "text-muted-foreground",
                        )}
                      >
                        {getProcessStatus(
                          currentBreedingStatus,
                          BreedingStatus.FRY_FISH,
                        ) === "Thất bại"
                          ? "Giai đoạn nuôi cá bột đã thất bại."
                          : "Giai đoạn nuôi cá bột chưa bắt đầu."}
                      </p>
                    )}
                  </BreedingStageCard>

                  <BreedingStageCard
                    title="Tuyển chọn"
                    date={
                      classificationStage?.endDate
                        ? formatDate(
                            classificationStage.endDate,
                            DATE_FORMATS.MEDIUM_DATE,
                          )
                        : "Chưa có"
                    }
                    status={getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.CLASSIFICATION,
                    )}
                    isLast={
                      getProcessStatus(
                        currentBreedingStatus,
                        BreedingStatus.COMPLETE,
                      ) === "Sắp tới"
                    }
                  >
                    {getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.CLASSIFICATION,
                    ) !== "Sắp tới" &&
                    getProcessStatus(
                      currentBreedingStatus,
                      BreedingStatus.CLASSIFICATION,
                    ) !== "Thất bại" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-3">
                            <p className="text-xs text-indigo-600 font-medium">
                              Số đợt tuyển
                            </p>
                            <p className="text-2xl font-bold text-indigo-700 mt-1">
                              {classificationRecords?.length || 0}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs text-green-600 font-medium">
                              Giữ lại
                            </p>
                            <p className="text-2xl font-bold text-green-700 mt-1">
                              {totalKept}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs text-red-600 font-medium">
                              Loại bỏ
                            </p>
                            <p className="text-2xl font-bold text-red-700 mt-1">
                              {totalCulled}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            Kết quả chi tiết qua các đợt tuyển
                          </h4>
                        </div>

                        <div className="overflow-x-auto border rounded-xl border-gray-200 shadow-sm">
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[15%] text-center">
                                  Đợt Tuyển
                                </TableHead>
                                <TableHead className="w-[15%] text-center">
                                  Show
                                </TableHead>
                                <TableHead className="w-[15%] text-center">
                                  High
                                </TableHead>
                                <TableHead className="w-[15%] text-center">
                                  Pond
                                </TableHead>
                                <TableHead className="w-[15%] text-center">
                                  Culled
                                </TableHead>
                                <TableHead className="w-[25%] text-center">
                                  Ghi chú
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {classificationRecords.length > 0 ? (
                                classificationRecords.map(
                                  (
                                    record: ClassificationRecordResponse,
                                    idx,
                                  ) => (
                                    <TableRow
                                      key={record.id}
                                      className={cn(
                                        "hover:bg-indigo-50 transition-colors",
                                        idx % 2 === 0
                                          ? "bg-white"
                                          : "bg-slate-50/50",
                                      )}
                                    >
                                      <TableCell className="font-medium text-gray-700 text-center">
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-semibold">
                                          Đợt {record.stageNumber}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                                          {record.highQualifiedCount || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                                          {record.showQualifiedCount || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm font-semibold">
                                          {record.pondQualifiedCount || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold">
                                          {record.cullQualifiedCount || 0}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-600 text-center">
                                        {record.notes || (
                                          <span className="text-gray-400">
                                            -
                                          </span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={6}
                                    className="h-12 text-center text-gray-400 italic"
                                  >
                                    Chưa có bản ghi phân loại nào được tạo
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={cn(
                          "font-medium",
                          getProcessStatus(
                            currentBreedingStatus,
                            BreedingStatus.CLASSIFICATION,
                          ) === "Thất bại"
                            ? "text-red-600"
                            : "text-muted-foreground",
                        )}
                      >
                        {getProcessStatus(
                          currentBreedingStatus,
                          BreedingStatus.CLASSIFICATION,
                        ) === "Thất bại"
                          ? "Giai đoạn tuyển chọn đã thất bại/bị bỏ qua."
                          : "Giai đoạn tuyển chọn chưa bắt đầu."}
                      </p>
                    )}
                  </BreedingStageCard>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
