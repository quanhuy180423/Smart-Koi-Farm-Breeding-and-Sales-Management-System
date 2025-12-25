"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import FatherFishInfo from "../FatherFishInfo";
import MotherFishInfo from "../MotherFishInfo";
import ComparisonSection from "../ComparisonSection";
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
  PondSearchParams,
  PondStatus,
  PondTypeEnum,
} from "@/lib/api/services/fetchPond";
import { useAddBreedingProcess } from "@/hooks/useBreedingProcess";
import { getPondStatusLabel } from "@/lib/utils/enum";
import { useGetKoiFishById } from "@/hooks/useKoiFish";

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
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    Không tìm thấy hồ nào.
                  </TableCell>
                </TableRow>
              ) : (
                ponds.map((pond, index) => {
                  const isSelected =
                    selectedPondId === String(pond.id) || false;
                  const status = getPondStatusLabel(pond.pondStatus);

                  return (
                    <TableRow
                      key={pond.id}
                      onClick={() =>
                        onSelectPond(String(pond.id), pond.pondName)
                      }
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <TableCell className="font-medium text-gray-700">
                        {(pondSearchParams.pageIndex - 1) *
                          pondSearchParams.pageSize +
                          index +
                          1}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        {pond.pondName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {pond.location || "N/A"}
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

export default function BreedingInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const maleId = searchParams.get("male");
  const femaleId = searchParams.get("female");

  const [showPondModal, setShowPondModal] = useState(false);
  const [selectedPond, setSelectedPond] = useState<string | null>(null);
  const [selectedPondName, setSelectedPondName] = useState<string | null>(null);

  const { data: fatherFish, isLoading: isLoadingFather } = useGetKoiFishById(
    maleId ? Number(maleId) : undefined,
  );
  const { data: motherFish, isLoading: isLoadingMother } = useGetKoiFishById(
    femaleId ? Number(femaleId) : undefined,
  );

  const { mutateAsync: addBreedingProcessAsync, isPending } =
    useAddBreedingProcess();

  useEffect(() => {
    if (!maleId || !femaleId) {
      router.push("/manager/breeding/new");
    }
  }, [maleId, femaleId, router]);

  const handleSelectPond = (pondId: string, pondName: string) => {
    setSelectedPond(pondId);
    setSelectedPondName(pondName);
  };

  const handleCancel = () => {
    router.push("/manager/breeding/new");
  };

  const handleCreateBreeding = async () => {
    if (!selectedPond || !fatherFish || !motherFish) {
      return;
    }

    try {
      await addBreedingProcessAsync({
        femaleKoiId: motherFish.id,
        maleKoiId: fatherFish.id,
        pondId: Number(selectedPond),
      });
      localStorage.removeItem("breeding_criteria_cache");
      router.push("/manager/breeding");
    } catch {}
  };

  const handleConfirmPondSelection = () => {
    setShowPondModal(false);
  };

  const handleBack = () => {
    router.push("/manager/breeding/new");
  };

  const selectedPondDisplay = selectedPondName
    ? `Hồ đã chọn: ${selectedPondName}`
    : "Chưa chọn hồ";

  if (isLoadingFather || isLoadingMother) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (!fatherFish || !motherFish) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between p-8 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
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
              Chi tiết thông tin cặp sinh sản - Bạn có thể chọn lại cặp khác nếu
              cần
            </p>
          </div>
        </div>
      </header>

      <main className="px-8 pb-8">
        <div className="w-full space-y-4">
          <div className="space-y-8">
            <FatherFishInfo selectedFish={fatherFish} />
            <MotherFishInfo selectedFish={motherFish} />
            <ComparisonSection
              fatherFish={fatherFish}
              motherFish={motherFish}
            />

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
        </div>

        <div className="flex justify-end gap-4 mt-12">
          <Button variant="outline" onClick={handleCancel}>
            Chọn lại
          </Button>
          <Button
            onClick={handleCreateBreeding}
            disabled={!fatherFish || !motherFish || !selectedPond || isPending}
            className="w-48"
          >
            {isPending ? "Đang tạo..." : "Tạo cặp sinh sản"}
          </Button>
        </div>
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
