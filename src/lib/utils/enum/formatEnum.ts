import {
  BreedingResult,
  BreedingStatus,
} from "@/lib/api/services/fetchBreedingProcess";
import { FishSize, HealthStatus } from "@/lib/api/services/fetchKoiFish";
import { PondStatus } from "@/lib/api/services/fetchPond";

interface Label {
  label: string;
  colorClass: string;
}

const healthStatusMeta: Record<HealthStatus, Label> = {
  [HealthStatus.HEALTHY]: {
    label: "Khỏe mạnh",
    colorClass: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  [HealthStatus.SICK]: {
    label: "Bị bệnh",
    colorClass: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  [HealthStatus.WARNING]: {
    label: "Cảnh báo",
    colorClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  [HealthStatus.DEAD]: {
    label: "Đã chết",
    colorClass: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

const breedingResultMeta: Record<BreedingResult, Label> = {
  [BreedingResult.UNKNOWN]: {
    label: "Chưa biết",
    colorClass: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  [BreedingResult.FAILED]: {
    label: "Thất bại",
    colorClass: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  [BreedingResult.PARTIAL_SUCCESS]: {
    label: "Thành công một phần",
    colorClass: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  [BreedingResult.SUCCESS]: {
    label: "Thành công",
    colorClass: "bg-green-100 text-green-700 hover:bg-green-100",
  },
};

const breedingStatusMeta: Record<BreedingStatus, Label> = {
  [BreedingStatus.PAIRING]: {
    label: "Ghép Cặp",
    colorClass: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  },
  [BreedingStatus.SPAWNED]: {
    label: "Đã Đẻ",
    colorClass: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  [BreedingStatus.EGG_BATCH]: {
    label: "Ấp trứng",
    colorClass: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
  },
  [BreedingStatus.FRY_FISH]: {
    label: "Cá Con",
    colorClass: "bg-teal-100 text-teal-700 hover:bg-teal-100",
  },
  [BreedingStatus.CLASSIFICATION]: {
    label: "Phân Loại",
    colorClass: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
  [BreedingStatus.COMPLETE]: {
    label: "Hoàn Thành",
    colorClass: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  [BreedingStatus.FAILED]: {
    label: "Thất Bại",
    colorClass: "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

const pondStatusMeta: Record<PondStatus, Label> = {
  [PondStatus.ACTIVE]: {
    label: "Đang Hoạt Động",
    colorClass:
      "text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full",
  },
  [PondStatus.EMPTY]: {
    label: "Trống",
    colorClass:
      "text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full",
  },
  [PondStatus.MAINTENANCE]: {
    label: "Bảo Trì",
    colorClass:
      "text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full",
  },
};

export default function getFishSizeLabel(size: FishSize | undefined): string {
  if (!size) return "Không xác định";
  return (
    size
      .replace(/^Under(\d+)cm$/, "< $1cm")
      .replace(/^Over(\d+)cm$/, "> $1cm")
      .replace(/^From(\d+)To(\d+)cm$/, "$1 - $2cm") || size
  );
}

export function getHealthStatusLabel(status: HealthStatus | undefined): Label {
  const defaultLabel: Label = {
    label: "Không xác định",
    colorClass: "bg-gray-100 text-gray-700",
  };

  if (!status) return defaultLabel;
  return healthStatusMeta[status] || defaultLabel;
}

export function getBreedingResultLabel(
  result: BreedingResult | undefined
): Label {
  if (!result) return breedingResultMeta[BreedingResult.UNKNOWN];
  return result && breedingResultMeta[result];
}

export function getBreedingStatusLabel(
  status: BreedingStatus | undefined
): Label {
  if (!status) {
    return { label: "Không xác định", colorClass: "bg-gray-100 text-gray-700" };
  }

  return breedingStatusMeta[status];
}

export function getPondStatusLabel(status: PondStatus | undefined): Label {
  if (!status) {
    return { label: "Không xác định", colorClass: "bg-gray-100 text-gray-700" };
  }

  return pondStatusMeta[status];
}
