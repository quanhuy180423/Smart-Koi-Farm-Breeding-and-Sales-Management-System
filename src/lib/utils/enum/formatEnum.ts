import {
  BreedingResult,
  BreedingStatus,
} from "@/lib/api/services/fetchBreedingProcess";
import {
  FishSize,
  Gender,
  HealthStatus,
  SaleStatus, // 👈 Thêm SaleStatus
} from "@/lib/api/services/fetchKoiFish";
import { PondStatus } from "@/lib/api/services/fetchPond";

// Giao diện chung cho các nhãn
export interface Label {
  label: string;
  colorClass: string;
  icon?: React.ReactNode; // Thêm icon (tùy chọn)
}

// --- METADATA CHO CÁC ENUM ---

const healthStatusMeta: Record<HealthStatus, Label> = {
  [HealthStatus.HEALTHY]: {
    label: "Khỏe mạnh",
    colorClass: "bg-green-100 text-green-800",
  },
  [HealthStatus.SICK]: {
    label: "Bị bệnh",
    colorClass: "bg-red-100 text-red-800",
  },
  [HealthStatus.WARNING]: {
    label: "Cảnh báo",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  [HealthStatus.DEAD]: {
    label: "Đã chết",
    colorClass: "bg-gray-200 text-gray-800",
  },
};

const genderMeta: Record<Gender, Label> = {
  [Gender.MALE]: { label: "Đực", colorClass: "text-blue-600" },
  [Gender.FEMALE]: { label: "Cái", colorClass: "text-pink-600" },
  [Gender.UNKNOWN]: { label: "Chưa rõ", colorClass: "text-gray-500" },
};

const saleStatusMeta: Record<SaleStatus, Label> = {
  [SaleStatus.AVAILABLE]: {
    label: "Có sẵn",
    colorClass: "bg-green-100 text-green-800",
  },
  [SaleStatus.RESERVED]: {
    label: "Đã cọc",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  [SaleStatus.SOLD]: { label: "Đã bán", colorClass: "bg-red-100 text-red-800" },
  [SaleStatus.NOT_FOR_SALE]: {
    label: "Không bán",
    colorClass: "bg-gray-200 text-gray-800",
  },
};

const breedingResultMeta: Record<BreedingResult, Label> = {
  [BreedingResult.UNKNOWN]: {
    label: "Chưa biết",
    colorClass: "bg-gray-100 text-gray-700",
  },
  [BreedingResult.FAILED]: {
    label: "Thất bại",
    colorClass: "bg-red-100 text-red-700",
  },
  [BreedingResult.PARTIAL_SUCCESS]: {
    label: "Thành công một phần",
    colorClass: "bg-yellow-100 text-yellow-700",
  },
  [BreedingResult.SUCCESS]: {
    label: "Thành công",
    colorClass: "bg-green-100 text-green-700",
  },
};

const breedingStatusMeta: Record<BreedingStatus, Label> = {
  [BreedingStatus.PAIRING]: {
    label: "Ghép Cặp",
    colorClass: "bg-indigo-100 text-indigo-700",
  },
  [BreedingStatus.SPAWNED]: {
    label: "Đã Đẻ",
    colorClass: "bg-yellow-100 text-yellow-700",
  },
  [BreedingStatus.EGG_BATCH]: {
    label: "Ấp trứng",
    colorClass: "bg-cyan-100 text-cyan-700",
  },
  [BreedingStatus.FRY_FISH]: {
    label: "Cá Con",
    colorClass: "bg-teal-100 text-teal-700",
  },
  [BreedingStatus.CLASSIFICATION]: {
    label: "Phân Loại",
    colorClass: "bg-purple-100 text-purple-700",
  },
  [BreedingStatus.COMPLETE]: {
    label: "Hoàn Thành",
    colorClass: "bg-green-100 text-green-700",
  },
  [BreedingStatus.FAILED]: {
    label: "Thất Bại",
    colorClass: "bg-red-100 text-red-700",
  },
};

const pondStatusMeta: Record<PondStatus, Label> = {
  [PondStatus.ACTIVE]: {
    label: "Hoạt Động",
    colorClass: "bg-green-100 text-green-800",
  },
  [PondStatus.EMPTY]: {
    label: "Trống",
    colorClass: "bg-gray-200 text-gray-800",
  },
  [PondStatus.MAINTENANCE]: {
    label: "Bảo Trì",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
};

const DEFAULT_LABEL: Label = {
  label: "Không xác định",
  colorClass: "bg-gray-100 text-gray-700",
};

/**
 * Hàm generic để lấy thông tin nhãn cho một enum bất kỳ.
 * @param value Giá trị của enum.
 * @param meta Object metadata tương ứng.
 * @param defaultLabel Nhãn mặc định nếu không tìm thấy.
 * @returns {Label}
 */
function getLabelForEnum<T extends string>(
  value: T | undefined,
  meta: Record<T, Label>,
  defaultLabel: Label = DEFAULT_LABEL
): Label {
  if (!value || !meta[value]) {
    return defaultLabel;
  }
  return meta[value];
}

export function getFishSizeLabel(size?: FishSize): string {
  if (!size) return "Không xác định";
  return (
    size
      .replace(/^Under(\d+)cm$/, "< $1cm")
      .replace(/^Over(\d+)cm$/, "> $1cm")
      .replace(/^From(\d+)To(\d+)cm$/, "$1 - $2cm") || size
  );
}

export function getHealthStatusLabel(status?: HealthStatus): Label {
  return getLabelForEnum(status, healthStatusMeta);
}

export function getGenderLabel(gender?: Gender): Label {
  return getLabelForEnum(gender, genderMeta);
}

export function getSaleStatusLabel(status?: SaleStatus): Label {
  return getLabelForEnum(status, saleStatusMeta);
}

export function getBreedingResultLabel(result?: BreedingResult): Label {
  return getLabelForEnum(result, breedingResultMeta);
}

export function getBreedingStatusLabel(status?: BreedingStatus): Label {
  return getLabelForEnum(status, breedingStatusMeta);
}

export function getPondStatusLabel(status?: PondStatus): Label {
  return getLabelForEnum(status, pondStatusMeta);
}
