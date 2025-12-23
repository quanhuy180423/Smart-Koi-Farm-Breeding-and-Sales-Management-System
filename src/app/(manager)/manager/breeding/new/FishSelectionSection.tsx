"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X, Ruler, Calendar, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useGetKoiFishById, useGetKoiFishes } from "@/hooks/useKoiFish";
import toast from "react-hot-toast";
import { formatKoiAge } from "@/lib/utils/dates/age";
import { RecommendedPair } from "@/lib/api/services/fetchBreedingProcess";
import { useGetBreedingRecommend } from "@/hooks/useBreedingProcess";
import * as z from "zod";
import { getFishSizeLabel, getGenderLabel } from "@/lib/utils/enum";
import { FishDetailDialog } from "./FishDetailDialog";
import { KoiFishFilterBar } from "./KoiFishFilterBar";
import { HealthStatus } from "@/lib/api/services/fetchKoiFish";
import { useGetVarieties } from "@/hooks/useVariety";
import { Zap, Target, TrendingUp } from "lucide-react";
import { InputNumber } from "@/components/ui/input-number";

const recommendSchema = z.object({
  targetVariety: z.string().min(1, { message: "Giống mong muốn là bắt buộc." }),
  priority: z.string().min(1, { message: "Mục tiêu ưu tiên là bắt buộc." }),
  isMutation: z.boolean(),
  minHatchRate: z
    .string()
    .min(1, { message: "Tỷ lệ nở là bắt buộc." })
    .transform(Number)
    .pipe(
      z
        .number()
        .min(0, "Tỷ lệ phải lớn hơn 0")
        .max(100, "Tỷ lệ không được quá 100"),
    ),
  minSurvivalRate: z
    .string()
    .min(1, { message: "Tỷ lệ sống là bắt buộc." })
    .transform(Number)
    .pipe(
      z
        .number()
        .min(0, "Tỷ lệ phải lớn hơn 0")
        .max(100, "Tỷ lệ không được quá 100"),
    ),
});

interface FishSelectionProps {
  onSelection: (
    fatherFish: KoiFishResponse,
    motherFish: KoiFishResponse,
  ) => void;
}

const CACHE_KEY = "breeding_criteria_cache";
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

interface CachedBreedingData {
  timestamp: number;
  formData: {
    targetVariety: string;
    priority: string;
    isMutation: boolean;
    minHatchRate: string;
    minSurvivalRate: string;
  };
  recommendedPairs: RecommendedPair[];
}

export function FishSelectionSection({ onSelection }: FishSelectionProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(() => {
    return searchParamsObj.get("tab") || "select-fish";
  });

  const [selectedFatherId, setSelectedFatherId] = useState<number | null>(null);
  const [selectedMotherId, setSelectedMotherId] = useState<number | null>(null);

  const [targetVariety, setTargetVariety] = useState("");
  const [priority, setPriority] = useState("");
  const [isMutation, setIsMutation] = useState(false);
  const [minHatchRate, setMinHatchRate] = useState("");
  const [minSurvivalRate, setMinSurvivalRate] = useState("");
  const [recommendedPairs, setRecommendedPairs] = useState<RecommendedPair[]>(
    [],
  );
  const [selectedPairToFetch, setSelectedPairToFetch] = useState<{
    fatherId?: number;
    motherId?: number;
  } | null>(null);

  const [pageIndexMale, setPageIndexMale] = useState(1);
  const [pageIndexFemale, setPageIndexFemale] = useState(1);
  const pageSize = 6;

  // Father fish filters
  const [fatherSearchInput, setFatherSearchInput] = useState("");
  const [fatherSearch, setFatherSearch] = useState("");

  // Mother fish filters
  const [motherSearchInput, setMotherSearchInput] = useState("");
  const [motherSearch, setMotherSearch] = useState("");

  const { data: fatherRecommend } = useGetKoiFishById(
    selectedPairToFetch?.fatherId,
  );
  const { data: motherRecommend } = useGetKoiFishById(
    selectedPairToFetch?.motherId,
  );

  const {
    mutate: getRecommends,
    isPending,
    data: recommendData,
  } = useGetBreedingRecommend();

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedData: CachedBreedingData = JSON.parse(cached);
          const now = Date.now();

          // Check if cache is still valid (within 5 minutes)
          if (now - parsedData.timestamp < CACHE_DURATION) {
            // Restore form data
            setTargetVariety(parsedData.formData.targetVariety);
            setPriority(parsedData.formData.priority);
            setIsMutation(parsedData.formData.isMutation);
            setMinHatchRate(parsedData.formData.minHatchRate);
            setMinSurvivalRate(parsedData.formData.minSurvivalRate);

            // Restore recommended pairs
            setRecommendedPairs(parsedData.recommendedPairs);
          } else {
            // Cache expired, remove it
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
        localStorage.removeItem(CACHE_KEY);
      }
    };

    loadCachedData();
  }, []);

  useEffect(() => {
    if (recommendData?.isSuccess) {
      const pairs = recommendData.result.recommendedPairs || [];
      setRecommendedPairs(pairs);

      // Save to cache when we get new results
      const cacheData: CachedBreedingData = {
        timestamp: Date.now(),
        formData: {
          targetVariety,
          priority,
          isMutation,
          minHatchRate,
          minSurvivalRate,
        },
        recommendedPairs: pairs,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }
  }, [
    recommendData,
    targetVariety,
    priority,
    isMutation,
    minHatchRate,
    minSurvivalRate,
  ]);

  const { data: varietiesData } = useGetVarieties({
    pageIndex: 1,
    pageSize: 100,
  });

  const {
    data: fatherKoiResponse,
    isError: isGetMaleKoisErr,
    isLoading: isFatherLoading,
    refetch: refetchMale,
  } = useGetKoiFishes({
    pageIndex: pageIndexMale,
    pageSize,
    gender: Gender.MALE,
    isBreeding: true,
    search: fatherSearch,
    health: HealthStatus.HEALTHY,
  });
  const {
    data: motherKoiResponse,
    isError: isGetFemaleKoisErr,
    isLoading: isMotherLoading,
    refetch: refetchFemale,
  } = useGetKoiFishes({
    pageIndex: pageIndexFemale,
    pageSize,
    gender: Gender.FEMALE,
    isBreeding: true,
    search: motherSearch,
    health: HealthStatus.HEALTHY,
  });

  // Debounce father search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFatherSearch(fatherSearchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [fatherSearchInput]);

  // Debounce mother search
  useEffect(() => {
    const timer = setTimeout(() => {
      setMotherSearch(motherSearchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [motherSearchInput]);

  // Reset pagination when filters change
  useEffect(() => {
    setPageIndexMale(1);
    refetchMale();
  }, [fatherSearch, refetchMale]);

  useEffect(() => {
    refetchMale();
  }, [pageIndexMale, refetchMale]);

  useEffect(() => {
    setPageIndexFemale(1);
    refetchFemale();
  }, [motherSearch, refetchFemale]);

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

  const handleContinue = () => {
    if (selectedFather && selectedMother)
      onSelection(selectedFather, selectedMother);
  };

  const handleRecommend = () => {
    const formData = {
      targetVariety,
      priority,
      isMutation,
      minHatchRate,
      minSurvivalRate,
    };

    const validationResult = recommendSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = Object.values(
        validationResult.error.flatten().fieldErrors,
      )[0]?.[0];
      toast.error(firstError || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    getRecommends(validationResult.data);
  };

  const [isFatherDialogOpen, setIsFatherDialogOpen] = useState(false);
  const [isMotherDialogOpen, setIsMotherDialogOpen] = useState(false);

  // Detail dialog states for father and mother
  const [fatherDetailKoi, setFatherDetailKoi] =
    useState<KoiFishResponse | null>(null);
  const [isFatherDetailOpen, setIsFatherDetailOpen] = useState(false);
  const [motherDetailKoi, setMotherDetailKoi] =
    useState<KoiFishResponse | null>(null);
  const [isMotherDetailOpen, setIsMotherDetailOpen] = useState(false);

  const handleSelectRecommendedPair = (pair: RecommendedPair) => {
    setSelectedPairToFetch({ fatherId: pair.maleId, motherId: pair.femaleId });
  };

  useEffect(() => {
    if (fatherRecommend && motherRecommend) {
      onSelection(fatherRecommend, motherRecommend);
      setSelectedPairToFetch(null);
    }
  }, [fatherRecommend, motherRecommend, onSelection]);

  const CircularSelector = ({
    type,
    selected,
    onClickTrigger,
    onRemove,
  }: {
    type: "father" | "mother";
    selected: KoiFishResponse | null;
    onClickTrigger: () => void;
    onRemove: () => void;
  }) => {
    return (
      <div className="flex flex-col items-center">
        <div
          onClick={onClickTrigger}
          className="relative cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClickTrigger();
            }
          }}
        >
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onRemove();
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
              <Plus
                className={`h-12 w-12 ${type === "father" ? "text-blue-400" : "text-pink-400"}`}
              />
            </div>
          )}
        </div>

        <div className="mt-4 text-center w-full">
          {selected ? (
            <>
              <h3 className="font-semibold text-sm mb-1 truncate">
                {selected.rfid}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {type === "father" ? "Cá Bố" : "Cá Mẹ"}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground whitespace-nowrap overflow-hidden">
                <span className="truncate">
                  {getFishSizeLabel(selected.size)}
                </span>
                <span className="shrink-0">•</span>
                <span className="shrink-0">
                  {formatKoiAge(selected.birthDate)}
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
          Nhập liệu chỉ số sinh sản
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Chọn phương thức tạo cặp sinh sản
        </p>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(tab) => {
          setActiveTab(tab);
          router.push(`/manager/breeding/new?tab=${tab}`);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select-fish">Chọn cá thủ công</TabsTrigger>
          <TabsTrigger value="criteria">Đề xuất theo tiêu chí</TabsTrigger>
        </TabsList>

        <TabsContent value="select-fish" className="space-y-6 mt-6">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {/* Father Selector - Dialog trigger via click event */}
            <CircularSelector
              type="father"
              selected={selectedFather || null}
              onClickTrigger={() => setIsFatherDialogOpen(true)}
              onRemove={() => setSelectedFatherId(null)}
            />

            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                  selectedFather && selectedMother
                    ? "bg-linear-to-r from-pink-500 to-red-500 animate-pulse shadow-lg"
                    : "bg-pink-500"
                }`}
              >
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
            </div>

            {/* Mother Selector - Dialog trigger via click event */}
            <CircularSelector
              type="mother"
              selected={selectedMother || null}
              onClickTrigger={() => setIsMotherDialogOpen(true)}
              onRemove={() => setSelectedMotherId(null)}
            />
          </div>

          {/* Father Fish List Dialog */}
          <Dialog
            open={isFatherDialogOpen}
            onOpenChange={setIsFatherDialogOpen}
          >
            <DialogContent className="max-w-7xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Chọn Cá Bố
                </DialogTitle>
                <DialogDescription className="text-center">
                  Chọn cá bố để tạo cặp sinh sản
                </DialogDescription>
              </DialogHeader>
              <KoiFishFilterBar
                search={fatherSearchInput}
                onSearchChange={setFatherSearchInput}
              />
              {isFatherLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang tải dữ liệu...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {(fatherKoiResponse?.data || []).map((fish) => (
                      <Card
                        key={fish.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 pt-0 pb-2 gap-3"
                        onClick={() => {
                          setFatherDetailKoi(fish);
                          setIsFatherDetailOpen(true);
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
                            <Badge className="bg-blue-500">
                              {getGenderLabel(fish.gender).label}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="px-4 space-y-3">
                          <h3 className="font-bold text-base mb-1 text-gray-900">
                            {fish.rfid}
                          </h3>
                          <p className="text-sm font-medium text-blue-600 mb-2">
                            {fish?.variety?.varietyName || ""}
                          </p>
                          <div className="grid grid-cols-[2fr_1fr] gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Ruler className="h-4 w-4 text-blue-500 shrink-0" />
                              <span className="text-gray-700">
                                {getFishSizeLabel(fish.size)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-500 shrink-0" />
                              <span className="text-gray-700">
                                {formatKoiAge(fish.birthDate)}
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
                      onClick={() => setPageIndexMale(pageIndexMale - 1)}
                      disabled={!fatherKoiResponse?.hasPreviousPage}
                    >
                      {"<"}
                    </Button>
                    <span className="px-2">{pageIndexMale}</span>
                    <Button
                      size="sm"
                      onClick={() => setPageIndexMale(pageIndexMale + 1)}
                      disabled={!fatherKoiResponse?.hasNextPage}
                    >
                      {">"}
                    </Button>
                  </div>
                </>
              )}

              {/* Father Detail Dialog */}
              <FishDetailDialog
                isOpen={isFatherDetailOpen}
                onOpenChange={setIsFatherDetailOpen}
                selectedFish={fatherDetailKoi}
                type="father"
                onSelect={(fish) => setSelectedFatherId(fish.id)}
                onListClose={() => setIsFatherDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Mother Fish List Dialog */}
          <Dialog
            open={isMotherDialogOpen}
            onOpenChange={setIsMotherDialogOpen}
          >
            <DialogContent className="max-w-7xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Chọn Cá Mẹ
                </DialogTitle>
                <DialogDescription className="text-center">
                  Chọn cá mẹ để tạo cặp sinh sản
                </DialogDescription>
              </DialogHeader>
              <KoiFishFilterBar
                search={motherSearchInput}
                onSearchChange={setMotherSearchInput}
              />
              {isMotherLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang tải dữ liệu...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {(motherKoiResponse?.data || []).map((fish) => (
                      <Card
                        key={fish.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 pt-0 pb-2 gap-3"
                        onClick={() => {
                          setMotherDetailKoi(fish);
                          setIsMotherDetailOpen(true);
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
                            <Badge className="bg-pink-500">
                              {getGenderLabel(fish.gender).label}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="px-4 space-y-3">
                          <h3 className="font-bold text-base mb-1 text-gray-900">
                            {fish.rfid}
                          </h3>
                          <p className="text-sm font-medium text-blue-600 mb-2">
                            {fish?.variety?.varietyName || ""}
                          </p>
                          <div className="grid grid-cols-[2fr_1fr] gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Ruler className="h-4 w-4 text-blue-500 shrink-0" />
                              <span className="text-gray-700">
                                {getFishSizeLabel(fish.size)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-500 shrink-0" />
                              <span className="text-gray-700">
                                {formatKoiAge(fish.birthDate)}
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
                      onClick={() => setPageIndexFemale(pageIndexFemale - 1)}
                      disabled={!motherKoiResponse?.hasPreviousPage}
                    >
                      {"<"}
                    </Button>
                    <span className="px-2">{pageIndexFemale}</span>
                    <Button
                      size="sm"
                      onClick={() => setPageIndexFemale(pageIndexFemale + 1)}
                      disabled={!motherKoiResponse?.hasNextPage}
                    >
                      {">"}
                    </Button>
                  </div>
                </>
              )}

              {/* Mother Detail Dialog */}
              <FishDetailDialog
                isOpen={isMotherDetailOpen}
                onOpenChange={setIsMotherDetailOpen}
                selectedFish={motherDetailKoi}
                type="mother"
                onSelect={(fish) => setSelectedMotherId(fish.id)}
                onListClose={() => setIsMotherDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {selectedFather && selectedMother && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleContinue}
                className="h-auto px-8 py-3 text-base shadow-md rounded-xl"
              >
                Tiếp tục ghép cặp
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="criteria" className="space-y-8 mt-6">
          {/* Phần 1: Tiêu chí cơ bản */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Tiêu chí cơ bản
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div>
                <Label
                  htmlFor="target-variety"
                  className="text-sm font-medium text-gray-700"
                >
                  Giống mong muốn <span className="text-red-500">*</span>
                </Label>
                <Select value={targetVariety} onValueChange={setTargetVariety}>
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn giống..." />
                  </SelectTrigger>
                  <SelectContent>
                    {varietiesData?.data?.map((variety) => (
                      <SelectItem key={variety.id} value={variety.varietyName}>
                        {variety.varietyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="priority"
                  className="text-sm font-medium text-gray-700"
                >
                  Mục tiêu ưu tiên <span className="text-red-500">*</span>
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1 border border-gray-300 w-full">
                    <SelectValue placeholder="Chọn mục tiêu..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Số lượng">Số lượng</SelectItem>
                    <SelectItem value="Chất lượng">Chất lượng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Phần 2: Tiêu chí đột biến */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Tiêu chí đột biến
              </h3>
            </div>
            <div className="bg-linear-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Mong muốn cá có đột biến
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Bật để tìm cặp cá có khả năng tạo ra cá con với đột biến
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="is-mutation"
                    checked={isMutation}
                    onChange={(e) => setIsMutation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-14 h-7 rounded-full transition-all ${
                      isMutation
                        ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                        : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      isMutation ? "translate-x-7" : ""
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Phần 3: Tiêu chí chất lượng */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Tiêu chí chất lượng
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-green-50 p-6 rounded-lg border border-green-100">
              <div>
                <Label
                  htmlFor="min-hatch-rate"
                  className="text-sm font-medium text-gray-700"
                >
                  Tỷ lệ nở tối thiểu (%) <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  id="min-hatch-rate"
                  placeholder="VD: 85"
                  value={minHatchRate}
                  max={100}
                  min={1}
                  className="mt-1 border border-gray-300 w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="min-survival-rate"
                  className="text-sm font-medium text-gray-700"
                >
                  Tỷ lệ sống tối thiểu (%){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <InputNumber
                  id="min-survival-rate"
                  placeholder="VD: 90"
                  value={minSurvivalRate}
                  max={100}
                  min={1}
                  className="mt-1 border border-gray-300 w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleRecommend}
              disabled={isPending}
              className="px-8 py-2 min-w-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tìm kiếm...
                </>
              ) : (
                "Kiểm tra cặp cá phù hợp"
              )}
            </Button>
          </div>

          {/* Khu vực hiển thị kết quả */}
          {recommendedPairs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Các cặp cá được đề xuất
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendedPairs.map((pair, index) => {
                  const isCurrentPairFetching =
                    selectedPairToFetch?.fatherId === pair.maleId &&
                    selectedPairToFetch?.motherId === pair.femaleId;

                  return (
                    <Card key={index} className="overflow-hidden flex flex-col">
                      <CardContent className="p-4 grow">
                        <div className="flex gap-4">
                          {/* Cá đực */}
                          <div className="text-center w-1/2">
                            <Image
                              src={pair.maleImage}
                              alt={pair.maleRFID}
                              width={150}
                              height={150}
                              className="rounded-lg object-cover mx-auto w-full h-32"
                            />
                            <p className="font-bold mt-2 text-sm">
                              {pair.maleRFID}
                            </p>
                            <Badge className="bg-blue-500 mt-1 text-xs">
                              Đực
                            </Badge>
                          </div>

                          {/* Cá cái */}
                          <div className="text-center w-1/2">
                            <Image
                              src={pair.femaleImage}
                              alt={pair.femaleRFID}
                              width={150}
                              height={150}
                              className="rounded-lg object-cover mx-auto w-full h-32"
                            />
                            <p className="font-bold mt-2 text-sm">
                              {pair.femaleRFID}
                            </p>
                            <Badge className="bg-pink-500 mt-1 text-xs">
                              Cái
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <p className="font-semibold">Lý do đề xuất:</p>
                          <p className="text-sm text-gray-600 mb-2">
                            {pair.reason}
                          </p>
                          {(pair.maleIsMutated || pair.femaleIsMutated) && (
                            <div className="mb-3 p-2 bg-purple-50 rounded border border-purple-200">
                              <p className="text-xs font-semibold text-purple-900 mb-1">
                                Đặc tính đột biến:
                              </p>
                              {pair.maleIsMutated && (
                                <p className="text-xs text-purple-800">
                                  <strong>Cá đực:</strong>{" "}
                                  {pair.maleMutationDescription}
                                </p>
                              )}
                              {pair.femaleIsMutated && (
                                <p className="text-xs text-purple-800">
                                  <strong>Cá cái:</strong>{" "}
                                  {pair.femaleMutationDescription}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <span>
                              Tỷ lệ thụ tinh:{" "}
                              <strong>
                                {pair.predictedFertilizationRate?.toFixed(2)}%
                              </strong>
                            </span>
                            <span>
                              Tỷ lệ nở:{" "}
                              <strong>
                                {pair.predictedHatchRate?.toFixed(2)}%
                              </strong>
                            </span>
                            <span>
                              Tỷ lệ sống:{" "}
                              <strong>
                                {pair.predictedSurvivalRate?.toFixed(2)}%
                              </strong>
                            </span>
                            <span>
                              Trung bình cá con chất lượng cao:{" "}
                              <strong>
                                {pair.predictedHighQualifiedQuanity} con
                              </strong>
                            </span>
                            {pair.predictedMutationRate > 0 && (
                              <>
                                <span className="col-span-2 pt-2 border-t text-xs text-gray-700">
                                  <strong>Dự kiến đột biến:</strong>{" "}
                                  {pair.predictedMutationDescription}
                                </span>
                                <span className="col-span-2 text-xs text-gray-700">
                                  <strong>Tỷ lệ đột biến:</strong>{" "}
                                  {pair.predictedMutationRate?.toFixed(2)}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => handleSelectRecommendedPair(pair)}
                          disabled={isCurrentPairFetching}
                        >
                          {isCurrentPairFetching ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang tải...
                            </>
                          ) : (
                            <>Chọn cặp này</>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
