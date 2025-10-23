"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X, Ruler, Calendar, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Gender, KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import toast from "react-hot-toast";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import getFishSizeLabel from "@/lib/utils/enum";

interface FishSelectionProps {
  onSelection: (
    fatherFish: KoiFishResponse,
    motherFish: KoiFishResponse,
  ) => void;
}

export function FishSelectionSection({ onSelection }: FishSelectionProps) {
  const [selectedFatherId, setSelectedFatherId] = useState<number | null>(null);
  const [selectedMotherId, setSelectedMotherId] = useState<number | null>(null);

  // State cho tab "Theo tiêu chí"
  const [breedingTarget, setBreedingTarget] = useState("");
  const [desiredQuantity, setDesiredQuantity] = useState("");
  const [maleCompatibilityRate, setMaleCompatibilityRate] = useState("");
  const [femaleCompatibilityRate, setFemaleCompatibilityRate] = useState("");
  const [breedingPurpose, setBreedingPurpose] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  // Pagination
  const [pageIndexMale, setPageIndexMale] = useState(1);
  const [pageIndexFemale, setPageIndexFemale] = useState(1);
  const pageSize = 6;

  const {
    data: fatherKoiResponse,
    isError: isGetMaleKoisErr,
    refetch: refetchMale,
  } = useGetKoiFishes({
    pageIndex: pageIndexMale,
    pageSize,
    gender: Gender.MALE,
  });
  const {
    data: motherKoiResponse,
    isError: isGetFemaleKoisErr,
    refetch: refetchFemale,
  } = useGetKoiFishes({
    pageIndex: pageIndexFemale,
    pageSize,
    gender: Gender.FEMALE,
  });

  useEffect(() => {
    refetchMale();
  }, [pageIndexMale, refetchMale]);
  useEffect(() => {
    refetchFemale();
  }, [pageIndexFemale, refetchFemale]);

  if (isGetMaleKoisErr) toast.error("Lỗi tải danh sách cá bố");
  if (isGetFemaleKoisErr) toast.error("Lỗi tải danh sách cá mẹ");

  const selectedFather = fatherKoiResponse?.data.find(
    (f) => f.id === selectedFatherId,
  );
  const selectedMother = motherKoiResponse?.data.find(
    (f) => f.id === selectedMotherId,
  );

  const compatibilityScore = 100;
  const handleContinue = () => {
    if (selectedFather && selectedMother)
      onSelection(selectedFather, selectedMother);
  };

  const [isFatherDialogOpen, setIsFatherDialogOpen] = useState(false);
  const [isMotherDialogOpen, setIsMotherDialogOpen] = useState(false);

  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const value = target.value;
    const numericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    if (value !== numericValue) {
      target.value = numericValue;
    }
  };

  const handleUnchooseFish = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "father" | "mother",
  ) => {
    e.preventDefault();
    if (type === "father") setSelectedFatherId(null);
    else setSelectedMotherId(null);
  };

  const CircularSelector = ({
    type,
    selected,
    onSelect,
    availableKoi,
    isOpen,
    setIsOpen,
    pageIndex,
    setPageIndex,
  }: {
    type: "father" | "mother";
    selected: KoiFishResponse | null;
    onSelect: (koi: KoiFishResponse) => void;
    availableKoi: KoiFishResponse[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    pageIndex: number;
    setPageIndex: (index: number) => void;
  }) => {
    return (
      <div className="flex flex-col items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              {selected ? (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={selected.images[0]}
                      alt={selected.rfid}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleUnchooseFish(e, type)
                    }
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center group-hover:scale-105 transition-all duration-300 ${
                    type === "father"
                      ? "border-blue-300 bg-blue-50 hover:bg-blue-100"
                      : "border-pink-300 bg-pink-50 hover:bg-pink-100"
                  }`}
                >
                  <Plus
                    className={`h-12 w-12 ${type === "father" ? "text-blue-400" : "text-pink-400"}`}
                  />
                </div>
              )}
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-7xl sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Chọn Cá {type === "father" ? "Bố" : "Mẹ"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {availableKoi.map((fish) => (
                <Card
                  key={fish.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 pt-0 pb-2 gap-3"
                  onClick={() => {
                    onSelect(fish);
                    setIsOpen(false);
                  }}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={fish.images[0]}
                      alt={fish.rfid}
                      width={300}
                      height={240}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={type === "father" ? "default" : "secondary"}
                        className={
                          type === "father" ? "bg-blue-500" : "bg-pink-500"
                        }
                      >
                        {fish.gender}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="px-4 space-y-3">
                    <h3 className="font-bold text-base mb-1 text-gray-900">
                      {fish.rfid}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      {fish.variety.varietyName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">
                          {getFishSizeLabel(fish.size)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">
                          {formatDate(fish.birthDate, DATE_FORMATS.MEDIUM_DATE)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => setPageIndex(Math.max(pageIndex - 1, 1))}
                disabled={pageIndex === 1}
              >
                {"<"}
              </Button>
              <span className="px-2">{pageIndex}</span>
              <Button
                size="sm"
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={availableKoi.length < pageSize}
              >
                {">"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-4 text-center max-w-[140px]">
          {selected ? (
            <>
              <h3 className="font-semibold text-sm mb-1">{selected.rfid}</h3>
              <p className="text-xs text-muted-foreground">
                {type === "father" ? "Cá Bố" : "Cá Mẹ"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{getFishSizeLabel(selected.size)}</span>
                <span>•</span>
                <span>
                  {formatDate(selected.birthDate, DATE_FORMATS.MEDIUM_DATE)}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chọn cá {type === "father" ? "bố" : "mẹ"}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-white rounded-lg border border-solid border-gray-200 shadow-[0px_1px_2px_#0000000d] p-6 space-y-6">
      <header>
        <h2 className="font-semibold text-gray-900 text-lg">
          Nhập liệu chỉ sinh sản
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Chọn phương thức tạo cặp sinh sản
        </p>
      </header>

      <Tabs defaultValue="select-fish" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select-fish">Chọn cá</TabsTrigger>
          <TabsTrigger value="criteria">Theo tiêu chí</TabsTrigger>
        </TabsList>

        <TabsContent value="select-fish" className="space-y-6 mt-6">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            <CircularSelector
              type="father"
              selected={selectedFather || null}
              onSelect={(koi) => setSelectedFatherId(koi.id)}
              availableKoi={fatherKoiResponse?.data || []}
              isOpen={isFatherDialogOpen}
              setIsOpen={setIsFatherDialogOpen}
              pageIndex={pageIndexMale}
              setPageIndex={setPageIndexMale}
            />
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                  selectedFather && selectedMother
                    ? "bg-gradient-to-r from-pink-500 to-red-500 animate-pulse shadow-lg"
                    : "bg-pink-500"
                }`}
              >
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              {selectedFather && selectedMother && (
                <div className="mt-2 text-center text-xs text-gray-700">
                  Tương hợp: <strong>{compatibilityScore}%</strong>
                </div>
              )}
            </div>
            <CircularSelector
              type="mother"
              selected={selectedMother || null}
              onSelect={(koi) => setSelectedMotherId(koi.id)}
              availableKoi={motherKoiResponse?.data || []}
              isOpen={isMotherDialogOpen}
              setIsOpen={setIsMotherDialogOpen}
              pageIndex={pageIndexFemale}
              setPageIndex={setPageIndexFemale}
            />
          </div>

          {selectedFather && selectedMother && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleContinue}
                className="h-auto px-8 py-3 text-base shadow-md rounded-xl"
              >
                Tiếp tục đánh giá tương hợp
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="breeding-target"
                  className="text-sm font-medium text-gray-700"
                >
                  Giống mong muốn
                </Label>
                <Select
                  value={breedingTarget}
                  onValueChange={setBreedingTarget}
                >
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn giống mong muốn..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kohaku">Kohaku</SelectItem>
                    <SelectItem value="sanke">Sanke</SelectItem>
                    <SelectItem value="showa">Showa</SelectItem>
                    <SelectItem value="tancho">Tancho</SelectItem>
                    <SelectItem value="asagi">Asagi</SelectItem>
                    <SelectItem value="ogon">Ogon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="desired-quantity"
                  className="text-sm font-medium text-gray-700"
                >
                  Số trứng dự kiến
                </Label>
                <Input
                  id="desired-quantity"
                  placeholder="VD: 50000"
                  value={desiredQuantity}
                  onChange={(e) => setDesiredQuantity(e.target.value)}
                  onInput={handleNumericInput}
                  className="mt-1 border border-gray-300 w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="breeding-purpose"
                  className="text-sm font-medium text-gray-700"
                >
                  Mục tiêu sinh sản
                </Label>
                <Select
                  value={breedingPurpose}
                  onValueChange={setBreedingPurpose}
                >
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn mục tiêu sinh sản..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show-quality">
                      Chất lượng triển lâm
                    </SelectItem>
                    <SelectItem value="breeding">Sinh sản</SelectItem>
                    <SelectItem value="commercial">Thương mại</SelectItem>
                    <SelectItem value="hobby">Sở thích</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="male-compatibility"
                  className="text-sm font-medium text-gray-700"
                >
                  Tỷ lệ nở bố mong muốn (%)
                </Label>
                <Input
                  id="male-compatibility"
                  placeholder="VD: 85"
                  value={maleCompatibilityRate}
                  onChange={(e) => setMaleCompatibilityRate(e.target.value)}
                  onInput={handleNumericInput}
                  className="mt-1 border border-gray-300 w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="female-compatibility"
                  className="text-sm font-medium text-gray-700"
                >
                  Tỷ lệ sống số thịu (%)
                </Label>
                <Input
                  id="female-compatibility"
                  placeholder="VD: 90"
                  value={femaleCompatibilityRate}
                  onChange={(e) => setFemaleCompatibilityRate(e.target.value)}
                  onInput={handleNumericInput}
                  className="mt-1 border border-gray-300 w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="additional-requirements"
                  className="text-sm font-medium text-gray-700"
                >
                  Phân loại yêu cầu sau khi sinh sản
                </Label>
                <Select
                  value={additionalRequirements}
                  onValueChange={setAdditionalRequirements}
                >
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn yêu cầu bổ sung..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pattern-quality">
                      Hoa văn độc đáo
                    </SelectItem>
                    <SelectItem value="size-large">Kích thước lớn</SelectItem>
                    <SelectItem value="color-vibrant">
                      Màu sắc rực rỡ
                    </SelectItem>
                    <SelectItem value="body-shape">Dáng thân đẹp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Xem ví dụ
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md md:max-w-4xl">
                <DialogHeader>
                  <div className="text-center">
                    <DialogTitle>Ví dụ: Nhập tiêu chí sinh sản</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Mẫu hướng dẫn điền các tiêu chí để hệ thống đề xuất cặp
                      phù hợp
                    </p>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Thông tin tổng quan
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      <li>
                        <span className="font-medium text-gray-600">
                          Giống mong muốn:
                        </span>{" "}
                        Ai Goromo (lưới đỏ trên nền xanh)
                      </li>
                      <li>
                        <span className="font-medium text-gray-600">
                          Số trứng dự kiến:
                        </span>{" "}
                        50,000
                      </li>
                      <li>
                        <span className="font-medium text-gray-600">
                          Tỷ lệ nở tối thiểu:
                        </span>{" "}
                        85%
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-4 bg-white">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Yêu cầu chất lượng
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      <li>
                        <span className="font-medium text-gray-600">
                          Tỷ lệ sống tối thiểu:
                        </span>{" "}
                        90%
                      </li>
                      <li>
                        <span className="font-medium text-gray-600">
                          Mục tiêu sinh sản:
                        </span>{" "}
                        Chất lượng triển lãm
                      </li>
                      <li>
                        <span className="font-medium text-gray-600">
                          Phân loại yêu cầu:
                        </span>{" "}
                        Hoa văn độc đáo
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <DialogTrigger asChild>
                    <Button variant="outline" className="px-4 py-2">
                      Đóng
                    </Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="px-8 py-2">Kiểm tra cặp cá phù hợp</Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
