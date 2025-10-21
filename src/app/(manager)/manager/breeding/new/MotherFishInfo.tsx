import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { Venus } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MotherFishInfoProps {
  selectedFish: KoiFishResponse;
}

const qualityData = [
  {
    label: "Chất lượng da (Shiroji)",
    value: "Good - Da trắng nhẹ ngả xanh",
  },
  {
    label: "Màu sắc (Hi/Sumi)",
    value: "Excellent - Vảy xanh đậm, đều",
  },
  {
    label: "Dáng vẻ (Body Shape)",
    value: "Excellent - Thân hình cân đối",
  },
];

const geneticData = [
  {
    label: "Phả hệ (Bloodline)",
    value: "Maruyama Farm, Generation 2, Classic Asagi traits",
  },
];

const healthData = [
  {
    label: "Sức khỏe tổng quát",
    value: "Excellent - Hoàn toàn khỏe mạnh",
  },
  {
    label: "Độ tuổi",
    value: "3 tuổi (tối ưu cho sinh sản)",
  },
];

const breedData = [
  {
    label: "Giống cá",
    value: "Asagi",
  },
  {
    label: "Đặc tính giống",
    value: "Vảy xanh trên lưng đẹp, Hi cam ở bụng cân đối.",
  },
];

const breedingData = [
  {
    label: "Thành tích sinh sản",
    value: "2 lần sinh sản, kết quả tương đối tốt",
  },
  {
    label: "Tỷ lệ cá con khỏe mạnh",
    value: "88%",
  },
];

export default function MotherFishInfo({ selectedFish }: MotherFishInfoProps) {
  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-3 h-8 bg-pink-500 rounded-full"></div>
          Thông tin cá mẹ
        </h2>

        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Chọn cá mẹ để đánh giá
          </label>

          <Select defaultValue={selectedFish.id.toString()} disabled>
            <SelectTrigger className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg text-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={selectedFish.id.toString()}>
                {selectedFish.variety.varietyName} ID: {selectedFish.rfid} -{" "}
                {formatDate(selectedFish.birthDate, DATE_FORMATS.MEDIUM_DATE)} -{" "}
                {selectedFish.healthStatus}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-36 h-36 rounded-2xl border-4 border-pink-100 overflow-hidden shadow-lg bg-gradient-to-br from-pink-50 to-white">
              <Image
                src={selectedFish.imagesVideos || "/placeholder.svg"}
                alt={selectedFish.rfid}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white text-xs font-bold py-1 px-2 rounded-full">
              <Venus className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center">
            {selectedFish.rfid}
          </h3>
          <p className="text-sm text-pink-600 font-medium mt-1">Cá Mẹ</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              1
            </span>
            Phẩm Chất Cơ Bản của Cá Thể
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {qualityData.map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              2
            </span>
            Dữ liệu Di truyền & Phả hệ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {geneticData.map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-900">{item.value}</div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Thông số di truyền
                </div>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-semibold text-black">Cận huyết:</span>
                    <span className="text-red-600 font-medium"> 1.2%</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-black">Đột biến:</span>
                    <span className="text-blue-600 font-medium"> 1.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              3
            </span>
            Sức Khỏe & Độ Tuổi
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthData.map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              4
            </span>
            Đặc Tính Riêng Biệt Theo Giống
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breedData.map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-900">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              5
            </span>
            Dữ Liệu Lịch Sử Sinh Sản
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breedingData.map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-pink-50 to-white border-pink-100 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-900">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
