import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import { useAnalyzePair } from "@/hooks/useBreedingProcess";
import {
  Heart,
  Dna,
  Star,
  BarChart3,
  AlertTriangle,
  FileText,
  Mars,
  Venus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnalyzePairResponse } from "@/lib/api/services/fetchBreedingProcess";

interface ComparisonSectionProps {
  fatherFish: KoiFishResponse;
  motherFish: KoiFishResponse;
}

export default function ComparisonSection({
  fatherFish,
  motherFish,
}: ComparisonSectionProps) {
  const {
    mutate: analyzePair,
    data: analysisResult,
    isPending,
  } = useAnalyzePair();
  const [analysisData, setAnalysisData] = useState<AnalyzePairResponse | null>(
    null
  );

  useEffect(() => {
    if (fatherFish && motherFish) {
      analyzePair({
        maleId: fatherFish.id,
        femaleId: motherFish.id,
      });
    }
  }, [fatherFish, motherFish, analyzePair]);

  useEffect(() => {
    if (analysisResult?.result) {
      setAnalysisData(analysisResult.result);
    }
  }, [analysisResult]);

  // Helper function to get risk level based on percentage
  const getRiskLevel = (
    value: number
  ): {
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  } => {
    if (value < 2)
      return {
        label: "Thấp",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
      };
    if (value < 5)
      return {
        label: "Trung bình",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
      };
    return {
      label: "Cao",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
    };
  };

  const geneticData = analysisData
    ? [
        {
          label: "Tỷ lệ cận huyết:",
          value: `${analysisData.percentInbreeding}%`,
          color: getRiskLevel(analysisData.percentInbreeding).textColor,
        },
        {
          label: "Tỷ lệ đột biến dự kiến:",
          value: `${analysisData.predictedMutationRate?.toFixed(1) || 0}%`,
          color: "text-amber-600",
        },
        {
          label: "Số lượng trung bình cá con chất lượng cao:",
          value: `${analysisData?.predictedHighQualifiedQuanity || 0} con`,
          color: "text-purple-600",
        },
      ]
    : [];

  const qualityData = analysisData
    ? [
        {
          label: "Tỷ lệ thụ tinh dự kiến:",
          value: `${analysisData.predictedFertilizationRate?.toFixed(1) || 0}%`,
          color: "text-blue-600",
        },
        {
          label: "Tỷ lệ nở dự kiến:",
          value: `${analysisData.predictedHatchRate?.toFixed(1) || 0}%`,
          color: "text-blue-600",
        },
        {
          label: "Tỷ lệ sống sót dự kiến:",
          value: `${analysisData.predictedSurvivalRate?.toFixed(1) || 0}%`,
          color: "text-blue-600",
        },
      ]
    : [];

  const riskAssessmentList = analysisData
    ? [
        {
          message: `Nguy cơ cận huyết ${analysisData.percentInbreeding > 0 ? "ở mức " + analysisData.percentInbreeding?.toFixed(1) + "%" : "rất thấp"}. ${analysisData.percentInbreeding < 2 ? "An toàn cho phối giống." : "Cần xem xét."}`,
          percent: analysisData.percentInbreeding,
          ...getRiskLevel(analysisData.percentInbreeding),
        },
      ]
    : [];

  if (isPending) {
    return (
      <section className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-8 space-y-8">
        <header>
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-3 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Đánh giá mức độ tương hợp
          </h2>
          <p className="text-gray-600 text-sm">
            Phân tích chi tiết về khả năng phối giống và dự đoán kết quả
          </p>
        </header>

        <Card className="border-purple-200 bg-linear-to-r from-purple-50 via-blue-50 to-pink-50 shadow-lg">
          <CardContent className="px-6 py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-gray-600 font-medium">
              Đang phân tích cặp cá...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-8 space-y-8">
      <header>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="w-3 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
          Đánh giá mức độ tương hợp
        </h2>
        <p className="text-gray-600 text-sm">
          Phân tích chi tiết về khả năng phối giống và dự đoán kết quả
        </p>
      </header>

      <Card className="border-purple-200 bg-linear-to-r from-purple-50 via-blue-50 to-pink-50 shadow-lg">
        <CardContent className="px-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
            Thông tin cặp phối giống
          </h3>

          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl border-4 border-blue-200 overflow-hidden shadow-lg bg-linear-to-br from-blue-50 to-white">
                  <Image
                    src={fatherFish.images[0]}
                    alt={fatherFish.rfid}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                  <Mars className="h-4 w-4" />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-900 text-center mb-1">
                {fatherFish.rfid}
              </div>
              <div className="text-xs text-blue-600 font-medium">Cá Bố</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-linear-to-r from-pink-500 to-purple-500 rounded-full p-4 mb-4 shadow-lg animate-pulse">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <div className="text-xs font-medium text-purple-600">
                Phối giống
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl border-4 border-pink-200 overflow-hidden shadow-lg bg-linear-to-br from-pink-50 to-white">
                  <Image
                    src={motherFish.images[0]}
                    alt={motherFish.rfid}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                  <Venus className="h-4 w-4" />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-900 text-center mb-1">
                {motherFish.rfid}
              </div>
              <div className="text-xs text-pink-600 font-medium">Cá Mẹ</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="px-5">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center">
                <Dna className="w-3 h-3" />
              </div>
              Tương hợp di truyền
            </h3>
            <div className="space-y-4">
              {geneticData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="px-5">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">
                <Star className="w-3 h-3" />
              </div>
              Đánh giá chất lượng
            </h3>
            <div className="space-y-4">
              {qualityData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          So sánh lịch sử sinh sản
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="px-5">
              <div className="flex items-center gap-2 mb-3">
                <Mars className="w-6 h-6 text-blue-800" />
                <span className="text-base font-bold text-blue-800">
                  Cá Bố - Tỷ lệ thụ tinh trung bình:{" "}
                  {analysisData?.maleBreedingInfo?.avgFertilizationRate?.toFixed(
                    2
                  )}
                  %
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                {analysisData?.maleBreedingInfo?.summary ||
                  "Chưa có dữ liệu lịch sử sinh sản"}
              </div>
              {analysisData?.maleBreedingInfo && (
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <span className="text-xs text-gray-600">
                    Tỷ lệ thành công:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${analysisData?.maleBreedingInfo?.breedingSuccessRate?.toFixed(0)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {analysisData?.maleBreedingInfo?.breedingSuccessRate?.toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-pink-50 to-rose-50 border-pink-200 hover:shadow-lg transition-shadow">
            <CardContent className="px-5">
              <div className="flex items-center gap-2 mb-3">
                <Venus className="w-6 h-6 text-pink-800" />
                <span className="text-base font-bold text-pink-800">
                  Cá Mẹ - Số trứng trung bình:{" "}
                  {analysisData?.femaleBreedingInfo?.avgEggs}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                {analysisData?.femaleBreedingInfo?.summary ||
                  "Chưa có dữ liệu lịch sử sinh sản"}
              </div>
              {analysisData?.femaleBreedingInfo && (
                <div className="bg-white p-3 rounded-lg border border-pink-100">
                  <span className="text-xs text-gray-600">
                    Tỷ lệ thành công:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{
                          width: `${analysisData?.femaleBreedingInfo?.breedingSuccessRate?.toFixed(0)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-pink-600">
                      {analysisData?.femaleBreedingInfo?.breedingSuccessRate?.toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          Tóm tắt phân tích
        </h3>

        <Card className="bg-linear-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="px-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-200 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0 shadow-md">
                📋
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-gray-800 font-medium">
                  {analysisData?.summary || "Chưa đủ thông tin để phân tích"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {riskAssessmentList.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            Đánh giá rủi ro và khuyến nghị
          </h3>

          <div className="grid gap-4">
            {riskAssessmentList.map((assessment, index) => (
              <Card
                key={index}
                className={`${assessment.bgColor} ${assessment.borderColor} border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              >
                <CardContent className="px-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0 ${
                        assessment.bgColor.includes("green")
                          ? "bg-green-200 text-green-800 shadow-green-100 shadow-md"
                          : assessment.bgColor.includes("yellow")
                            ? "bg-yellow-200 text-yellow-800 shadow-yellow-100 shadow-md"
                            : "bg-red-200 text-red-800 shadow-red-100 shadow-md"
                      }`}
                    >
                      {assessment.bgColor.includes("green")
                        ? "✓"
                        : assessment.bgColor.includes("yellow")
                          ? "!"
                          : "⚠"}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-sm leading-relaxed ${assessment.textColor} font-medium mb-2`}
                      >
                        {assessment.message}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 rounded-full flex-1 ${
                            assessment.bgColor.includes("green")
                              ? "bg-green-100"
                              : assessment.bgColor.includes("yellow")
                                ? "bg-yellow-100"
                                : "bg-red-100"
                          }`}
                        >
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(assessment.percent ?? 0, 100)}%`,
                              backgroundColor: assessment.bgColor.includes(
                                "green"
                              )
                                ? "#22c55e"
                                : assessment.bgColor.includes("yellow")
                                  ? "#eab308"
                                  : "#ef4444",
                            }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            assessment.bgColor.includes("green")
                              ? "text-green-700"
                              : assessment.bgColor.includes("yellow")
                                ? "text-yellow-700"
                                : "text-red-700"
                          }`}
                        >
                          {assessment.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* 
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          Ghi chú đánh giá bổ sung
        </h3>

        <Card className="bg-linear-to-br from-gray-50 to-slate-50 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="px-6">
            <Textarea
              className="border border-gray-300 resize-none bg-transparent text-gray-700 text-sm leading-relaxed placeholder:text-gray-400 focus:ring-0 min-h-[120px]"
              placeholder="Ghi chú chi tiết về đánh giá tương hợp và kỳ vọng kết quả phối giống..."
              rows={6}
            />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Lưu ý: Thông tin này sẽ được lưu trong hồ sơ phối giống
              </span>
              <span className="text-xs text-gray-400">0 / 500 ký tự</span>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </section>
  );
}
