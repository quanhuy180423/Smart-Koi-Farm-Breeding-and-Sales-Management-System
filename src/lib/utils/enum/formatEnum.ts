import React from "react";
import {
  BreedingResult,
  BreedingStatus,
} from "@/lib/api/services/fetchBreedingProcess";
import {
  FishSize,
  Gender,
  HealthStatus,
  SaleStatus,
} from "@/lib/api/services/fetchKoiFish";
import { PondStatus } from "@/lib/api/services/fetchPond";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import { WorkScheduleStatusEnum } from "@/lib/api/services/fetchWorkSchedule";
import { PondTypeEnum } from "@/lib/api/services/fetchPondType";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Droplets,
  Wrench,
  Activity,
} from "lucide-react";

// Giao diện chung cho các nhãn
export interface Label {
  label: string;
  colorClass: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
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

interface PondStatusLabel extends Label {
  icon: React.ComponentType<{ className?: string }>;
}

const pondStatusMeta: Record<PondStatus, PondStatusLabel> = {
  [PondStatus.ACTIVE]: {
    label: "Hoạt Động",
    colorClass: "bg-green-100 text-green-800",
    icon: Activity,
  },
  [PondStatus.EMPTY]: {
    label: "Trống",
    colorClass: "bg-gray-100 text-gray-700",
    icon: Droplets,
  },
  [PondStatus.MAINTENANCE]: {
    label: "Bảo Trì",
    colorClass: "bg-yellow-100 text-yellow-800",
    icon: Wrench,
  },
};

const workScheduleStatusMeta: Record<WorkScheduleStatusEnum, Label> = {
  [WorkScheduleStatusEnum.Pending]: {
    label: "Chờ xử lý",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  [WorkScheduleStatusEnum.InProgress]: {
    label: "Đang thực hiện",
    colorClass: "bg-blue-100 text-blue-800",
  },
  [WorkScheduleStatusEnum.Completed]: {
    label: "Hoàn thành",
    colorClass: "bg-green-100 text-green-800",
  },
  [WorkScheduleStatusEnum.Incomplete]: {
    label: "Chưa hoàn thành",
    colorClass: "bg-orange-100 text-orange-800",
  },
  [WorkScheduleStatusEnum.Cancelled]: {
    label: "Hủy",
    colorClass: "bg-red-100 text-red-800",
  },
};

const pondTypeMeta: Record<PondTypeEnum, Label> = {
  [PondTypeEnum.Paring]: {
    label: "Ghép Cặp",
    colorClass: "bg-indigo-100 text-indigo-800",
  },
  [PondTypeEnum.EggBatch]: {
    label: "Ấp Trứng",
    colorClass: "bg-cyan-100 text-cyan-800",
  },
  [PondTypeEnum.FryFish]: {
    label: "Cá Con",
    colorClass: "bg-teal-100 text-teal-800",
  },
  [PondTypeEnum.Classification]: {
    label: "Tuyển Chọn",
    colorClass: "bg-purple-100 text-purple-800",
  },
  [PondTypeEnum.MarketPond]: {
    label: "Ao Thương Mại",
    colorClass: "bg-pink-100 text-pink-800",
  },
  [PondTypeEnum.BroodStock]: {
    label: "Cơ Sở Giống",
    colorClass: "bg-emerald-100 text-emerald-800",
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
  defaultLabel: Label = DEFAULT_LABEL,
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

export function getPondStatusLabel(status?: PondStatus): PondStatusLabel {
  if (!status || !pondStatusMeta[status]) {
    return {
      label: "Không xác định",
      colorClass: "bg-gray-100 text-gray-700",
      icon: AlertCircle,
    };
  }
  return pondStatusMeta[status];
}

export function getWorkScheduleStatusLabel(
  status?: WorkScheduleStatusEnum,
): Label {
  return getLabelForEnum(status, workScheduleStatusMeta);
}

export function getPondTypeLabel(type?: PondTypeEnum): Label {
  return getLabelForEnum(type, pondTypeMeta);
}

/**
 * Get work schedule status color class
 * @param status The work schedule status
 * @returns Tailwind CSS color classes
 */
export function getWorkScheduleStatusColor(
  status?: WorkScheduleStatusEnum,
): string {
  return getWorkScheduleStatusLabel(status).colorClass;
}

/**
 * Get work schedule status text label
 * @param status The work schedule status
 * @returns Status label text in Vietnamese
 */
export function getWorkScheduleStatusText(
  status?: WorkScheduleStatusEnum,
): string {
  return getWorkScheduleStatusLabel(status).label;
}

// --- ORDER STATUS METADATA ---

// Type for order status labels (icon is always ComponentType for order status)
export interface OrderStatusLabel extends Label {
  icon: React.ComponentType<{ className?: string }>;
}

const orderStatusMeta: Record<OrderStatus, OrderStatusLabel> = {
  [OrderStatus.CREATED]: {
    label: "Được tạo",
    colorClass: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  [OrderStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    colorClass: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  [OrderStatus.PENDING_PAYMENT]: {
    label: "Chờ thanh toán",
    colorClass: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao",
    colorClass: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    colorClass: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  [OrderStatus.COMPLETED]: {
    label: "Hoàn thành",
    colorClass: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  [OrderStatus.PAID]: {
    label: "Đã thanh toán",
    colorClass: "bg-emerald-100 text-emerald-800",
    icon: CheckCircle,
  },
};

// --- ORDER STATUS FUNCTIONS ---

/**
 * Get label, color class, and icon for an OrderStatus
 * @param status The order status
 * @returns OrderStatusLabel with label, colorClass, and icon
 */
export function getOrderStatusLabel(
  status?: OrderStatus | string,
): OrderStatusLabel {
  if (!status || !orderStatusMeta[status as OrderStatus]) {
    return {
      label: "Không xác định",
      colorClass: "bg-gray-100 text-gray-800",
      icon: Clock,
    };
  }
  return orderStatusMeta[status as OrderStatus];
}

/**
 * Get status text label
 * @param status The order status
 * @returns Status label text in Vietnamese
 */
export function getOrderStatusText(status?: OrderStatus | string): string {
  return getOrderStatusLabel(status).label;
}

/**
 * Get status color class
 * @param status The order status
 * @returns Tailwind CSS color classes
 */
export function getOrderStatusColor(status?: OrderStatus | string): string {
  return getOrderStatusLabel(status).colorClass;
}

/**
 * Get status icon component
 * @param status The order status
 * @returns React component (icon)
 */
export function getOrderStatusIcon(
  status?: OrderStatus | string,
): React.ComponentType<{ className?: string }> {
  return getOrderStatusLabel(status).icon;
}

/**
 * Check if order is in a completed state
 * @param status The order status
 * @returns true if order is completed
 */
export function isOrderCompleted(status?: OrderStatus | string): boolean {
  return status === OrderStatus.COMPLETED;
}

/**
 * Get order status timeline
 * @param currentStatus The current order status
 * @returns Array of status timeline steps
 */
export function getOrderStatusTimeline(
  currentStatus?: OrderStatus | string,
): Array<{
  status: OrderStatus;
  text: string;
  active: boolean;
}> {
  const timeline = [
    {
      status: OrderStatus.CREATED,
      text: "Chờ xác nhận",
      active: false,
    },
    {
      status: OrderStatus.CONFIRMED,
      text: "Đã xác nhận",
      active: false,
    },
    {
      status: OrderStatus.SHIPPED,
      text: "Đang giao",
      active: false,
    },
    {
      status: OrderStatus.COMPLETED,
      text: "Hoàn thành",
      active: false,
    },
  ];

  let activeIndex = -1;
  switch (currentStatus) {
    case OrderStatus.CREATED:
      activeIndex = 0;
      break;
    case OrderStatus.CONFIRMED:
      activeIndex = 1;
      break;
    case OrderStatus.SHIPPED:
      activeIndex = 2;
      break;
    case OrderStatus.COMPLETED:
      activeIndex = 3;
      break;
  }

  // Mark all statuses up to and including activeIndex as active
  return timeline.map((step, index) => ({
    ...step,
    active: activeIndex >= index,
  }));
}
