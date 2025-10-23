import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PondFormState } from "./page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Plus } from "lucide-react";

interface AddPondModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newPond: PondFormState;
    setNewPond: React.Dispatch<React.SetStateAction<PondFormState>>;
    handleAddPond: () => void;
    isPending: boolean;
    handleOpenAreaSelection: (context: "new" | "edit") => void;
    handleOpenPondTypeSelection: (context: "new" | "edit") => void; // NEW PROP
    getAreaNameById: (id: string | number | undefined) => string;
    getPondTypeNameById: (id: string | number | undefined) => string; // NEW PROP
}

const AddPondModal = ({
    isOpen,
    onOpenChange,
    newPond,
    setNewPond,
    handleAddPond,
    isPending,
    handleOpenAreaSelection,
    handleOpenPondTypeSelection, // USED
    getAreaNameById,
    getPondTypeNameById, // USED
}: AddPondModalProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                    Thêm hồ cá mới
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Tên hồ
                        </Label>
                        <Input
                            id="name"
                            placeholder="Nhập tên hồ..."
                            value={newPond.pondName}
                            onChange={(e) => setNewPond({ ...newPond, pondName: e.target.value })}
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="location"
                            className="text-sm font-medium text-gray-700"
                        >
                            Địa điểm
                        </Label>
                        <Input
                            id="location"
                            placeholder="VD: Khu A, Lô 2"
                            value={newPond.location}
                            onChange={(e) => setNewPond({ ...newPond, location: e.target.value })}
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Chọn Khu vực */}
                    <div className="space-y-2">
                        <Label htmlFor="areaId" className="text-sm font-medium text-gray-700">
                            Khu vực
                        </Label>
                        <Button
                            variant="outline"
                            className="w-full justify-between h-10 border-2 border-gray-300"
                            onClick={() => handleOpenAreaSelection("new")}
                        >
                            <span>{getAreaNameById(newPond.areaId) || "Chọn Khu vực..."}</span>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                        </Button>
                    </div>

                    {/* Chọn Loại Hồ (NEW) */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="pondTypeId"
                            className="text-sm font-medium text-gray-700"
                        >
                            Loại hồ
                        </Label>
                        <Button
                            variant="outline"
                            className="w-full justify-between h-10 border-2 border-gray-300"
                            onClick={() => handleOpenPondTypeSelection("new")}
                        >
                            <span>
                                {getPondTypeNameById(newPond.pondTypeId) || "Chọn Loại Hồ..."}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="length" className="text-sm font-medium text-gray-700">
                            Dài (m)
                        </Label>
                        <Input
                            id="length"
                            placeholder="Dài (m)"
                            type="number"
                            step="0.1"
                            value={newPond.lengthMeters}
                            onChange={(e) =>
                                setNewPond({ ...newPond, lengthMeters: e.target.value })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                            Rộng (m)
                        </Label>
                        <Input
                            id="width"
                            placeholder="Rộng (m)"
                            type="number"
                            step="0.1"
                            value={newPond.widthMeters}
                            onChange={(e) =>
                                setNewPond({ ...newPond, widthMeters: e.target.value })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="depth" className="text-sm font-medium text-gray-700">
                            Sâu (m)
                        </Label>
                        <Input
                            id="depth"
                            placeholder="Độ sâu (m)"
                            type="number"
                            step="0.1"
                            value={newPond.depthMeters}
                            onChange={(e) =>
                                setNewPond({ ...newPond, depthMeters: e.target.value })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="capacity"
                            className="text-sm font-medium text-gray-700"
                        >
                            Sức chứa (Lít)
                        </Label>
                        <Input
                            id="capacity"
                            placeholder="Sức chứa (Lít)"
                            type="number"
                            value={newPond.capacityLiters}
                            onChange={(e) =>
                                setNewPond({ ...newPond, capacityLiters: e.target.value })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500"
                        />
                    </div>
                </div>
                <DialogFooter className="pt-4 border-t mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="px-6"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleAddPond}
                        disabled={isPending || !newPond.areaId || !newPond.pondTypeId}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        Thêm hồ
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
    </Dialog>
);

export default AddPondModal;