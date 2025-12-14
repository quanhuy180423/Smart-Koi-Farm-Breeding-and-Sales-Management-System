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
  KoiBreedingStatus,
} from "@/lib/api/services/fetchKoiFish";
import { PondStatus, PondTypeEnum } from "@/lib/api/services/fetchPond";
import { OrderStatus } from "@/lib/api/services/fetchOrder";
import { WorkScheduleStatusEnum } from "@/lib/api/services/fetchWorkSchedule";
import { Roles } from "@/lib/api/services/fetchAuth";
import {
  IncidentSeverity,
  IncidentStatus,
} from "@/lib/api/services/fetchIncident";
import {
  Severity as WaterAlertSeverity,
  AlertType,
} from "@/lib/api/services/fetchWaterAlert";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Droplets,
  Wrench,
  Activity,
  Mars,
  Venus,
  LucideIcon,
  RotateCcw,
} from "lucide-react";

// Giao diện chung cho các nhãn
export interface Label {
  label: string;
  colorClass: string;
  icon?:
    | React.ReactNode
    | React.ComponentType<{ className?: string }>
    | LucideIcon;
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

const userGenderMeta: Record<Gender, Label> = {
  [Gender.MALE]: { label: "Nam", colorClass: "text-blue-600", icon: Mars },
  [Gender.FEMALE]: { label: "Nữ", colorClass: "text-pink-600", icon: Venus },
  [Gender.UNKNOWN]: { label: "Khác", colorClass: "text-gray-500" },
};

const saleStatusMeta: Record<SaleStatus, Label> = {
  [SaleStatus.AVAILABLE]: {
    label: "Có sẵn",
    colorClass: "bg-green-100 text-green-800",
  },
  [SaleStatus.SOLD]: { label: "Đã bán", colorClass: "bg-red-100 text-red-800" },
  [SaleStatus.NOT_FOR_SALE]: {
    label: "Không bán",
    colorClass: "bg-gray-200 text-gray-800",
  },
  [SaleStatus.PENDING_SALE]: {
    label: "Chờ bán",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
};

const koiBreedingStatusMeta: Record<KoiBreedingStatus, Label> = {
  [KoiBreedingStatus.READY]: {
    label: "Sẵn sàng sinh sản",
    colorClass: "bg-green-100 text-green-800",
  },
  [KoiBreedingStatus.SPAWNING]: {
    label: "Đang sinh sản",
    colorClass: "bg-blue-100 text-blue-800",
  },
  [KoiBreedingStatus.POST_SPAWNING]: {
    label: "Hậu sinh sản",
    colorClass: "bg-orange-100 text-orange-800",
  },
  [KoiBreedingStatus.NOT_MATURE]: {
    label: "Chưa trưởng thành",
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
  [PondTypeEnum.PARING]: {
    label: "Ghép Cặp",
    colorClass: "bg-indigo-100 text-indigo-800",
  },
  [PondTypeEnum.EGG_BATCH]: {
    label: "Ấp Trứng",
    colorClass: "bg-cyan-100 text-cyan-800",
  },
  [PondTypeEnum.FRY_FISH]: {
    label: "Cá Con",
    colorClass: "bg-teal-100 text-teal-800",
  },
  [PondTypeEnum.CLASSIFICATION]: {
    label: "Tuyển Chọn",
    colorClass: "bg-purple-100 text-purple-800",
  },
  [PondTypeEnum.MARKET_POND]: {
    label: "Ao Thương Mại",
    colorClass: "bg-pink-100 text-pink-800",
  },
  [PondTypeEnum.BROOD_STOCK]: {
    label: "Cơ Sở Giống",
    colorClass: "bg-emerald-100 text-emerald-800",
  },
  [PondTypeEnum.QUARANTINE]: {
    label: "Cách Ly",
    colorClass: "bg-red-100 text-red-800",
  },
};

const rolesMeta: Record<Roles, Label> = {
  [Roles.Manager]: {
    label: "Quản lý",
    colorClass: "bg-red-100 text-red-800",
  },
  [Roles.FarmStaff]: {
    label: "Nhân viên trang trại",
    colorClass: "bg-green-100 text-green-800",
  },
  [Roles.SaleStaff]: {
    label: "Nhân viên bán hàng",
    colorClass: "bg-blue-100 text-blue-800",
  },
  [Roles.Customer]: {
    label: "Khách hàng",
    colorClass: "bg-gray-100 text-gray-800",
  },
};

const incidentSeverityMeta: Record<IncidentSeverity, Label> = {
  [IncidentSeverity.LOW]: {
    label: "Thấp",
    colorClass: "bg-blue-100 text-blue-800",
  },
  [IncidentSeverity.MEDIUM]: {
    label: "Trung bình",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  [IncidentSeverity.HIGH]: {
    label: "Cao",
    colorClass: "bg-orange-100 text-orange-800",
  },
  [IncidentSeverity.URGENT]: {
    label: "Khẩn cấp",
    colorClass: "bg-red-100 text-red-800",
  },
};

const incidentStatusMeta: Record<IncidentStatus, Label> = {
  [IncidentStatus.REPORTED]: {
    label: "Đã báo cáo",
    colorClass: "bg-blue-100 text-blue-800",
  },
  [IncidentStatus.INVESTIGATING]: {
    label: "Đang điều tra",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  [IncidentStatus.RESOLVED]: {
    label: "Đã giải quyết",
    colorClass: "bg-green-100 text-green-800",
  },
  [IncidentStatus.CANCELLED]: {
    label: "Đã hủy",
    colorClass: "bg-gray-100 text-gray-800",
  },
};

const waterAlertSeverityMeta: Record<WaterAlertSeverity, Label> = {
  [WaterAlertSeverity.LOW]: {
    label: "Thấp",
    colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  [WaterAlertSeverity.MEDIUM]: {
    label: "Trung bình",
    colorClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  [WaterAlertSeverity.HIGH]: {
    label: "Cao",
    colorClass: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
  [WaterAlertSeverity.URGENT]: {
    label: "Khẩn cấp",
    colorClass: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

const alertTypeMeta: Record<AlertType, Label> = {
  [AlertType.HIGH]: {
    label: "Cao",
    colorClass: "text-gray-700",
  },
  [AlertType.LOW]: {
    label: "Thấp",
    colorClass: "text-gray-700",
  },
  [AlertType.RAPID_CHANGE]: {
    label: "Thay đổi nhanh",
    colorClass: "text-gray-700",
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

export function getFishSizeLabel(size?: FishSize | string): string {
  if (!size) return "Không xác định";

  const sizeStr = String(size);

  // Handle Hirenaga variants: "From50_1To60cm_Hirenaga" -> "50.1 - 60cm (Hirenaga)"
  if (sizeStr.includes("_Hirenaga")) {
    return sizeStr
      .replace(/^From(\d+)_(\d+)To(\d+)cm_Hirenaga$/, "$1.$2 - $3cm (Hirenaga)")
      .replace(/^From(\d+)To(\d+)cm_Hirenaga$/, "$1 - $2cm (Hirenaga)");
  }

  // Handle regular ranges with decimal notation: "From25_1To30cm" -> "25.1 - 30cm"
  if (sizeStr.includes("_")) {
    return sizeStr.replace(/^From(\d+)_(\d+)To(\d+)cm$/, "$1.$2 - $3cm");
  }

  // Handle regular ranges: "From20To25cm" -> "20 - 25cm"
  if (sizeStr.startsWith("From") && sizeStr.endsWith("cm")) {
    return sizeStr.replace(/^From(\d+)To(\d+)cm$/, "$1 - $2cm");
  }

  // Handle "Over" format: "Over83_1cm" -> "> 83.1cm"
  if (sizeStr.startsWith("Over")) {
    return sizeStr
      .replace(/^Over(\d+)_(\d+)cm$/, "> $1.$2cm")
      .replace(/^Over(\d+)cm$/, "> $1cm");
  }

  // Fallback: return as-is
  return sizeStr;
}

/**
 * Format a size range string like "21-30" to "21cm - 30cm"
 * @param rangeString The range string in format "min-max"
 * @returns Formatted string with cm units
 */
export function formatSizeRange(rangeString?: string): string {
  if (!rangeString) return "Không xác định";

  // Check if it's already in the format "num-num"
  const rangeMatch = rangeString.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (rangeMatch) {
    const [, min, max] = rangeMatch;
    return `${min}cm - ${max}cm`;
  }

  // If already formatted, return as-is
  if (rangeString.includes("cm")) {
    return rangeString;
  }

  // Fallback
  return rangeString;
}

export function getHealthStatusLabel(status?: HealthStatus): Label {
  return getLabelForEnum(status, healthStatusMeta);
}

export function getGenderLabel(gender?: Gender): Label {
  return getLabelForEnum(gender, genderMeta);
}

export function getUserGenderLabelForPerson(gender?: Gender): Label {
  return getLabelForEnum(gender, userGenderMeta);
}

export function getSaleStatusLabel(status?: SaleStatus): Label {
  return getLabelForEnum(status, saleStatusMeta);
}

export function getKoiBreedingStatusLabel(status?: KoiBreedingStatus): Label {
  return getLabelForEnum(status, koiBreedingStatusMeta);
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

export function getRoleLabel(role?: Roles): Label {
  return getLabelForEnum(role, rolesMeta);
}

export function getRoleText(role?: Roles): string {
  return getRoleLabel(role).label;
}

// --- INCIDENT FUNCTIONS ---

/**
 * Get incident severity label, color class
 * @param severity The incident severity
 * @returns Label object with label and colorClass
 */
export function getIncidentSeverityLabel(severity?: IncidentSeverity): Label {
  return getLabelForEnum(severity, incidentSeverityMeta);
}

/**
 * Get incident severity color class
 * @param severity The incident severity
 * @returns Tailwind CSS color classes
 */
export function getIncidentSeverityColor(severity?: IncidentSeverity): string {
  return getIncidentSeverityLabel(severity).colorClass;
}

/**
 * Get incident severity text
 * @param severity The incident severity
 * @returns Severity text in Vietnamese
 */
export function getIncidentSeverityText(severity?: IncidentSeverity): string {
  return getIncidentSeverityLabel(severity).label;
}

/**
 * Get incident status label, color class
 * @param status The incident status
 * @returns Label object with label and colorClass
 */
export function getIncidentStatusLabel(status?: IncidentStatus): Label {
  return getLabelForEnum(status, incidentStatusMeta);
}

/**
 * Get incident status color class
 * @param status The incident status
 * @returns Tailwind CSS color classes
 */
export function getIncidentStatusColor(status?: IncidentStatus): string {
  return getIncidentStatusLabel(status).colorClass;
}

/**
 * Get incident status text
 * @param status The incident status
 * @returns Status text in Vietnamese
 */
export function getIncidentStatusText(status?: IncidentStatus): string {
  return getIncidentStatusLabel(status).label;
}

// --- WATER ALERT FUNCTIONS ---

/**
 * Get water alert severity label, color class
 * @param severity The water alert severity
 * @returns Label object with label and colorClass
 */
export function getWaterAlertSeverityLabel(
  severity?: WaterAlertSeverity,
): Label {
  return getLabelForEnum(severity, waterAlertSeverityMeta);
}

/**
 * Get water alert severity color class
 * @param severity The water alert severity
 * @returns Tailwind CSS color classes
 */
export function getWaterAlertSeverityColor(
  severity?: WaterAlertSeverity,
): string {
  return getWaterAlertSeverityLabel(severity).colorClass;
}

/**
 * Get water alert severity text
 * @param severity The water alert severity
 * @returns Severity text in Vietnamese
 */
export function getWaterAlertSeverityText(
  severity?: WaterAlertSeverity,
): string {
  return getWaterAlertSeverityLabel(severity).label;
}

/**
 * Get alert type label
 * @param alertType The alert type
 * @returns Label object with label and colorClass
 */
export function getAlertTypeLabel(alertType?: AlertType): Label {
  return getLabelForEnum(alertType, alertTypeMeta);
}

/**
 * Get alert type text
 * @param alertType The alert type
 * @returns Alert type text in Vietnamese
 */
export function getAlertTypeText(alertType?: AlertType): string {
  return getAlertTypeLabel(alertType).label;
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
  [OrderStatus.PENDING]: {
    label: "Chờ thanh toán",
    colorClass: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  [OrderStatus.PROCESSING]: {
    label: "Đang xử lý",
    colorClass: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  [OrderStatus.UNSHIPPING]: {
    label: "Không thể giao",
    colorClass: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  [OrderStatus.SHIPPED]: {
    label: "Đang giao",
    colorClass: "bg-cyan-100 text-cyan-800",
    icon: Clock,
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    colorClass: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  [OrderStatus.REJECTED]: {
    label: "Từ chối",
    colorClass: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  [OrderStatus.DELIVERED]: {
    label: "Đã giao",
    colorClass: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  [OrderStatus.REFUND]: {
    label: "Hoàn tiền",
    colorClass: "bg-purple-100 text-purple-800",
    icon: RotateCcw,
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
 * @returns true if order is delivered or refunded
 */
export function isOrderCompleted(status?: OrderStatus | string): boolean {
  return status === OrderStatus.DELIVERED || status === OrderStatus.REFUND;
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
      status: OrderStatus.PROCESSING,
      text: "Đang xử lý",
      active: false,
    },
    {
      status: OrderStatus.SHIPPED,
      text: "Đang giao",
      active: false,
    },
    {
      status: OrderStatus.DELIVERED,
      text: "Đã giao",
      active: false,
    },
  ];

  let activeIndex = -1;
  switch (currentStatus) {
    case OrderStatus.PROCESSING:
      activeIndex = 0;
      break;
    case OrderStatus.SHIPPED:
      activeIndex = 1;
      break;
    case OrderStatus.DELIVERED:
      activeIndex = 2;
      break;
  }

  // Mark all statuses up to and including activeIndex as active
  return timeline.map((step, index) => ({
    ...step,
    active: activeIndex >= index,
  }));
}
