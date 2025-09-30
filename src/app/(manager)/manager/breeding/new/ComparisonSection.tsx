import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Dna, Star, BarChart3, AlertTriangle, FileText, Mars, Venus } from "lucide-react";
import Image from "next/image";
import React from "react";

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

interface ComparisonSectionProps {
  fatherFish: Fish;
  motherFish: Fish;
}

const geneticData = [
  { label: "Tỷ lệ cận huyết:", value: "1.9%", color: "text-red-600" },
  { label: "Tỷ lệ đột biến:", value: "1.1%", color: "text-blue-600" },
  {
    label: "Tương hợp giống:",
    value: "Khác giống (Medium)",
    color: "text-green-600",
  },
];

const qualityData = [
  {
    label: "Mức độ tương hợp:",
    value: "High - Tương hợp cao",
    color: "text-green-600",
  },
  {
    label: "Kỳ vọng chất lượng cá con:",
    value: "Excellent - Chất lượng cao",
    color: "text-green-600",
  },
  { label: "Tỷ lệ thành công dự kiến:", value: "90%", color: "text-green-600" },
];

const riskAssessments = [
  {
    message: "Nguy cơ cận huyết thấp (1.9%). An toàn cho phối giống.",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
  },
  {
    message:
      "Phối giống khác giống (Kohaku × Asagi). Có thể tạo ra đặc điểm lai thú vị.",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
  },
];

export default function ComparisonSection({ fatherFish, motherFish }: ComparisonSectionProps) {
  return (
    <section className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-8 space-y-8">
      <header>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          Đánh giá mức độ tương hợp
        </h2>
        <p className="text-gray-600 text-sm">Phân tích chi tiết về khả năng phối giống và dự đoán kết quả</p>
      </header>

      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 shadow-lg">
        <CardContent className="px-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
            Thông tin cặp phối giống
          </h3>

          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl border-4 border-blue-200 overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-white">
                  <Image
                    src={fatherFish.image || "/placeholder.svg"}
                    alt={fatherFish.name}
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
                {fatherFish.name}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                Cá Bố
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4 mb-4 shadow-lg animate-pulse">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <div className="text-xs font-medium text-purple-600">
                Phối giống
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl border-4 border-pink-200 overflow-hidden shadow-lg bg-gradient-to-br from-pink-50 to-white">
                  <Image
                    src={motherFish.image || "/placeholder.svg"}
                    alt={motherFish.name}
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
                {motherFish.name}
              </div>
              <div className="text-xs text-pink-600 font-medium">
                Cá Mẹ
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="px-5">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center">
                <Dna className="w-3 h-3" />
              </div>
              Tương hợp di truyền
            </h3>
            <div className="space-y-4">
              {geneticData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
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

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="px-5">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center">
                <Star className="w-3 h-3" />
              </div>
              Đánh giá chất lượng
            </h3>
            <div className="space-y-4">
              {qualityData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
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
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="px-5">
              <div className="flex items-center gap-2 mb-3">
                <Mars className="w-6 h-6 text-blue-800" />
                <span className="text-base font-bold text-blue-800">Cá Bố</span>
              </div>
              <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                3 lần sinh sản thành công, cá con đạt chất lượng cao
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <span className="text-xs text-gray-600">Tỷ lệ thành công:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-sm font-bold text-blue-600">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 hover:shadow-lg transition-shadow">
            <CardContent className="px-5">
              <div className="flex items-center gap-2 mb-3">
                <Venus className="w-6 h-6 text-pink-800" />
                <span className="text-base font-bold text-pink-800">Cá Mẹ</span>
              </div>
              <div className="text-sm text-gray-700 mb-3 leading-relaxed">
                2 lần sinh sản, kết quả tương đối tốt
              </div>
              <div className="bg-white p-3 rounded-lg border border-pink-100">
                <span className="text-xs text-gray-600">Tỷ lệ thành công:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{width: '88%'}}></div>
                  </div>
                  <span className="text-sm font-bold text-pink-600">88%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          Đánh giá rủi ro và khuyến nghị
        </h3>

        <div className="grid gap-4">
          {riskAssessments.map((assessment, index) => (
            <Card
              key={index}
              className={`${assessment.bgColor} ${assessment.borderColor} border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
            >
              <CardContent className="px-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                    assessment.bgColor.includes('green') ? 'bg-green-200 text-green-800 shadow-green-100 shadow-md' :
                    assessment.bgColor.includes('yellow') ? 'bg-yellow-200 text-yellow-800 shadow-yellow-100 shadow-md' :
                    'bg-red-200 text-red-800 shadow-red-100 shadow-md'
                  }`}>
                    {assessment.bgColor.includes('green') ? '✓' :
                     assessment.bgColor.includes('yellow') ? '!' : '⚠'}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm leading-relaxed ${assessment.textColor} font-medium mb-2`}>
                      {assessment.message}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 rounded-full flex-1 ${
                        assessment.bgColor.includes('green') ? 'bg-green-100' :
                        assessment.bgColor.includes('yellow') ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${
                          assessment.bgColor.includes('green') ? 'bg-green-500 w-3/4' :
                          assessment.bgColor.includes('yellow') ? 'bg-yellow-500 w-1/2' :
                          'bg-red-500 w-1/4'
                        }`}></div>
                      </div>
                      <span className={`text-xs font-bold ${
                        assessment.bgColor.includes('green') ? 'text-green-700' :
                        assessment.bgColor.includes('yellow') ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {assessment.bgColor.includes('green') ? 'Thấp' :
                         assessment.bgColor.includes('yellow') ? 'Trung bình' : 'Cao'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          Ghi chú đánh giá bổ sung
        </h3>

        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
              <span className="text-xs text-gray-400">
                0 / 500 ký tự
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}