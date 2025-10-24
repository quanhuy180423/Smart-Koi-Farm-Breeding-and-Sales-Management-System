import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KoiFishResponse } from "@/lib/api/services/fetchKoiFish";
import getAge from "@/lib/utils/dates/age";
import getFishSizeLabel, { getHealthStatusLabel } from "@/lib/utils/enum";
import { Venus } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MotherFishInfoProps {
  selectedFish: KoiFishResponse;
}

export default function MotherFishInfo({ selectedFish }: MotherFishInfoProps) {
  const basicQualityData = [
    {
      label: "Nguồn gốc (Origin)",
      value: selectedFish.origin ?? "Không rõ",
    },
    {
      label: "Dáng vẻ (Body Shape)",
      value: selectedFish.bodyShape,
    },
    {
      label: "Kích thước (Size)",
      value: getFishSizeLabel(selectedFish.size),
    },
  ];

  const healthAgeData = [
    {
      label: "Sức khỏe tổng quát",
      value: getHealthStatusLabel(selectedFish.healthStatus).label,
    },
    {
      label: "Độ tuổi",
      value: `${getAge(selectedFish.birthDate)} tuổi`,
    },
  ];

  const breedData = [
    {
      label: "Giống cá",
      value: selectedFish.variety.varietyName,
    },
    {
      label: "Đặc tính giống",
      value: selectedFish.variety.characteristic,
    },
  ];

  const geneticData = [
    {
      label: "Phả hệ (Bloodline)",
      value: "Dainichi Bloodline, Generation 3, Premium Gin Rin traits",
    },
  ];

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
                {selectedFish.variety.varietyName} RFID: {selectedFish.rfid} -{" "}
                {getAge(selectedFish.birthDate)} tuổi - Sức khỏe:{" "}
                {getHealthStatusLabel(selectedFish.healthStatus).label}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-36 h-36 rounded-2xl border-4 border-pink-100 overflow-hidden shadow-lg bg-gradient-to-br from-pink-50 to-white">
              <Image
                src={selectedFish.images[0]}
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
          <div
            className={`grid grid-cols-1 md:grid-cols-${basicQualityData.length} gap-4`}
          >
            {basicQualityData.map((item, index) => (
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
          <div
            className={`grid grid-cols-1 md:grid-cols-${geneticData.length} gap-4`}
          >
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
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              3
            </span>
            Sức Khỏe & Độ Tuổi
          </h4>
          <div
            className={`grid grid-cols-1 md:grid-cols-${healthAgeData.length} gap-4`}
          >
            {healthAgeData.map((item, index) => (
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
          <div
            className={`grid grid-cols-1 md:grid-cols-${breedData.length} gap-4`}
          >
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
          <div
            className={`grid grid-cols-1 md:grid-cols-${breedData.length} gap-4`}
          >
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
      </div>
    </div>
  );
}
