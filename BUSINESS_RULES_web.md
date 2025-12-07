# 📋 Business Rules Documentation

## Smart Koi Farm - Breeding and Sales Management System

> Tài liệu tổng hợp toàn bộ Business Rules được sử dụng trong ứng dụng.

---

## 📑 Mục Lục

1. [User Roles & Authentication](#1-user-roles--authentication)
2. [Order Management](#2-order-management)
3. [Koi Fish Management](#3-koi-fish-management)
4. [Breeding Process](#4-breeding-process)
5. [Pond Management](#5-pond-management)
6. [Work Schedule](#6-work-schedule)
7. [Incident Management](#7-incident-management)
8. [Water Quality Alert](#8-water-quality-alert)
9. [Promotion & Discount](#9-promotion--discount)
10. [Cart & Checkout](#10-cart--checkout)
11. [Route Protection & Middleware](#11-route-protection--middleware)

---

## 1. User Roles & Authentication

### 1.1 Role Definitions

| Role       | Code        | Description                         | Dashboard  |
| ---------- | ----------- | ----------------------------------- | ---------- |
| Manager    | `Manager`   | Quản lý hệ thống, có toàn quyền     | `/manager` |
| Farm Staff | `FarmStaff` | Nhân viên trang trại, quản lý ao/cá | `/manager` |
| Sale Staff | `SaleStaff` | Nhân viên bán hàng                  | `/sale`    |
| Customer   | `Customer`  | Khách hàng mua cá                   | `/`        |

### 1.2 Code Reference

```typescript
// File: src/lib/api/services/fetchAuth.ts
export enum Roles {
  Manager = "Manager",
  FarmStaff = "FarmStaff",
  SaleStaff = "SaleStaff",
  Customer = "Customer",
}
```

```typescript
// File: src/lib/utils/enum/formatEnum.ts
const rolesMeta: Record<Roles, Label> = {
  [Roles.Manager]: { label: "Quản lý", colorClass: "bg-red-100 text-red-800" },
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
```

### 1.3 Authentication Rules

| Rule ID | Rule Definition                              | Implementation                           |
| ------- | -------------------------------------------- | ---------------------------------------- |
| AUTH-01 | Token được lưu trong cookie và parse từ JWT  | `src/store/auth-store.ts` - `setToken()` |
| AUTH-02 | Role được extract từ JWT payload             | `src/store/auth-store.ts` - `mapRole()`  |
| AUTH-03 | Cookie `user-role` được set khi login        | `src/store/auth-store.ts` - `login()`    |
| AUTH-04 | Logout xóa tất cả cookies và gọi API signOut | `src/store/auth-store.ts` - `logout()`   |

---

## 2. Order Management

### 2.1 Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
                   ↘           ↘
                 CANCELLED   REJECTED → REFUND
                              ↘
                           UNSHIPPING → REFUND
```

### 2.2 Order Status Definitions

| Status     | Code         | Vietnamese     | Color  | Description                      |
| ---------- | ------------ | -------------- | ------ | -------------------------------- |
| Pending    | `Pending`    | Chờ thanh toán | Orange | Đơn hàng mới tạo, chờ thanh toán |
| Processing | `Processing` | Đang xử lý     | Blue   | Đang chuẩn bị đơn hàng           |
| Shipped    | `Shipped`    | Đang giao      | Cyan   | Đơn hàng đang vận chuyển         |
| Delivered  | `Delivered`  | Đã giao        | Green  | Giao hàng thành công             |
| Cancelled  | `Cancelled`  | Đã hủy         | Red    | Đơn hàng bị hủy                  |
| Rejected   | `Rejected`   | Từ chối        | Red    | Khách từ chối nhận hàng          |
| UnShipping | `UnShiping`  | Không thể giao | Red    | Không thể giao hàng              |
| Refund     | `Refund`     | Hoàn tiền      | Purple | Đã hoàn tiền cho khách           |

### 2.3 Code Reference

```typescript
// File: src/lib/api/services/fetchOrder.ts
export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  UNSHIPPING = "UnShiping",
  SHIPPED = "Shipped",
  CANCELLED = "Cancelled",
  REJECTED = "Rejected",
  DELIVERED = "Delivered",
  REFUND = "Refund",
}
```

```typescript
// File: src/lib/utils/enum/formatEnum.ts
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
  // ... các status khác
};
```

### 2.4 Order Business Rules

| Rule ID | Rule Definition                                                      | Implementation                             |
| ------- | -------------------------------------------------------------------- | ------------------------------------------ |
| ORD-01  | Chỉ Manager có quyền thực hiện Refund                                | `src/app/(manager)/manager/orders/`        |
| ORD-02  | Sale Staff KHÔNG có quyền Refund                                     | `src/app/(sale)/sale/orders/` (đã loại bỏ) |
| ORD-03  | Refund chỉ được thực hiện khi status là `REJECTED` hoặc `UNSHIPPING` | `canRefund()` function                     |
| ORD-04  | Order status timeline: PROCESSING → SHIPPED → DELIVERED              | `getOrderStatusTimeline()`                 |
| ORD-05  | Order hoàn thành khi status là `DELIVERED` hoặc `REFUND`             | `isOrderCompleted()`                       |

### 2.5 Order Actions by Role

| Action         | Manager | Sale Staff | Customer |
| -------------- | ------- | ---------- | -------- |
| View Orders    | ✅      | ✅         | ✅ (own) |
| Update Status  | ✅      | ✅         | ❌       |
| Cancel Order   | ✅      | ✅         | ❌       |
| Process Refund | ✅      | ❌         | ❌       |

---

## 3. Koi Fish Management

### 3.1 Gender Definitions

| Gender  | Code      | Vietnamese (Fish) | Vietnamese (Human) |
| ------- | --------- | ----------------- | ------------------ |
| Male    | `Male`    | Đực               | Nam                |
| Female  | `Female`  | Cái               | Nữ                 |
| Unknown | `Unknown` | Chưa rõ           | Khác               |

### 3.2 Health Status

| Status  | Code      | Vietnamese | Color  | Description              |
| ------- | --------- | ---------- | ------ | ------------------------ |
| Healthy | `Healthy` | Khỏe mạnh  | Green  | Cá khỏe mạnh bình thường |
| Sick    | `Sick`    | Bị bệnh    | Red    | Cá đang bị bệnh          |
| Warning | `Warning` | Cảnh báo   | Yellow | Cần theo dõi             |
| Dead    | `Dead`    | Đã chết    | Gray   | Cá đã chết               |

### 3.3 Sale Status

| Status       | Code         | Vietnamese | Color | Description              |
| ------------ | ------------ | ---------- | ----- | ------------------------ |
| Available    | `Available`  | Có sẵn     | Green | Sẵn sàng để bán          |
| Sold         | `Sold`       | Đã bán     | Red   | Đã được bán              |
| Not For Sale | `NotForSale` | Không bán  | Gray  | Không trong danh mục bán |

### 3.4 Fish Size Categories

| Size Code        | Range       | Description    |
| ---------------- | ----------- | -------------- |
| `From0To19cm`    | 0 - 19cm    | Cá nhỏ         |
| `From20To25cm`   | 20 - 25cm   |                |
| `From25_1To30cm` | 25.1 - 30cm |                |
| `From30_1To40cm` | 30.1 - 40cm |                |
| `From40_1To44cm` | 40.1 - 44cm |                |
| `From44_1To50cm` | 44.1 - 50cm |                |
| `From50_1To55cm` | 50.1 - 55cm |                |
| `From55_1To60cm` | 55.1 - 60cm |                |
| `From60_1To65cm` | 60.1 - 65cm |                |
| `From65_1To73cm` | 65.1 - 73cm |                |
| `From73_1To83cm` | 73.1 - 83cm |                |
| `Over83_1cm`     | > 83.1cm    | Cá lớn         |
| `*_Hirenaga`     | Special     | Giống Hirenaga |

### 3.5 Koi Type

| Type | Code   | Description           |
| ---- | ------ | --------------------- |
| High | `High` | Cá chất lượng cao     |
| Show | `Show` | Cá dùng cho triển lãm |

### 3.6 Code Reference

```typescript
// File: src/lib/api/services/fetchKoiFish.ts
export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "Unknown",
}

export enum HealthStatus {
  HEALTHY = "Healthy",
  SICK = "Sick",
  WARNING = "Warning",
  DEAD = "Dead",
}

export enum SaleStatus {
  NOT_FOR_SALE = "NotForSale",
  AVAILABLE = "Available",
  SOLD = "Sold",
}

export enum KoiType {
  HIGH = "High",
  SHOW = "Show",
}

export enum FishSize {
  FROM_0_TO_19CM = "From0To19cm",
  FROM_20_TO_25CM = "From20To25cm",
  // ... các size khác
}
```

### 3.7 Fish Size Label Formatting

```typescript
// File: src/lib/utils/enum/formatEnum.ts
export function getFishSizeLabel(size?: FishSize | string): string {
  // "From25_1To30cm" → "25.1 - 30cm"
  // "From50_1To60cm_Hirenaga" → "50.1 - 60cm (Hirenaga)"
  // "Over83_1cm" → "> 83.1cm"
}
```

---

## 4. Breeding Process

### 4.1 Breeding Status Flow

```
PAIRING → SPAWNED → EGG_BATCH → FRY_FISH → CLASSIFICATION → COMPLETE
                                                          ↘
                                                         FAILED
```

### 4.2 Breeding Status Definitions

| Status         | Code             | Vietnamese | Color  |
| -------------- | ---------------- | ---------- | ------ |
| Pairing        | `Pairing`        | Ghép Cặp   | Indigo |
| Spawned        | `Spawned`        | Đã Đẻ      | Yellow |
| Egg Batch      | `EggBatch`       | Ấp trứng   | Cyan   |
| Fry Fish       | `FryFish`        | Cá Con     | Teal   |
| Classification | `Classification` | Phân Loại  | Purple |
| Complete       | `Complete`       | Hoàn Thành | Green  |
| Failed         | `Failed`         | Thất Bại   | Red    |

### 4.3 Breeding Result

| Result          | Code             | Vietnamese          | Color  |
| --------------- | ---------------- | ------------------- | ------ |
| Unknown         | `Unknown`        | Chưa biết           | Gray   |
| Success         | `Success`        | Thành công          | Green  |
| Partial Success | `PartialSuccess` | Thành công một phần | Yellow |
| Failed          | `Failed`         | Thất bại            | Red    |

### 4.4 Code Reference

```typescript
// File: src/lib/api/services/fetchBreedingProcess.ts
export enum BreedingStatus {
  PAIRING = "Pairing",
  SPAWNED = "Spawned",
  EGG_BATCH = "EggBatch",
  FRY_FISH = "FryFish",
  CLASSIFICATION = "Classification",
  COMPLETE = "Complete",
  FAILED = "Failed",
}

export enum BreedingResult {
  UNKNOWN = "Unknown",
  SUCCESS = "Success",
  FAILED = "Failed",
  PARTIAL_SUCCESS = "PartialSuccess",
}
```

### 4.5 Breeding Business Rules

| Rule ID | Rule Definition                                    |
| ------- | -------------------------------------------------- |
| BRD-01  | Cần 1 cá đực + 1 cá cái để ghép cặp                |
| BRD-02  | Breeding process có thể bị cancel                  |
| BRD-03  | AI có thể đề xuất cặp ghép tối ưu                  |
| BRD-04  | Tính toán tỷ lệ thụ tinh, tỷ lệ nở, tỷ lệ sống sót |

---

## 5. Pond Management

### 5.1 Pond Status

| Status      | Code          | Vietnamese | Color  | Icon     |
| ----------- | ------------- | ---------- | ------ | -------- |
| Active      | `Active`      | Hoạt Động  | Green  | Activity |
| Empty       | `Empty`       | Trống      | Gray   | Droplets |
| Maintenance | `Maintenance` | Bảo Trì    | Yellow | Wrench   |

### 5.2 Pond Types

| Type           | Code             | Vietnamese    | Purpose              |
| -------------- | ---------------- | ------------- | -------------------- |
| Paring         | `Paring`         | Ghép Cặp      | Ao ghép cặp sinh sản |
| Egg Batch      | `EggBatch`       | Ấp Trứng      | Ao ấp trứng          |
| Fry Fish       | `FryFish`        | Cá Con        | Ao nuôi cá con       |
| Classification | `Classification` | Tuyển Chọn    | Ao phân loại cá      |
| Market Pond    | `MarketPond`     | Ao Thương Mại | Ao cá bán            |
| Brood Stock    | `BroodStock`     | Cơ Sở Giống   | Ao cá giống          |
| Quarantine     | `Quarantine`     | Cách Ly       | Ao cách ly cá bệnh   |

### 5.3 Code Reference

```typescript
// File: src/lib/api/services/fetchPond.ts
export enum PondStatus {
  EMPTY = "Empty",
  ACTIVE = "Active",
  MAINTENANCE = "Maintenance",
}

export enum PondTypeEnum {
  PARING = "Paring",
  EGG_BATCH = "EggBatch",
  FRY_FISH = "FryFish",
  CLASSIFICATION = "Classification",
  MARKET_POND = "MarketPond",
  BROOD_STOCK = "BroodStock",
  QUARANTINE = "Quarantine",
}
```

---

## 6. Work Schedule

### 6.1 Work Schedule Status

| Status      | Code         | Vietnamese      | Color  |
| ----------- | ------------ | --------------- | ------ |
| Pending     | `Pending`    | Chờ xử lý       | Yellow |
| In Progress | `InProgress` | Đang thực hiện  | Blue   |
| Completed   | `Completed`  | Hoàn thành      | Green  |
| Incomplete  | `Incomplete` | Chưa hoàn thành | Orange |
| Cancelled   | `Cancelled`  | Hủy             | Red    |

### 6.2 Code Reference

```typescript
// File: src/lib/api/services/fetchWorkSchedule.ts
export enum WorkScheduleStatusEnum {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Incomplete = "Incomplete",
  Cancelled = "Cancelled",
}
```

### 6.3 Work Schedule Rules

| Rule ID | Rule Definition                              |
| ------- | -------------------------------------------- |
| WRK-01  | Một task có thể gán cho nhiều nhân viên      |
| WRK-02  | Một task có thể liên quan đến nhiều ao       |
| WRK-03  | Nhân viên có thể ghi chú khi hoàn thành task |

---

## 7. Incident Management

### 7.1 Incident Severity

| Severity | Code     | Vietnamese | Color  | Priority |
| -------- | -------- | ---------- | ------ | -------- |
| Low      | `Low`    | Thấp       | Blue   | 4        |
| Medium   | `Medium` | Trung bình | Yellow | 3        |
| High     | `High`   | Cao        | Orange | 2        |
| Urgent   | `Urgent` | Khẩn cấp   | Red    | 1        |

### 7.2 Incident Status

| Status        | Code            | Vietnamese    | Color  |
| ------------- | --------------- | ------------- | ------ |
| Reported      | `Reported`      | Đã báo cáo    | Blue   |
| Investigating | `Investigating` | Đang điều tra | Yellow |
| Resolved      | `Resolved`      | Đã giải quyết | Green  |
| Cancelled     | `Cancelled`     | Đã hủy        | Gray   |

### 7.3 Affected Status (Koi Incident)

| Status  | Code      | Vietnamese |
| ------- | --------- | ---------- |
| Healthy | `Healthy` | Khỏe mạnh  |
| Warning | `Warning` | Cảnh báo   |
| Sick    | `Sick`    | Bị bệnh    |

### 7.4 Code Reference

```typescript
// File: src/lib/api/services/fetchIncident.ts
export enum IncidentSeverity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

export enum IncidentStatus {
  REPORTED = "Reported",
  INVESTIGATING = "Investigating",
  RESOLVED = "Resolved",
  CANCELLED = "Cancelled",
}

export enum AffectedStatus {
  HEALTHY = "Healthy",
  WARNING = "Warning",
  SICK = "Sick",
}
```

---

## 8. Water Quality Alert

### 8.1 Alert Severity

| Severity | Code     | Vietnamese | Color  |
| -------- | -------- | ---------- | ------ |
| Low      | `Low`    | Thấp       | Blue   |
| Medium   | `Medium` | Trung bình | Yellow |
| High     | `High`   | Cao        | Orange |
| Urgent   | `Urgent` | Khẩn cấp   | Red    |

### 8.2 Alert Type

| Type         | Code          | Vietnamese     | Description               |
| ------------ | ------------- | -------------- | ------------------------- |
| High         | `High`        | Cao            | Thông số vượt ngưỡng cao  |
| Low          | `Low`         | Thấp           | Thông số dưới ngưỡng thấp |
| Rapid Change | `RapidChange` | Thay đổi nhanh | Thay đổi đột ngột         |

### 8.3 Code Reference

```typescript
// File: src/lib/api/services/fetchWaterAlert.ts
export enum AlertType {
  HIGH = "High",
  LOW = "Low",
  RAPID_CHANGE = "RapidChange",
}

export enum Severity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}
```

### 8.4 Water Parameter Rules

| Rule ID | Rule Definition                                       |
| ------- | ----------------------------------------------------- |
| WTR-01  | Giám sát pH, nhiệt độ, oxy, ammonia, nitrite, nitrate |
| WTR-02  | Cảnh báo khi vượt ngưỡng threshold                    |
| WTR-03  | Cảnh báo khi thay đổi đột ngột                        |
| WTR-04  | Alert có thể được đánh dấu resolved                   |

---

## 9. Promotion & Discount

### 9.1 Discount Type

| Type         | Code          | Description          |
| ------------ | ------------- | -------------------- |
| Fixed Amount | `FixedAmount` | Giảm số tiền cố định |
| Percentage   | `Percentage`  | Giảm theo phần trăm  |

### 9.2 Code Reference

```typescript
// File: src/lib/api/services/fetchPromotion.ts
export enum DiscountType {
  FixedAmount = "FixedAmount",
  Percentage = "Percentage",
}

export interface PromotionResponse {
  id: number;
  code: string;
  description: string;
  validFrom: string;
  validTo: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
}
```

### 9.3 Promotion Rules

| Rule ID | Rule Definition                                         |
| ------- | ------------------------------------------------------- |
| PRM-01  | Promotion có thời hạn sử dụng (validFrom - validTo)     |
| PRM-02  | Có thể set giới hạn số lần sử dụng (usageLimit)         |
| PRM-03  | Yêu cầu giá trị đơn hàng tối thiểu (minimumOrderAmount) |
| PRM-04  | Giới hạn số tiền giảm tối đa (maxDiscountAmount)        |
| PRM-05  | Promotion có thể active/inactive                        |

---

## 10. Cart & Checkout

### 10.1 Cart Rules

| Rule ID | Rule Definition                                | Implementation            |
| ------- | ---------------------------------------------- | ------------------------- |
| CRT-01  | Cart được lưu local với Zustand persist        | `src/store/cart-store.ts` |
| CRT-02  | Có thể thêm Koi Fish hoặc Packet Fish vào cart | `CartItemRequest`         |
| CRT-03  | Kiểm tra item đã có trong cart trước khi thêm  | `addItem()`               |
| CRT-04  | Quantity tự động tăng nếu item đã tồn tại      | `addItem()`               |
| CRT-05  | Remove item nếu quantity <= 0                  | `updateQuantity()`        |

### 10.2 Code Reference

```typescript
// File: src/store/cart-store.ts
addItem: (newItem) => {
  const { items } = get();
  const existingItem = items.find((item) => item.id === newItem.id);

  if (existingItem) {
    // Tăng số lượng nếu item đã tồn tại
    set({
      items: items.map((item) =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    });
  } else {
    // Thêm item mới với quantity = 1
    set({
      items: [...items, { ...newItem, quantity: 1 }],
    });
  }
},
```

### 10.3 Checkout Rules

| Rule ID | Rule Definition                                     |
| ------- | --------------------------------------------------- |
| CHK-01  | Phải chọn địa chỉ giao hàng                         |
| CHK-02  | Phí ship được tính dựa trên khoảng cách và loại box |
| CHK-03  | Cart được convert sang Order khi checkout           |

### 10.4 Shipping Fee Calculation

```typescript
// File: src/lib/api/services/fetchShippingFee.ts
export interface ShippingFeeCalculateResponse {
  boxFee: number; // Phí theo loại box
  distanceFee: number; // Phí theo khoảng cách
  totalShippingFee: number; // Tổng phí ship
  boxes: ShippingBox[]; // Chi tiết các box sử dụng
}
```

---

## 11. Route Protection & Middleware

### 11.1 Protected Routes

| Route Pattern | Allowed Roles            |
| ------------- | ------------------------ |
| `/manager/*`  | Manager                  |
| `/sale/*`     | SaleStaff                |
| `/profile/*`  | Customer (authenticated) |
| `/`           | Public                   |

### 11.2 Auth Routes

| Route              | Description     |
| ------------------ | --------------- |
| `/login`           | Trang đăng nhập |
| `/register`        | Trang đăng ký   |
| `/forgot-password` | Quên mật khẩu   |
| `/verify-email`    | Xác thực email  |

### 11.3 Code Reference

```typescript
// File: src/middleware.ts
const PROTECTED_ROUTES = {
  "/manager": [Roles.Manager],
  "/sale": [Roles.SaleStaff],
};

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
];
```

### 11.4 Middleware Rules

| Rule ID | Rule Definition                                | Implementation                            |
| ------- | ---------------------------------------------- | ----------------------------------------- |
| MID-01  | User đã login không thể vào trang auth         | Redirect về dashboard                     |
| MID-02  | User chưa login không thể vào protected routes | Redirect về `/login` với param `redirect` |
| MID-03  | User sai role bị redirect về dashboard đúng    | Check `allowedRoles`                      |
| MID-04  | Cookie `user-role` được sử dụng để check quyền | `request.cookies.get("user-role")`        |

---

## 📌 Quick Reference - All Enums

### Status Enums

| Domain        | Enum Name                | File Location                                  |
| ------------- | ------------------------ | ---------------------------------------------- |
| Order         | `OrderStatus`            | `src/lib/api/services/fetchOrder.ts`           |
| Koi Fish      | `HealthStatus`           | `src/lib/api/services/fetchKoiFish.ts`         |
| Koi Fish      | `SaleStatus`             | `src/lib/api/services/fetchKoiFish.ts`         |
| Breeding      | `BreedingStatus`         | `src/lib/api/services/fetchBreedingProcess.ts` |
| Breeding      | `BreedingResult`         | `src/lib/api/services/fetchBreedingProcess.ts` |
| Pond          | `PondStatus`             | `src/lib/api/services/fetchPond.ts`            |
| Work Schedule | `WorkScheduleStatusEnum` | `src/lib/api/services/fetchWorkSchedule.ts`    |
| Incident      | `IncidentStatus`         | `src/lib/api/services/fetchIncident.ts`        |
| Incident      | `IncidentSeverity`       | `src/lib/api/services/fetchIncident.ts`        |
| Water Alert   | `AlertType`              | `src/lib/api/services/fetchWaterAlert.ts`      |
| Water Alert   | `Severity`               | `src/lib/api/services/fetchWaterAlert.ts`      |

### Type Enums

| Domain    | Enum Name      | File Location                            |
| --------- | -------------- | ---------------------------------------- |
| User      | `Roles`        | `src/lib/api/services/fetchAuth.ts`      |
| Koi Fish  | `Gender`       | `src/lib/api/services/fetchKoiFish.ts`   |
| Koi Fish  | `KoiType`      | `src/lib/api/services/fetchKoiFish.ts`   |
| Koi Fish  | `FishSize`     | `src/lib/api/services/fetchKoiFish.ts`   |
| Koi Fish  | `Pattern`      | `src/lib/api/services/fetchKoiFish.ts`   |
| Pond      | `PondTypeEnum` | `src/lib/api/services/fetchPond.ts`      |
| Promotion | `DiscountType` | `src/lib/api/services/fetchPromotion.ts` |

### Label Formatters

| Function                       | Purpose                      | File                               |
| ------------------------------ | ---------------------------- | ---------------------------------- |
| `getOrderStatusLabel()`        | Order status → Label         | `src/lib/utils/enum/formatEnum.ts` |
| `getHealthStatusLabel()`       | Health status → Label        | `src/lib/utils/enum/formatEnum.ts` |
| `getSaleStatusLabel()`         | Sale status → Label          | `src/lib/utils/enum/formatEnum.ts` |
| `getBreedingStatusLabel()`     | Breeding status → Label      | `src/lib/utils/enum/formatEnum.ts` |
| `getPondStatusLabel()`         | Pond status → Label          | `src/lib/utils/enum/formatEnum.ts` |
| `getPondTypeLabel()`           | Pond type → Label            | `src/lib/utils/enum/formatEnum.ts` |
| `getWorkScheduleStatusLabel()` | Work schedule status → Label | `src/lib/utils/enum/formatEnum.ts` |
| `getIncidentStatusLabel()`     | Incident status → Label      | `src/lib/utils/enum/formatEnum.ts` |
| `getIncidentSeverityLabel()`   | Incident severity → Label    | `src/lib/utils/enum/formatEnum.ts` |
| `getWaterAlertSeverityLabel()` | Water alert severity → Label | `src/lib/utils/enum/formatEnum.ts` |
| `getRoleLabel()`               | User role → Label            | `src/lib/utils/enum/formatEnum.ts` |
| `getGenderLabel()`             | Gender → Label               | `src/lib/utils/enum/formatEnum.ts` |
| `getFishSizeLabel()`           | Fish size → Human readable   | `src/lib/utils/enum/formatEnum.ts` |

---

## 📝 Notes

- Tất cả enum values sử dụng PascalCase
- Color classes sử dụng Tailwind CSS
- Label được định nghĩa bằng tiếng Việt
- Icon sử dụng Lucide React

---

_Last updated: December 2025_
