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
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin } from "lucide-react"; // Thêm MapPin
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetPonds } from "@/hooks/usePond";

import {
  PondResponse,
  PondSearchParams,
  PondStatus,
} from "@/lib/api/services/fetchPond";
import { useAddBreedingProcess } from "@/hooks/useBreedingProcess";
import { getPondStatusLabel } from "@/lib/utils/enum";

const PAGE_SIZE = 3;

interface PondSelectionListProps {
  selectedPondId: string | null;
  onSelectPond: (pondId: string, pondName: string) => void;
}

function PondSelectionList({
  selectedPondId,
  onSelectPond,
}: PondSelectionListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const request: PondSearchParams = {
    pageIndex: currentPage,
    pageSize: PAGE_SIZE,
    status: PondStatus.EMPTY,
  };

  const { data: pondsData, isFetching } = useGetPonds(request);
  const ponds = pondsData?.data || [];
  const totalPages = pondsData
    ? Math.ceil(pondsData.totalItems / PAGE_SIZE)
    : 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {isFetching && ponds.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Đang tải dữ liệu...
          </div>
        ) : ponds.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">
            Không tìm thấy hồ nào.
          </div>
        ) : (
          ponds.map((pond: PondResponse) => {
            const isSelected = selectedPondId === pond.id.toString();
            const status = getPondStatusLabel(pond.pondStatus);

            return (
              <div
                key={pond.id}
                className={`flex justify-between items-start p-3 rounded-lg border cursor-pointer transition-colors ${isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-200 hover:bg-gray-50"
                  }`}
                onClick={() => onSelectPond(pond.id.toString(), pond.pondName)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800 truncate">
                      {pond.pondName}
                    </p>
                    <span className={status.colorClass}>{status.label}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Loại: {pond.pondTypeName} | Kích thước: {pond.lengthMeters}m
                    x {pond.widthMeters}m
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 border-t mt-4">
          <p className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isFetching}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={
                currentPage === totalPages || isFetching || totalPages === 0
              }
            >
              Tiếp <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
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
    } catch { }
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn hồ sinh sản</DialogTitle>
          </DialogHeader>

          <PondSelectionList
            selectedPondId={selectedPond}
            onSelectPond={handleSelectPond}
          />

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPondModal(false)}>
              Hủy
            </Button>
            <Button
              disabled={!selectedPond}
              onClick={handleConfirmPondSelection}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
