"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetKoiFishes, useUpdateKoiFish } from "@/hooks/useKoiFish";
import {
  KoiFishResponse,
  KoiFishSearchParams,
  KoiFishUpdateRequest,
  SaleStatus,
} from "@/lib/api/services/fetchKoiFish";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationWithLinks } from "@/components/pagination";
import { getFishSizeLabel, getGenderLabel } from "@/lib/utils/enum";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { KoiDetailDialog } from "@/components/dialogs/KoiDetailDialog";
import { parseSizeToNumber } from "@/lib/utils/numbers/parseSize";

const PAGE_SIZE_OPTIONS = [6, 12, 18];

interface AddFishDialogProps {
  onClose: () => void;
}

export function AddFishDialog({ onClose }: AddFishDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [searchParams, setSearchParams] = useState<KoiFishSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    SaleStatus: SaleStatus.NOT_FOR_SALE,
  });

  const { data: koiData, isLoading } = useGetKoiFishes(searchParams);
  const { mutate: updateFish, isPending: isUpdating } = useUpdateKoiFish();

  const [updatingFishId, setUpdatingFishId] = useState<number | null>(null);
  const [selectedKoi, setSelectedKoi] = useState<KoiFishResponse | null>(null);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleSelectFish = (koi: KoiFishResponse) => {
    setUpdatingFishId(koi.id);

    // 1. Tạo một object request đầy đủ theo cấu trúc KoiFishUpdateRequest
    const requestBody: KoiFishUpdateRequest = {
      rfid: koi.rfid,
      pondId: koi.pond.id,
      varietyId: koi.variety.id,
      breedingProcessId: koi.breedingProcess?.id ?? undefined,
      size: parseSizeToNumber(koi.size),
      type: koi.type,
      pattern: koi.pattern ?? "",
      birthDate: koi.birthDate ?? "",
      gender: koi.gender,
      healthStatus: koi.healthStatus,
      origin: koi.origin ?? "",
      images: koi.images,
      videos: koi.videos,
      sellingPrice: koi.sellingPrice ?? 0,
      description: koi.description,
      isMutated: koi.isMutated ?? false,
      mutationDescription: koi.mutationDescription ?? "",
      // Field cần update
      saleStatus: SaleStatus.AVAILABLE,
    };

    // 3. Gọi mutation với payload đã được xây dựng đầy đủ
    updateFish(
      {
        id: koi.id,
        request: requestBody,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onSettled: () => {
          setUpdatingFishId(null);
        },
      },
    );
  };

  const fishList = koiData?.data || [];

  return (
    <DialogContent className="!max-w-4xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Thêm cá mới vào danh sách bán</DialogTitle>
        <DialogDescription>
          {`Chọn một con cá từ danh sách dưới đây để chuyển trạng thái thành "Có sẵn".`}
        </DialogDescription>
      </DialogHeader>

      <div className="relative border border-gray-300 rounded-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo RFID, giống..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <div className="flex-1 overflow-auto -mx-6 px-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : fishList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{`Không tìm thấy cá nào.`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fishList.map((koi) => {
              const isThisFishUpdating = updatingFishId === koi.id;
              return (
                <Card
                  key={koi.id}
                  className="cursor-pointer hover:border-primary transition-colors relative py-0"
                  onClick={() => setSelectedKoi(koi)}
                >
                  {isThisFishUpdating && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  <CardContent className="p-3">
                    <div className="relative w-full h-32 rounded-md overflow-hidden mb-2">
                      <Image
                        src={koi.images[0]}
                        alt={koi.rfid}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold truncate">{koi.rfid}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {koi.variety.varietyName}
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                      <span>{getGenderLabel(koi.gender).label}</span>
                      <span>{getFishSizeLabel(koi.size)}</span>
                    </div>
                    <p className="font-bold text-sm text-primary mt-2">
                      {formatCurrency(koi.sellingPrice || 0)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {koiData && koiData.totalItems > 0 && (
        <div className="pt-4 border-t">
          <PaginationWithLinks
            totalCount={koiData.totalItems}
            pageSize={searchParams.pageSize}
            page={searchParams.pageIndex}
            onPageChange={(page) =>
              setSearchParams((p) => ({ ...p, pageIndex: page }))
            }
            onPageSizeChange={(size) =>
              setSearchParams((p) => ({ ...p, pageSize: size, pageIndex: 1 }))
            }
            // pageSizeOptions={[6, 12, 18]}
          />
        </div>
      )}

      {/* Detail Dialog */}
      <KoiDetailDialog
        isOpen={!!selectedKoi}
        onOpenChange={(open) => !open && setSelectedKoi(null)}
        koi={selectedKoi}
        showPricingInfo={false}
        onSelectFish={(koi) => {
          setSelectedKoi(null);
          setUpdatingFishId(koi.id);
          handleSelectFish(koi);
        }}
        onSelectLabel="Thêm vào danh sách bán"
        isSelectLoading={updatingFishId === selectedKoi?.id && isUpdating}
      />
    </DialogContent>
  );
}
