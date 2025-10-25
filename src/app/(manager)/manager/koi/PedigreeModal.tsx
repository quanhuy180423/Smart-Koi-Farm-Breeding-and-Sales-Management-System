import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetKoiFishFamily } from "@/hooks/useKoiFish";
import {
  Gender,
  KoiFishFamilyResponse,
  KoiFishResponse,
} from "@/lib/api/services/fetchKoiFish";
import { getGenderString } from "@/lib/utils/enum";

interface PedigreeNodeProps {
  koi?: KoiFishFamilyResponse | null;
  role: string;
}

const PedigreeNode = ({ koi, role }: PedigreeNodeProps) => {
  if (!koi) return null;

  return (
    <div className="border border-indigo-300 rounded-lg p-2 text-center shadow-lg bg-white min-w-[150px] transform transition-all hover:scale-[1.02] hover:shadow-xl relative z-10">
      <p className="text-[10px] font-medium text-indigo-500">{role}</p>
      <p className="font-bold text-sm truncate text-indigo-800">
        {koi?.rfid?.split(" ")[0] ?? "—"}
      </p>
      <p className="text-xs text-gray-600">{koi?.varietyName ?? "—"}</p>
      <p
        className={`text-xs mt-1 font-bold ${
          koi?.gender === Gender.MALE ? "text-blue-600" : "text-pink-600"
        }`}
      >
        {getGenderString(koi?.gender)}
      </p>
    </div>
  );
};

interface PedigreeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  koi: KoiFishResponse | null;
}

const PedigreeModal = ({ isOpen, onOpenChange, koi }: PedigreeModalProps) => {
  const koiId = koi?.id ?? 0;
  const { data: fish } = useGetKoiFishFamily(koiId);

  if (!koi) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Không có dữ liệu cá</DialogTitle>
            <DialogDescription>
              Vui lòng chọn một cá Koi để xem gia phả.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl w-[95%] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-700">
            Gia phả của Cá {koi.rfid}
          </DialogTitle>
          <DialogDescription>
            Cây gia phả (3 đời) giúp theo dõi nguồn gốc di truyền.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-8 space-y-12 relative">
          {/* Cá hiện tại */}
          <div className="relative flex flex-col items-center">
            <PedigreeNode koi={fish} role="Cá Hiện tại" />
            {(fish?.father || fish?.mother) && (
              <div className="w-0.5 h-6 bg-indigo-500 absolute bottom-[-1.5rem]"></div>
            )}
          </div>

          {/* Bố mẹ */}
          {(fish?.father || fish?.mother) && (
            <div className="relative flex justify-center w-full max-w-3xl">
              {fish?.father && (
                <div className="relative flex flex-col items-center w-1/2">
                  <PedigreeNode koi={fish.father} role="Bố (P1)" />
                  {(fish.father?.father || fish.father?.mother) && (
                    <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>
                  )}
                </div>
              )}

              {fish?.mother && (
                <div className="relative flex flex-col items-center w-1/2">
                  <PedigreeNode koi={fish.mother} role="Mẹ (P1)" />
                  {(fish.mother?.father || fish.mother?.mother) && (
                    <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>
                  )}
                </div>
              )}

              {/* Đường ngang nối từ Cá hiện tại xuống Bố Mẹ */}
              {fish?.father && fish?.mother ? (
                <div className="absolute -top-6 left-1/4 right-1/4 h-0.5 bg-indigo-500"></div>
              ) : fish?.father ? (
                <div className="absolute -top-6 left-1/2 w-0 h-0.5 bg-indigo-500"></div>
              ) : (
                <div className="absolute -top-6 right-1/2 w-0 h-0.5 bg-indigo-500"></div>
              )}

              {/* Đường dọc nối từ đường ngang xuống mỗi node */}
              {fish?.father && (
                <div className="absolute -top-6 left-1/4 w-0.5 h-6 bg-indigo-500"></div>
              )}
              {fish?.mother && (
                <div className="absolute -top-6 right-1/4 w-0.5 h-6 bg-indigo-500"></div>
              )}
            </div>
          )}

          {/* Ông bà */}
          {(fish?.father?.father ||
            fish?.father?.mother ||
            fish?.mother?.father ||
            fish?.mother?.mother) && (
            <div className="relative flex justify-center w-full max-w-6xl">
              {/* Ông bà bên cha */}
              {(fish.father?.father || fish.father?.mother) && (
                <div className="relative flex justify-around w-1/2 px-4">
                  {fish.father?.father && (
                    <PedigreeNode koi={fish.father.father} role="Ông (G1)" />
                  )}
                  {fish.father?.mother && (
                    <PedigreeNode koi={fish.father.mother} role="Bà (G1)" />
                  )}

                  {/* Đường ngang nối 2 ông bà bên cha */}
                  {fish.father?.father && fish.father?.mother && (
                    <div className="absolute top-[-1.5rem] left-1/4 right-1/4 h-0.5 bg-indigo-500"></div>
                  )}

                  {/* Đường dọc xuống ông */}
                  {fish.father?.father && (
                    <div className="absolute top-[-1.5rem] left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                  )}

                  {/* Đường dọc xuống bà */}
                  {fish.father?.mother && (
                    <div className="absolute top-[-1.5rem] right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                  )}
                </div>
              )}

              {/* Ông bà bên mẹ */}
              {(fish.mother?.father || fish.mother?.mother) && (
                <div className="relative flex justify-around w-1/2 px-4">
                  {fish.mother?.father && (
                    <PedigreeNode koi={fish.mother.father} role="Ông (G2)" />
                  )}
                  {fish.mother?.mother && (
                    <PedigreeNode koi={fish.mother.mother} role="Bà (G2)" />
                  )}

                  {/* Đường ngang nối 2 ông bà bên mẹ */}
                  {fish.mother?.father && fish.mother?.mother && (
                    <div className="absolute top-[-1.5rem] left-1/4 right-1/4 h-0.5 bg-indigo-500"></div>
                  )}

                  {/* Đường dọc xuống ông */}
                  {fish.mother?.father && (
                    <div className="absolute top-[-1.5rem] left-1/4 w-0.5 h-6 bg-indigo-500"></div>
                  )}

                  {/* Đường dọc xuống bà */}
                  {fish.mother?.mother && (
                    <div className="absolute top-[-1.5rem] right-1/4 w-0.5 h-6 bg-indigo-500"></div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PedigreeModal;
