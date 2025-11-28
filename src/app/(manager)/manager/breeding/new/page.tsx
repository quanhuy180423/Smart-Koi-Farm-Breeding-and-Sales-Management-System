"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";
import { FishSelectionSection } from "./FishSelectionSection";
import FatherFishInfo from "./FatherFishInfo";
import MotherFishInfo from "./MotherFishInfo";
import ComparisonSection from "./ComparisonSection";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetPonds } from "@/hooks/usePond";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE_OPTIONS_DEFAULT } from "@/components/common/PaginationSection";
import { PaginationWithLinks } from "@/components/pagination";

import {
  PondResponse,
  PondSearchParams,
  PondStatus,
  PondTypeEnum,
} from "@/lib/api/services/fetchPond";
import { useAddBreedingProcess } from "@/hooks/useBreedingProcess";
import { getPondStatusLabel } from "@/lib/utils/enum";

interface PondSelectionListProps {
  selectedPondId: string | null;
  onSelectPond: (pondId: string, pondName: string) => void;
}

function PondSelectionList({
  selectedPondId,
  onSelectPond,
}: PondSelectionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pondSearchParams, setPondSearchParams] = useState<PondSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    status: PondStatus.EMPTY,
    pondTypeEnum: PondTypeEnum.PARING,
    search: "",
  });

  const { data: pondsData, isFetching } = useGetPonds(pondSearchParams);
  const ponds = pondsData?.data || [];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Tìm kiếm hồ theo tên..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPondSearchParams((prev) => ({
            ...prev,
            search: e.target.value,
            pageIndex: 1,
          }));
        }}
        className="w-full"
      />

      {isFetching && ponds.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%]">#</TableHead>
                <TableHead className="w-[30%]">Tên Hồ</TableHead>
                <TableHead className="w-[30%]">Vị trí</TableHead>
                <TableHead className="w-[25%]">Loại Hồ</TableHead>
                <TableHead className="w-[10%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ponds.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-4"
                  >
                    Không tìm thấy hồ nào.
                  </TableCell>
                </TableRow>
              ) : (
                ponds.map((pond: PondResponse) => {
                  const isSelected = selectedPondId === pond.id.toString();
                  const status = getPondStatusLabel(pond.pondStatus);

                  return (
                    <TableRow
                      key={pond.id}
                      onClick={() =>
                        onSelectPond(pond.id.toString(), pond.pondName)
                      }
                      className={
                        isSelected
                          ? "bg-green-50/50 cursor-pointer"
                          : "hover:bg-gray-50 cursor-pointer"
                      }
                    >
                      <TableCell>
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() =>
                            onSelectPond(pond.id.toString(), pond.pondName)
                          }
                          className="text-blue-600 focus:ring-blue-500"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {pond.pondName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {pond.location}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {pond.pondTypeName || "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${status.colorClass}`}
                        >
                          {status.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {pondsData && pondsData.totalItems > 0 && (
            <PaginationWithLinks
              totalCount={pondsData.totalItems}
              pageSize={pondSearchParams.pageSize}
              page={pondSearchParams.pageIndex}
              onPageChange={(page) =>
                setPondSearchParams((prev) => ({
                  ...prev,
                  pageIndex: page,
                }))
              }
              onPageSizeChange={(size) =>
                setPondSearchParams((prev) => ({
                  ...prev,
                  pageSize: size,
                  pageIndex: 1,
                }))
              }
            />
          )}
        </>
      )}
    </div>
  );
}

export default function Main() {
  const router = useRouter();

  const [selectedFatherFish, setSelectedFatherFish] =
    useState<KoiFishResponse | null>(null);
  const [selectedMotherFish, setSelectedMotherFish] =
    useState<KoiFishResponse | null>(null);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  const [showPondModal, setShowPondModal] = useState(false);
  const [selectedPond, setSelectedPond] = useState<string | null>(null);
  const [selectedPondName, setSelectedPondName] = useState<string | null>(null);

  const { mutateAsync: addBreedingProcessAsync, isPending } =
    useAddBreedingProcess();

  const handleSelectPond = (pondId: string, pondName: string) => {
    setSelectedPond(pondId);
    setSelectedPondName(pondName);
  };

  const handleFishSelection = (
    fatherFish: KoiFishResponse,
    motherFish: KoiFishResponse,
  ) => {
    setSelectedFatherFish(fatherFish);
    setSelectedMotherFish(motherFish);
    setShowDetailedInfo(true);
  };

  const handleCancel = () => {
    setSelectedFatherFish(null);
    setSelectedMotherFish(null);
    setShowDetailedInfo(false);
    setSelectedPond(null);
    setSelectedPondName(null);
  };

  const handleCreateBreeding = async () => {
    if (!selectedPond || !selectedFatherFish || !selectedMotherFish) {
      return;
    }

    try {
      await addBreedingProcessAsync({
        femaleKoiId: selectedMotherFish.id,
        maleKoiId: selectedFatherFish.id,
        pondId: Number(selectedPond),
      });
      router.push("/manager/breeding");
    } catch {}
  };

  const handleConfirmPondSelection = () => {
    setShowPondModal(false);
  };

  const selectedPondDisplay = selectedPondName
    ? `Hồ đã chọn: ${selectedPondName}`
    : "Chưa chọn hồ";

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between p-8 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-gray-100"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>

          <div className="flex flex-col">
            <h1 className="font-bold text-gray-900 text-2xl">
              Thêm cặp sinh sản mới
            </h1>
            <p className="text-gray-600 text-base">
              {showDetailedInfo
                ? "Chi tiết thông tin cặp sinh sản - Bạn có thể chọn lại cặp khác nếu cần"
                : "Tạo một cặp sinh sản mới với tiêu chí đánh giá thương mại"}
            </p>
          </div>
        </div>
      </header>

      <main className="px-8 pb-8">
        <div className="w-full space-y-4">
          {!showDetailedInfo ? (
            <FishSelectionSection onSelection={handleFishSelection} />
          ) : (
            <div className="space-y-8">
              {selectedFatherFish && (
                <FatherFishInfo selectedFish={selectedFatherFish} />
              )}
              {selectedMotherFish && (
                <MotherFishInfo selectedFish={selectedMotherFish} />
              )}
              {selectedFatherFish && selectedMotherFish && (
                <ComparisonSection
                  fatherFish={selectedFatherFish}
                  motherFish={selectedMotherFish}
                />
              )}

              <div className="p-6 border rounded-lg bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p
                    className={`font-semibold ${selectedPond ? "text-gray-800" : "text-gray-500"}`}
                  >
                    {selectedPondDisplay}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowPondModal(true)}
                >
                  {selectedPond ? "Thay đổi hồ" : "Chọn hồ sinh sản"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {showDetailedInfo && (
          <div className="flex justify-end gap-4 mt-12">
            <Button variant="outline" onClick={handleCancel}>
              Chọn lại
            </Button>
            <Button
              onClick={handleCreateBreeding}
              disabled={
                !selectedFatherFish ||
                !selectedMotherFish ||
                !selectedPond ||
                isPending
              }
              className="w-48"
            >
              {isPending ? "Đang tạo..." : "Tạo cặp sinh sản"}
            </Button>
          </div>
        )}
      </main>

      <Dialog open={showPondModal} onOpenChange={setShowPondModal}>
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn Hồ Sinh Sản</DialogTitle>
            <DialogDescription>
              Chọn hồ trống để làm hồ sinh sản cho cặp cá Koi
            </DialogDescription>
          </DialogHeader>

          <PondSelectionList
            selectedPondId={selectedPond}
            onSelectPond={handleSelectPond}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPondModal(false)}>
              Hủy
            </Button>
            <Button
              disabled={!selectedPond}
              onClick={handleConfirmPondSelection}
            >
              Chọn Hồ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
