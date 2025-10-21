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
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react"; // Thêm MapPin
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetPonds } from "@/hooks/usePond";

import { PondResponse } from "@/lib/api/services/fetchPond";
import { PagingRequest } from "@/lib/api/apiClient";
import { useAddBreedingProcess } from "@/hooks/useBreedingProcess";

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
  const request: PagingRequest = {
    pageIndex: currentPage,
    pageSize: PAGE_SIZE,
  };

  const { data: pondsData, isFetching } = useGetPonds(request);
  const ponds = pondsData?.data || [];
  // Sử dụng totalRecords thay vì totalItems như trong code gốc, giả định PagedResponse dùng totalRecords
  const totalPages = pondsData
    ? Math.ceil(pondsData.totalItems / PAGE_SIZE)
    : 0;
  // Ghi chú: Nếu API của bạn dùng totalItems thì thay totalRecords bằng totalItems

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

  // HÀM HỖ TRỢ HIỂN THỊ TRẠNG THÁI HỒ ĐÃ ĐƯỢC CẬP NHẬT
  const getStatusStyles = (status: string) => {
    // Chuyển đổi trạng thái từ enum (giả định API trả về các giá trị "Empty", "Active", "Maintenance")
    switch (status) {
      case "Active":
        return {
          text: "Đang Hoạt Động",
          className:
            "text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full",
        };
      case "Empty":
        return {
          text: "Trống",
          className:
            "text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full",
        };
      case "Maintenance":
        return {
          text: "Bảo Trì",
          className:
            "text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full",
        };
      default:
        // Dành cho các trạng thái không xác định
        return {
          text: status,
          className:
            "text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {isFetching && ponds.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">
            Đang tải hồ...
          </div>
        ) : ponds.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">
            Không tìm thấy hồ nào.
          </div>
        ) : (
          ponds.map((pond: PondResponse) => {
            const isSelected = selectedPondId === pond.id.toString();
            const status = getStatusStyles(pond.pondStatus); // Lấy style trạng thái

            return (
              <div
                key={pond.id}
                className={`flex justify-between items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
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
                    {/* Hiển thị trạng thái hồ đã được dịch */}
                    <span className={status.className}>{status.text}</span>
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
  const [selectedPondName, setSelectedPondName] = useState<string | null>(null); // Thêm state lưu tên hồ

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
      // Trường hợp này không xảy ra nếu nút được disable đúng
      return;
    }

    // Thêm loading state vào nút bằng cách dùng `isPending`
    try {
      await addBreedingProcessAsync({
        femaleKoiId: selectedMotherFish.id,
        maleKoiId: selectedFatherFish.id,
        pondId: Number(selectedPond),
      });
      router.push("/manager/breeding");
    } catch (error) {
      console.error("Lỗi tạo cặp sinh sản:", error);
      // Có thể thêm toast/thông báo lỗi ở đây
    }
  };

  const handleConfirmPondSelection = () => {
    setShowPondModal(false);
    // Sau khi chọn hồ, người dùng sẽ nhấn nút 'Tạo cặp sinh sản'
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

              {/* KHỐI CHỌN HỒ ĐƯỢC THÊM VÀO ĐÂY */}
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
              {/* KẾT THÚC KHỐI CHỌN HỒ */}
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

      {/* Popup chọn hồ (Đã chuyển thành List phân trang) */}
      <Dialog open={showPondModal} onOpenChange={setShowPondModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn hồ sinh sản</DialogTitle>
          </DialogHeader>

          {/* Component List phân trang */}
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
