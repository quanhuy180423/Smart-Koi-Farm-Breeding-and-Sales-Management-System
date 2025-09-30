"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface Fish {
  id: number;
  name: string;
  variety: string;
  size: string;
  age: string;
  price: number;
  origin: string;
  breeder: string;
  image: string;
  gender: string;
  bloodline: string;
  certificates: string[];
  compatibility: string[];
}

interface FishSelectionProps {
  onSelection: (fatherFish: Fish, motherFish: Fish) => void;
}

const availableFatherFish: Fish[] = [
  {
    id: 2,
    name: "Sanke Jumbo S-012",
    variety: "Sanke",
    size: "45cm",
    age: "3 năm",
    price: 25000000,
    origin: "Nhật Bản",
    breeder: "Dainichi Koi Farm",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-sanke-koi-fish-with-red-white-black-patt-Yi3gY3TBXBXyG0ma5FJmxrVS1ujTFx.jpg",
    gender: "Đực",
    bloodline: "Dainichi",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe", "Giải thưởng"],
    compatibility: ["Kohaku", "Showa", "Asagi"],
  },
  {
    id: 4,
    name: "Tancho Goshiki T-008",
    variety: "Tancho",
    size: "30cm",
    age: "1.5 năm",
    price: 12000000,
    origin: "Việt Nam",
    breeder: "Koi Farm VN",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-tancho-koi-fish-with-red-circle-on-head-NVCbNPDkURfrY4hyyTab01P0wkoXPB.jpg",
    gender: "Đực",
    bloodline: "Local Breed",
    certificates: ["Kiểm tra sức khỏe"],
    compatibility: ["Kohaku", "Ogon"],
  },
  {
    id: 6,
    name: "Asagi High Quality A-015",
    variety: "Asagi",
    size: "42cm",
    age: "3 năm",
    price: 18000000,
    origin: "Nhật Bản",
    breeder: "Marudo Koi Farm",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-asagi-koi-fish-blue-scales-orange-belly-amok9CoRuLRj6W4Exiwl54aXBzji3w.jpg",
    gender: "Đực",
    bloodline: "Marudo",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe"],
    compatibility: ["Sanke", "Ogon"],
  },
  {
    id: 7,
    name: "Showa Champion S-021",
    variety: "Showa",
    size: "40cm",
    age: "2.5 năm",
    price: 22000000,
    origin: "Nhật Bản",
    breeder: "Omosako Koi Farm",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-showa-koi-fish-black-red-white.jpg",
    gender: "Đực",
    bloodline: "Omosako",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe", "Giải thưởng"],
    compatibility: ["Kohaku", "Sanke"],
  },
];

const availableMotherFish: Fish[] = [
  {
    id: 5,
    name: "Ogon Platinum O-003",
    variety: "Ogon",
    size: "38cm",
    age: "2 năm",
    price: 8000000,
    origin: "Việt Nam",
    breeder: "Koi Farm VN",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-platinum-ogon-koi-fish-metallic-silver-bNZw5PNFEYXbZMPAY0Zxrvlscb335x.jpg",
    gender: "Cái",
    bloodline: "Local Breed",
    certificates: ["Kiểm tra sức khỏe"],
    compatibility: ["Tancho", "Asagi"],
  },
  {
    id: 1,
    name: "Kohaku Premium K-007",
    variety: "Kohaku",
    size: "35cm",
    age: "2 năm",
    price: 15000000,
    origin: "Nhật Bản",
    breeder: "Sakai Fish Farm",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-red-and-white-kohaku-koi-fish-shXq5nIYD8xv7a5mdkJBQJJ0llXM2v.jpg",
    gender: "Cái",
    bloodline: "Sakai",
    certificates: ["Chứng nhận nguồn gốc", "Kiểm tra sức khỏe"],
    compatibility: ["Sanke", "Showa", "Tancho"],
  },
  {
    id: 8,
    name: "Tancho Premium T-008",
    variety: "Tancho",
    size: "30cm",
    age: "3 tuổi",
    price: 8000000,
    origin: "Nhật Bản",
    breeder: "Koi Farm VN",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-tancho-koi-fish-with-red-circle-on-head.jpg",
    gender: "Cái",
    bloodline: "Local Breed",
    certificates: ["Kiểm tra sức khỏe"],
    compatibility: ["Kohaku", "Asagi"],
  },
];

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

  const selectedFather = availableFatherFish.find(f => f.id === selectedFatherId);
  const selectedMother = availableMotherFish.find(f => f.id === selectedMotherId);

  const parseNumberFromString = (s: string) => {
    const m = s.match(/\d+(?:[\.,]\d+)?/);
    if (!m) return NaN;
    return Number(m[0].replace(',', '.'));
  };

  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const value = target.value;
      // Chỉ cho phép số và tối đa một dấu chấm (cho số thập phân)
      const numericValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      if (value !== numericValue) {
        target.value = numericValue;
      }
    };

  const getCompatibilityScore = () => {
    if (!selectedFather || !selectedMother) return null;

    const isCompatible = selectedFather.compatibility.includes(selectedMother.variety);
    const sizeDiff = Math.abs(parseNumberFromString(selectedFather.size) - parseNumberFromString(selectedMother.size));
    const sizeCompatible = !Number.isNaN(sizeDiff) && sizeDiff <= 10;
    const ageDiff = Math.abs(parseNumberFromString(selectedFather.age) - parseNumberFromString(selectedMother.age));
    const ageCompatible = !Number.isNaN(ageDiff) && ageDiff <= 1;

    let score = 0;
    if (isCompatible) score += 40;
    if (sizeCompatible) score += 30;
    if (ageCompatible) score += 30;

    return Math.min(score, 100);
  };

  const compatibilityScore = getCompatibilityScore();

  const handleContinue = () => {
    if (selectedFather && selectedMother) {
      onSelection(selectedFather, selectedMother);
    }
  };

  const CircularSelector = ({
    type,
    selected,
    onSelect,
    availableKoi,
  }: {
    type: "father" | "mother";
    selected: Fish | null;
    onSelect: (koi: Fish) => void;
    availableKoi: Fish[];
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              {selected ? (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={selected.image || "/placeholder.svg"}
                      alt={selected.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (type === "father") setSelectedFatherId(null);
                      else setSelectedMotherId(null);
                    }}
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
                  <Plus className={`h-12 w-12 ${type === "father" ? "text-blue-400" : "text-pink-400"}`} />
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
                      src={fish.image || "/placeholder.svg"} 
                      alt={fish.name} 
                      width={300}
                      height={240}
                      className="w-full h-52 object-cover" 
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={type === "father" ? "default" : "secondary"}
                        className={type === "father" ? "bg-blue-500" : "bg-pink-500"}
                      >
                        {fish.gender}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="px-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-base mb-1 text-gray-900">{fish.name}</h3>
                      <p className="text-sm font-medium text-blue-600 mb-2">{fish.variety}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">{fish.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{fish.age}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Nguồn gốc:</span>
                        <span className="text-xs font-medium text-gray-700">{fish.origin}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Fish name and info below circle */}
        <div className="mt-4 text-center max-w-[140px]">
          {selected ? (
            <>
              <h3 className="font-semibold text-sm mb-1">{selected.name}</h3>
              <p className="text-xs text-muted-foreground">{type === "father" ? "Cá Bố" : "Cá Mẹ"}</p>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{selected.size}</span>
                <span>•</span>
                <span>{selected.age}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Chọn cá {type === "father" ? "bố" : "mẹ"}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-white rounded-lg border border-solid border-gray-200 shadow-[0px_1px_2px_#0000000d] p-6 space-y-6">
      <header>
        <h2 className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-gray-900 text-lg tracking-[0] leading-7">
          Nhập liệu chỉ sinh sản
        </h2>
        <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-sm tracking-[0] leading-5 mt-2">
          Chọn phương thức tạo cặp sinh sản
        </p>
      </header>

      <Tabs defaultValue="select-fish" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select-fish">Chọn cá</TabsTrigger>
          <TabsTrigger value="criteria">Theo tiêu chí</TabsTrigger>
        </TabsList>

        <TabsContent value="select-fish" className="space-y-6 mt-6">
          <div className="flex flex-col items-center gap-8">
            {/* Circular Selection Interface */}
            <div className="flex items-center justify-center gap-8 md:gap-16">
              {/* Male Selection */}
              <CircularSelector 
                type="father" 
                selected={selectedFather || null} 
                onSelect={(koi) => setSelectedFatherId(koi.id)} 
                availableKoi={availableFatherFish} 
              />

              {/* Heart in the middle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    selectedFather && selectedMother
                      ? "bg-gradient-to-r from-pink-500 to-red-500 animate-pulse shadow-lg"
                      : "bg-pink-500"
                  }`}
                >
                  <Heart
                    className={`h-8 w-8 ${selectedFather && selectedMother ? "text-white" : "text-white"} fill-white`}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">Phối giống</p>
                {selectedFather && selectedMother && compatibilityScore !== null && (
                  <div className="mt-2 text-center text-xs text-gray-700">
                    <div>Tương hợp: <strong>{compatibilityScore}%</strong></div>
                  </div>
                )}
              </div>

              {/* Female Selection */}
              <CircularSelector
                type="mother"
                selected={selectedMother || null}
                onSelect={(koi) => setSelectedMotherId(koi.id)}
                availableKoi={availableMotherFish}
              />
            </div>

            {/* Continue Button */}
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
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="breeding-target" className="text-sm font-medium text-gray-700">
                  Giống mong muốn
                </Label>
                <Select value={breedingTarget} onValueChange={setBreedingTarget}>
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
                <Label htmlFor="desired-quantity" className="text-sm font-medium text-gray-700">
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
                <Label htmlFor="breeding-purpose" className="text-sm font-medium text-gray-700">
                  Mục tiêu sinh sản
                </Label>
                <Select value={breedingPurpose} onValueChange={setBreedingPurpose}>
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn mục tiêu sinh sản..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show-quality">Chất lượng triển lâm</SelectItem>
                    <SelectItem value="breeding">Sinh sản</SelectItem>
                    <SelectItem value="commercial">Thương mại</SelectItem>
                    <SelectItem value="hobby">Sở thích</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="male-compatibility" className="text-sm font-medium text-gray-700">
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
                <Label htmlFor="female-compatibility" className="text-sm font-medium text-gray-700">
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
                <Label htmlFor="additional-requirements" className="text-sm font-medium text-gray-700">
                  Phân loại yêu cầu sau khi sinh sản
                </Label>
                <Select value={additionalRequirements} onValueChange={setAdditionalRequirements}>
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn yêu cầu bổ sung..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pattern-quality">Hoa văn độc đáo</SelectItem>
                    <SelectItem value="size-large">Kích thước lớn</SelectItem>
                    <SelectItem value="color-vibrant">Màu sắc rực rỡ</SelectItem>
                    <SelectItem value="body-shape">Dáng thân đẹp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600">
                  <Info className="h-4 w-4 mr-2" />
                  Xem ví dụ
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md md:max-w-4xl">
                <DialogHeader>
                  <div className="text-center">
                    <DialogTitle>Ví dụ: Nhập tiêu chí sinh sản</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Mẫu hướng dẫn điền các tiêu chí để hệ thống đề xuất cặp phù hợp</p>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-800">Thông tin tổng quan</h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      <li><span className="font-medium text-gray-600">Giống mong muốn:</span> Ai Goromo (lưới đỏ trên nền xanh)</li>
                      <li><span className="font-medium text-gray-600">Số trứng dự kiến:</span> 50,000</li>
                      <li><span className="font-medium text-gray-600">Tỷ lệ nở tối thiểu:</span> 85%</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-4 bg-white">
                    <h4 className="text-sm font-semibold text-gray-800">Yêu cầu chất lượng</h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      <li><span className="font-medium text-gray-600">Tỷ lệ sống tối thiểu:</span> 90%</li>
                      <li><span className="font-medium text-gray-600">Mục tiêu sinh sản:</span> Chất lượng triển lãm</li>
                      <li><span className="font-medium text-gray-600">Phân loại yêu cầu:</span> Hoa văn độc đáo</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <DialogTrigger asChild>
                    <Button variant="outline" className="px-4 py-2">Đóng</Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="px-8 py-2">
              Kiểm tra cặp cá phù hợp
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}