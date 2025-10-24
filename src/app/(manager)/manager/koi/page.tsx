"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, Loader2, Filter, Network } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FishSize,
  Gender,
  HealthStatus,
  KoiFishResponse,
  KoiFishSearchParams,
} from "@/lib/api/services/fetchKoiFish";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import formatCurrency from "@/lib/utils/numbers";
import {
  PAGE_SIZE_OPTIONS_DEFAULT,
  PaginationSection,
} from "@/components/common/PaginationSection";
import getAge from "@/lib/utils/dates/age";
import getFishSizeLabel, { getHealthStatusLabel } from "@/lib/utils/enum";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";

export interface Pedigree {
  id: string;
  rfid: string;
  varietyName: string;
  gender: Gender;
  father?: Pedigree;
  mother?: Pedigree;
}

export interface Pedigree {
  id: string;
  rfid: string;
  varietyName: string;
  gender: Gender;
  father?: Pedigree;
  mother?: Pedigree;
}

const MOCK_PEDIGREE_DATA: Pedigree = {
  id: "k1",
  rfid: "RFID-101 (Con)",
  varietyName: "Kohaku",
  gender: Gender.MALE,
  father: {
    id: "f1",
    rfid: "F-001 (Bố)",
    varietyName: "Kohaku",
    gender: Gender.MALE,
    father: {
      id: "gf1",
      rfid: "GF-001 (Ông)",
      varietyName: "Kohaku",
      gender: Gender.MALE,
    },
    mother: {
      id: "gm1",
      rfid: "GM-001 (Bà)",
      varietyName: "Sanke",
      gender: Gender.FEMALE,
    },
  },
  mother: {
    id: "m1",
    rfid: "M-001 (Mẹ)",
    varietyName: "Kohaku",
    gender: Gender.FEMALE,
    father: {
      id: "gf2",
      rfid: "GF-002 (Ông)",
      varietyName: "Showa",
      gender: Gender.MALE,
    },
    mother: {
      id: "gm2",
      rfid: "GM-002 (Bà)",
      varietyName: "Kohaku",
      gender: Gender.FEMALE,
    },
  },
};

// --- COMPONENT HIỂN THỊ GIA PHẢ (CẬP NHẬT GIAO DIỆN) ---
const PedigreeNode: React.FC<{ koi: Pedigree; role: string }> = ({
  koi,
  role,
}) => (
  <div className="border border-indigo-300 rounded-lg p-2 text-center shadow-lg bg-white min-w-[150px] transform transition-all hover:scale-[1.02] hover:shadow-xl relative z-10">
    <p className="text-[10px] font-medium text-indigo-500">{role}</p>
    <p className="font-bold text-sm truncate text-indigo-800">
      {koi.rfid.split(" ")[0]}
    </p>
    <p className="text-xs text-gray-600">{koi.varietyName}</p>
    <p
      className={`text-xs mt-1 font-bold ${koi.gender === Gender.MALE ? "text-blue-600" : "text-pink-600"}`}
    >
      {koi.gender === Gender.MALE ? "Đực" : "Cái"}
    </p>
  </div>
);

const PedigreeModal: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  koi: KoiFishResponse | null;
}> = ({ isOpen, onOpenChange, koi }) => {
  if (!koi) return null;
  const pedigreeData = MOCK_PEDIGREE_DATA;

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
          <div className="relative">
            <PedigreeNode
              koi={{ ...pedigreeData, rfid: koi.rfid }}
              role="Cá Hiện tại"
            />

            <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500 z-0"></div>
          </div>

          {(pedigreeData.father || pedigreeData.mother) && (
            <div className="flex justify-center w-full relative">
              <div className="absolute top-0 w-1/2 h-0.5 bg-indigo-500"></div>

              <div className="flex justify-around w-full max-w-lg relative z-10">
                {pedigreeData.father && (
                  <div className="flex flex-col items-center relative w-1/2 pt-8">
                    <div className="w-0.5 h-8 bg-indigo-500 absolute top-0"></div>{" "}
                    {/* Vertical line from horizontal connector */}
                    <PedigreeNode koi={pedigreeData.father} role="Bố (P1)" />
                    {(pedigreeData.father.father ||
                      pedigreeData.father.mother) && (
                      <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500 z-0"></div>
                    )}
                  </div>
                )}
                {pedigreeData.mother && (
                  <div className="flex flex-col items-center relative w-1/2 pt-8">
                    <div className="w-0.5 h-8 bg-indigo-500 absolute top-0"></div>{" "}
                    {/* Vertical line from horizontal connector */}
                    <PedigreeNode koi={pedigreeData.mother} role="Mẹ (P1)" />
                    {(pedigreeData.mother.father ||
                      pedigreeData.mother.mother) && (
                      <div className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500 z-0"></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center w-full relative pt-12">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[90%] h-0.5 bg-indigo-500"></div>

            <div className="flex justify-around w-full max-w-6xl">
              {pedigreeData.father &&
                (pedigreeData.father.father || pedigreeData.father.mother) && (
                  <div className="flex justify-around w-1/2 relative pt-6">
                    <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>
                    <div className="absolute top-0 right-1/4 transform translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>

                    {pedigreeData.father.father && (
                      <PedigreeNode
                        koi={pedigreeData.father.father}
                        role="Ông (G1)"
                      />
                    )}
                    {pedigreeData.father.mother && (
                      <PedigreeNode
                        koi={pedigreeData.father.mother}
                        role="Bà (G1)"
                      />
                    )}
                  </div>
                )}

              {pedigreeData.mother &&
                (pedigreeData.mother.father || pedigreeData.mother.mother) && (
                  <div className="flex justify-around w-1/2 relative pt-6">
                    <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>
                    <div className="absolute top-0 right-1/4 transform translate-x-1/2 w-0.5 h-6 bg-indigo-500"></div>

                    {pedigreeData.mother.father && (
                      <PedigreeNode
                        koi={pedigreeData.mother.father}
                        role="Ông (G2)"
                      />
                    )}
                    {pedigreeData.mother.mother && (
                      <PedigreeNode
                        koi={pedigreeData.mother.mother}
                        role="Bà (G2)"
                      />
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function KoiManagement() {
  const [selectedKoi, setSelectedKoi] = useState<KoiFishResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [healthFilterInput, setHealthFilterInput] = useState<string>("all");
  const [genderFilterInput, setGenderFilterInput] = useState<string>("all");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [varietyIdInput, setVarietyIdInput] = useState<string>("");
  const [pondIdInput, setPondIdInput] = useState<string>("");
  const [fishSizeInput, setFishSizeInput] = useState<string>("all");
  const [originInput, setOriginInput] = useState<string>("");

  const [isPedigreeModalOpen, setIsPedigreeModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useState<KoiFishSearchParams>({
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    health: undefined,
    gender: undefined,
    varietyId: undefined,
    fishSize: undefined,
    pondId: undefined,
    origin: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      pageIndex: 1,
    }));
  }, [debouncedSearchTerm]);

  const { data: koiFishData, isLoading } = useGetKoiFishes(searchParams);
  const dataToDisplay: KoiFishResponse[] = koiFishData?.data || [];
  const totalItems = koiFishData?.totalItems || 0;
  const totalPages = koiFishData?.totalPages || 0;

  const handleViewDetails = (koi: KoiFishResponse) => {
    setSelectedKoi(koi);
    setIsDetailModalOpen(true);
  };

  const handleApplyFilters = () => {
    const health =
      healthFilterInput !== "all"
        ? (healthFilterInput as HealthStatus)
        : undefined;
    const gender =
      genderFilterInput !== "all" ? (genderFilterInput as Gender) : undefined;
    const fishSize =
      fishSizeInput !== "all" ? (fishSizeInput as FishSize) : undefined;
    const minPrice = minPriceInput ? Number(minPriceInput) : undefined;
    const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined;

    const varietyId = varietyIdInput ? Number(varietyIdInput) : undefined;
    const pondId = pondIdInput ? Number(pondIdInput) : undefined;

    setSearchParams((prev) => ({
      ...prev,
      health: health,
      gender: gender,
      fishSize: fishSize,
      minPrice: minPrice,
      maxPrice: maxPrice,
      varietyId: varietyId,
      pondId: pondId,
      origin: originInput || undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setHealthFilterInput("all");
    setGenderFilterInput("all");
    setMinPriceInput("");
    setMaxPriceInput("");
    setVarietyIdInput("");
    setPondIdInput("");
    setFishSizeInput("all");
    setOriginInput("");

    setSearchParams((prev) => ({
      ...prev,
      health: undefined,
      gender: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      varietyId: undefined,
      pondId: undefined,
      fishSize: undefined,
      origin: undefined,
      pageIndex: 1,
    }));

    setIsFilterModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 1,
    }));
  };

  const handleViewPedigree = (koi: KoiFishResponse) => {
    setSelectedKoi(koi);
    setIsPedigreeModalOpen(true);
  };

  const isFilterActive = Object.keys(searchParams).some((key) => {
    const value = searchParams[key as keyof KoiFishSearchParams];
    return (
      key !== "search" &&
      key !== "pageIndex" &&
      key !== "pageSize" &&
      value !== undefined &&
      value !== null &&
      value !== "" &&
      String(value) !== "0"
    );
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý cá Koi</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái của tất cả cá Koi trong trang trại
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách cá Koi</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết của từng con cá Koi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã cá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-400 pl-10"
              />
            </div>

            <Button
              variant={isFilterActive ? "default" : "outline"}
              onClick={() => setIsFilterModalOpen(true)}
              className={
                isFilterActive
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "border-gray-400"
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc{" "}
              {isFilterActive && (
                <span className="ml-1 px-2 py-0.5 bg-white/30 text-white rounded-full text-xs">
                  ON
                </span>
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải dữ liệu...
              {/*  */}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">STT</TableHead>
                    <TableHead className="w-[10%]">RFID</TableHead>
                    <TableHead className="w-[10%]">Giống</TableHead>
                    <TableHead className="w-[5%]">Tuổi</TableHead>
                    <TableHead className="w-[10%]">Kích thước</TableHead>
                    <TableHead className="w-[20%]">Hồ</TableHead>
                    <TableHead className="w-[10%]">Sức khỏe</TableHead>
                    <TableHead className="w-[10%]">Giá bán (VNĐ)</TableHead>
                    <TableHead className="w-[20%]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataToDisplay.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground"
                      >
                        Không tìm thấy dữ liệu cá Koi nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataToDisplay.map((koi, index) => (
                      <TableRow key={koi.id}>
                        <TableCell className="font-medium">
                          {index +
                            1 +
                            (searchParams.pageIndex - 1) *
                              searchParams.pageSize}
                        </TableCell>
                        <TableCell className="font-medium">
                          {koi.rfid}
                        </TableCell>
                        <TableCell>{koi.variety.varietyName}</TableCell>
                        <TableCell>{getAge(koi.birthDate)}</TableCell>
                        <TableCell>{getFishSizeLabel(koi.size)}</TableCell>
                        <TableCell>{koi.pond.pondName}</TableCell>
                        <TableCell>
                          {(() => {
                            const label = getHealthStatusLabel(
                              koi.healthStatus,
                            );
                            return (
                              <Badge
                                className={`font-semibold ${label.colorClass}`}
                              >
                                {label.label}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(koi.sellingPrice || 0)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xem chi tiết"
                              onClick={() => handleViewDetails(koi)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              title="Xem gia phả"
                              onClick={() => handleViewPedigree(koi)}
                            >
                              <Network className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xóa"
                              className="text-red-600 hover:bg-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalItems > 0 && (
                <PaginationSection
                  totalItems={totalItems}
                  postsPerPage={searchParams.pageSize}
                  currentPage={searchParams.pageIndex}
                  setCurrentPage={handlePageChange}
                  totalPages={totalPages}
                  setPageSize={handlePageSizeChange}
                  hasNextPage={koiFishData?.hasNextPage}
                  hasPreviousPage={koiFishData?.hasPreviousPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedKoi && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-xl!">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {selectedKoi.variety.varietyName}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  RFID: {selectedKoi.rfid} • Giống:{" "}
                  {selectedKoi.variety.varietyName}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-muted-foreground">
                    Thuộc tính vật lý
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Tuổi:</span>
                      <span className="font-medium">
                        {getAge(selectedKoi.birthDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kích thước:</span>
                      <span className="font-medium">
                        {getFishSizeLabel(selectedKoi.size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giá trị mô tả cơ thể:</span>
                      <span className="font-medium">
                        {selectedKoi.bodyShape}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giới tính:</span>
                      <span className="font-medium">
                        {selectedKoi.gender === Gender.MALE
                          ? "Đực"
                          : selectedKoi.gender === Gender.FEMALE
                            ? "Cái"
                            : "Không rõ"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-muted-foreground">
                    Vị trí & Nguồn gốc
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Hồ:</span>
                      <span className="font-medium">
                        {selectedKoi.pond.pondName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Xuất xứ:</span>
                      <span className="font-medium">
                        {selectedKoi.variety.originCountry}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tình trạng sức khỏe:</span>
                      {(() => {
                        const label = getHealthStatusLabel(
                          selectedKoi.healthStatus,
                        );
                        return (
                          <Badge
                            className={`font-semibold ${label.colorClass}`}
                          >
                            {label.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="flex justify-between">
                      <span>Nguồn gốc sinh sản:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedKoi.breedingProcess?.processName || "Không rõ"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-muted-foreground mb-2">
                  Mô tả
                </h4>
                <p className="text-sm text-gray-700 italic">
                  {selectedKoi.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Giá bán</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedKoi.sellingPrice || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Ngày cập nhật cuối
                    </p>
                    <p className="font-medium">
                      {formatDate(
                        selectedKoi.updatedAt || selectedKoi.createdAt,
                        DATE_FORMATS.MEDIUM_DATE,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <PedigreeModal
        isOpen={isPedigreeModalOpen}
        onOpenChange={setIsPedigreeModalOpen}
        koi={selectedKoi}
      />

      <Dialog
        open={isFilterModalOpen}
        onOpenChange={(open) => {
          setIsFilterModalOpen(open);
          if (!open) {
            setHealthFilterInput(searchParams.health || "all");
            setGenderFilterInput(searchParams.gender || "all");
            setFishSizeInput(searchParams.fishSize || "all");
            setMinPriceInput(
              searchParams.minPrice !== undefined
                ? String(searchParams.minPrice)
                : "",
            );
            setMaxPriceInput(
              searchParams.maxPrice !== undefined
                ? String(searchParams.maxPrice)
                : "",
            );
            setVarietyIdInput(
              searchParams.varietyId !== undefined
                ? String(searchParams.varietyId)
                : "",
            );
            setPondIdInput(
              searchParams.pondId !== undefined
                ? String(searchParams.pondId)
                : "",
            );
            setOriginInput(searchParams.origin || "");
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc Cá Koi</DialogTitle>
            <DialogDescription>
              Lọc danh sách cá Koi theo tiêu chí.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="healthStatus">Sức khỏe</Label>
                <Select
                  value={healthFilterInput}
                  onValueChange={setHealthFilterInput}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.values(HealthStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {getHealthStatusLabel(s).label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={genderFilterInput}
                  onValueChange={setGenderFilterInput}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value={Gender.MALE}>Đực</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Cái</SelectItem>
                    <SelectItem value={Gender.UNKNOWN}>Không rõ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fishSize">Kích thước</Label>
                <Select value={fishSizeInput} onValueChange={setFishSizeInput}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kích thước" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.values(FishSize).map((s) => (
                      <SelectItem key={s} value={s}>
                        {getFishSizeLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Xuất xứ</Label>
                <Input
                  id="origin"
                  placeholder="Nhập xuất xứ..."
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="varietyId">ID Giống</Label>
                <Input
                  id="varietyId"
                  type="number"
                  placeholder="ID Giống..."
                  value={varietyIdInput}
                  onChange={(e) => setVarietyIdInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pondId">ID Hồ</Label>
                <Input
                  id="pondId"
                  type="number"
                  placeholder="ID Hồ..."
                  value={pondIdInput}
                  onChange={(e) => setPondIdInput(e.target.value)}
                />
              </div>

              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground md:col-span-2"></p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <p className="text-sm font-semibold col-span-full mb-[-8px] text-muted-foreground">
                Lọc theo Giá bán (VNĐ)
              </p>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="minPrice">Giá tối thiểu</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Giá thấp nhất"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="maxPrice">Giá tối đa</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Giá cao nhất"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
