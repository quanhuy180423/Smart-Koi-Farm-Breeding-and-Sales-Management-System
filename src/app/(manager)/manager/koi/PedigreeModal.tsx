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
                className={`text-xs mt-1 font-bold ${koi?.gender === Gender.MALE ? "text-blue-600" : "text-pink-600"
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
    const { data: pedigreeData } = useGetKoiFishFamily(koiId);

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

    const fish = pedigreeData;

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

                <div className="flex flex-col items-center py-8 relative space-y-12">
                    {/* Cá hiện tại */}
                    <div className="relative">
                        <PedigreeNode koi={fish} role="Cá Hiện tại" />
                        {(fish?.father || fish?.mother) && (
                            <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500 z-0"></div>
                        )}
                    </div>

                    {/* Bố mẹ */}
                    {(fish?.father || fish?.mother) && (
                        <div className="flex justify-center w-full relative">
                            <div className="absolute top-0 w-1/2 h-0.5 bg-indigo-500"></div>

                            <div className="flex justify-around w-full max-w-lg relative z-10">
                                {/* Cha */}
                                {fish.father && (
                                    <div className="flex flex-col items-center relative w-1/2 pt-8">
                                        <div className="w-0.5 h-8 bg-indigo-500 absolute top-0"></div>
                                        <PedigreeNode koi={fish.father} role="Bố (P1)" />
                                        {(fish.father.father || fish.father.mother) && (
                                            <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500 z-0"></div>
                                        )}
                                    </div>
                                )}
                                {/* Mẹ */}
                                {fish.mother && (
                                    <div className="flex flex-col items-center relative w-1/2 pt-8">
                                        <div className="w-0.5 h-8 bg-indigo-500 absolute top-0"></div>
                                        <PedigreeNode koi={fish.mother} role="Mẹ (P1)" />
                                        {(fish.mother.father || fish.mother.mother) && (
                                            <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500 z-0"></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ông bà */}
                    <div className="flex justify-center w-full relative pt-12">
                        {(fish?.father?.father || fish?.father?.mother || fish?.mother?.father || fish?.mother?.mother) && (
                            <>
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[90%] h-0.5 bg-indigo-500"></div>
                                <div className="flex justify-around w-full max-w-6xl">
                                    {/* Ông bà bên cha */}
                                    {(fish.father?.father || fish.father?.mother) && (
                                        <div className="flex justify-around w-1/2 relative pt-6">
                                            {fish.father?.father && (
                                                <PedigreeNode koi={fish.father.father} role="Ông (G1)" />
                                            )}
                                            {fish.father?.mother && (
                                                <PedigreeNode koi={fish.father.mother} role="Bà (G1)" />
                                            )}
                                        </div>
                                    )}

                                    {/* Ông bà bên mẹ */}
                                    {(fish.mother?.father || fish.mother?.mother) && (
                                        <div className="flex justify-around w-1/2 relative pt-6">
                                            {fish.mother?.father && (
                                                <PedigreeNode koi={fish.mother.father} role="Ông (G2)" />
                                            )}
                                            {fish.mother?.mother && (
                                                <PedigreeNode koi={fish.mother.mother} role="Bà (G2)" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PedigreeModal;
