import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import {
  HealthStatus,
  KoiFishSearchParams,
} from "@/lib/api/services/fetchKoiFish";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PaginationWithLinks } from "@/components/pagination";
import { getHealthStatusLabel } from "@/lib/utils/enum/formatEnum";

interface KoiFishSelectionDialogForIncidentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (koiFishId: number, koiFishName: string) => void;
  initialSelectedId?: number;
}

const PAGE_SIZE = 10;

const KoiFishSelectionDialogForIncident = ({
  isOpen,
  onOpenChange,
  onSelect,
}: KoiFishSelectionDialogForIncidentProps) => {
  const [koiFishSearchTerm, setKoiFishSearchTerm] = useState("");
  const [koiFishSearchParams, setKoiFishSearchParams] =
    useState<KoiFishSearchParams>({
      pageIndex: 1,
      pageSize: PAGE_SIZE,
      Search: "",
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      setKoiFishSearchParams((prev) => ({
        ...prev,
        search: koiFishSearchTerm,
        pageIndex: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [koiFishSearchTerm]);

  const { data: koiFishesData, isLoading: isTableLoading } =
    useGetKoiFishes(koiFishSearchParams);
  const koiFishes = koiFishesData?.data || [];
  const totalItems = koiFishesData?.totalItems || 0;

  const handlePageChange = (page: number) =>
    setKoiFishSearchParams((prev) => ({ ...prev, pageIndex: page }));

  const handleSelectFish = (koiFishId: number) => {
    const selectedKoiFish = koiFishes.find((k) => k.id === koiFishId);
    if (selectedKoiFish) {
      onSelect(
        koiFishId,
        selectedKoiFish.description || `Cá Koi #${selectedKoiFish.id}`,
      );
      onOpenChange(false);
    }
  };

  const getHealthStatusColor = (status: HealthStatus) => {
    const healthLabel = getHealthStatusLabel(status);
    return healthLabel.colorClass.split(" ")[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn Cá Koi</DialogTitle>
          <DialogDescription>Chọn cá koi để lọc sự cố</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm cá koi theo tên hoặc RFID..."
            value={koiFishSearchTerm}
            onChange={(e) => setKoiFishSearchTerm(e.target.value)}
            className="w-full"
          />

          {isTableLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Đang tải danh sách cá koi...
            </div>
          ) : koiFishes.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <p>Không tìm thấy cá koi nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {koiFishes.map((koiFish) => {
                  const imageUrl =
                    koiFish.images && koiFish.images.length > 0
                      ? koiFish.images[0]
                      : null;

                  return (
                    <button
                      key={koiFish.id}
                      onClick={() => handleSelectFish(koiFish.id)}
                      className="group flex flex-col h-full rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 active:scale-95"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={koiFish.description || `Cá Koi #${koiFish.id}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs text-center px-2">
                              Chưa có ảnh
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info Container */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div className="min-h-0">
                          <p className="text-sm font-bold text-gray-900 truncate leading-snug mb-2">
                            {koiFish.description || `Cá Koi #${koiFish.id}`}
                          </p>

                          <div className="space-y-1.5">
                            {koiFish.variety?.varietyName && (
                              <div className="flex items-start gap-1">
                                <span className="text-xs font-semibold text-gray-500 min-w-fit">
                                  Giống:
                                </span>
                                <span className="text-xs text-gray-700 truncate">
                                  {koiFish.variety.varietyName}
                                </span>
                              </div>
                            )}

                            {koiFish.rfid && (
                              <div className="flex items-start gap-1">
                                <span className="text-xs font-semibold text-gray-500 min-w-fit">
                                  RFID:
                                </span>
                                <span className="text-xs text-gray-600 truncate font-mono">
                                  {koiFish.rfid}
                                </span>
                              </div>
                            )}

                            {koiFish.healthStatus && (
                              <div className="flex items-center gap-1 mt-2">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full ${getHealthStatusColor(koiFish.healthStatus)}`}
                                ></span>
                                <span
                                  className={`text-xs ${getHealthStatusLabel(koiFish.healthStatus).colorClass}`}
                                >
                                  {
                                    getHealthStatusLabel(koiFish.healthStatus)
                                      .label
                                  }
                                </span>
                              </div>
                            )}

                            {koiFish.size && (
                              <div className="flex items-start gap-1">
                                <span className="text-xs font-semibold text-gray-500 min-w-fit">
                                  Kích:
                                </span>
                                <span className="text-xs text-gray-700">
                                  {koiFish.size}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <PaginationWithLinks
                    totalCount={totalItems}
                    pageSize={koiFishSearchParams.pageSize}
                    page={koiFishSearchParams.pageIndex}
                    onPageChange={handlePageChange}
                    // onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KoiFishSelectionDialogForIncident;
