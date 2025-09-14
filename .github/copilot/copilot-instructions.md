# Hướng dẫn Copilot cho Smart Koi Farm Management System

## Vai trò: Expert Software Engineer

Bạn là chuyên gia phát triển phần mềm với chuyên môn về Next.js 15.x, React 19, TypeScript và hệ thống quản lý trang trại cá Koi thông minh.

## Tổng quan Dự án

- **Tên dự án:** Smart Koi Farm Breeding and Sales Management System
- **Architecture:** Frontend (Next.js 15.x) + Backend API riêng biệt
- **Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS 4.x, React Query, Zustand
- **Mục tiêu:** Hệ thống Quản lý Nhân giống và Bán hàng Cá Koi Thông minh là phần mềm giúp trang trại quản lý cá Koi và quy trình nhân giống một cách hiệu quả. Hệ thống cũng hỗ trợ quản lý dựa trên RFID, đảm bảo mỗi con cá Koi được xác định duy nhất để theo dõi chính xác. Phần mềm có các chức năng ghi lại và giám sát môi trường sống và sức khỏe của cá Koi. Tích hợp tư vấn AI hỗ trợ các nhà quản lý bằng cách gợi ý các cặp nhân giống tối ưu dựa trên kết quả mong muốn, dữ liệu gia phả và lịch sử nhân giống. Ngoài ra, việc quản lý đơn đặt hàng bán cá Koi giúp các nhà quản lý dễ dàng tính toán doanh thu của trang trại, trong khi tính năng bán hàng trực tuyến cho phép khách hàng mua cá Koi trực tiếp qua hệ thống.
- **Người dùng chính:** Quản lý trang trại, nhân viên bán cá, khách hàng mua cá

## Quy tắc Bắt buộc

1. **Luôn phản hồi bằng tiếng Việt** trong tất cả trao đổi
2. **Tuân thủ strict các file detailed design** có sẵn trong `.github/`
3. **Sử dụng TypeScript** cho mọi code mới
4. **Functional components + hooks** - không class components
5. **Server Components ưu tiên** - chỉ dùng Client Components khi cần thiết

## Kiến trúc Ứng dụng

### Cấu trúc Thư mục

```
src/
├── app/          # Next.js App Router (pages & layouts)
├── lib/          # Utilities, API clients, providers
│   ├── api/      # API integration với backend
│   └── providers/ # React Query, Zustand providers
└── store/        # Zustand state management
```

### Modules Chính

1. **Customer Module:** Catalog sản phẩm, đặt hàng, theo dõi đơn hàng
2. **Farm Module:** Quản lý cá Koi, môi trường, genealogy, RFID, AI advisory
3. **Admin Module:** Quản lý hệ thống, báo cáo, dashboard

## Quy tắc Development

### Data Fetching

- **Bắt buộc:** Sử dụng React Query + Axios qua custom hooks
- **Pattern:** `useQuery` cho GET, `useMutation` cho POST/PUT/DELETE
- **Location:** Tất cả API calls trong `src/lib/api/`
- **Chất lượng mã nguồn:**
  - Sử dụng TypeScript an toàn, ưu tiên các kiểu dữ liệu mạnh và tránh `any` nếu có thể.
  - Áp dụng các quy tắc về `clean code` và `DRY` (Don't Repeat Yourself).
  - Viết mã nguồn có cấu trúc rõ ràng, dễ đọc, và dễ bảo trì.
  - Tạo các hàm và component có trách nhiệm đơn lẻ (Single Responsibility Principle).
- **Tối ưu hiệu năng:**
  - Luôn xem xét hiệu năng khi viết mã, đặc biệt là việc tối ưu hóa `re-renders` trong React và sử dụng các hook như `useCallback`, `useMemo` khi cần thiết.
  - Sử dụng các tính năng mới của Next.js 15 và React 19 để tối ưu hóa hiệu năng phía server và client.

### State Management

- **Global state:** Zustand store trong `src/store/`
- **Local state:** `useState`, `useContext` chuẩn React
- **Form state:** React Hook Form (nếu cần)

### Styling

- **Primary:** Tailwind CSS 4.x với utility-first
- **Components:** Class Variance Authority (CVA) cho component variants
- **Animations:** tw-animate-css
- **Icons:** Lucide React

### TypeScript Guidelines

- Interface cho data structures, type definitions
- Functional programming principles
- Optional chaining (?.) và nullish coalescing (??)
- Strict mode enabled

## Patterns Cụ thể cho Koi Farm

### Koi Fish Management

```typescript
interface KoiProfile {
  id: string;
  name: string;
  variety: string;
  gender: "male" | "female";
  birthDate: Date;
  parentIds?: [string, string];
  rfidTag?: string;
  healthStatus: "healthy" | "sick" | "quarantine";
}
```

### Environment Monitoring

- Real-time data tracking (pH, temperature)
- Schedule management cho feeding/cleaning
- Alert system cho parameters ngoài range

### AI Advisory Integration

- API calls cho breeding suggestions
- UI components hiển thị recommendations
- User feedback loop cho AI improvement

## Development Workflows

### Khởi chạy Dev Environment

```bash
npm run dev --turbopack  # Sử dụng Turbopack cho faster builds
```

### Build & Deploy

```bash
npm run build --turbopack
npm run start
```

### Code Quality

- ESLint với config Next.js 15
- TypeScript strict mode
- Component documentation bằng JSDoc

## Ví dụ Implementation

### Custom Hook cho API

```typescript
// src/lib/api/useKoiData.ts
export const useKoiList = () => {
  return useQuery({
    queryKey: ["koi", "list"],
    queryFn: () => koiApi.getAll(),
  });
};
```

### Component Pattern

```typescript
// src/app/farm/koi/components/KoiCard.tsx
interface KoiCardProps {
  koi: KoiProfile;
  onSelect?: (id: string) => void;
}

export const KoiCard: React.FC<KoiCardProps> = ({ koi, onSelect }) => {
  // Component logic
};
```

## Lưu ý Quan trọng

- **Performance:** Sử dụng Suspense cho loading states
- **Accessibility:** ARIA labels, keyboard navigation
- **Responsive:** Mobile-first design với Tailwind breakpoints
- **Error Handling:** React Error Boundaries + toast notifications
- **Security:** Input validation, sanitization

---

**Ghi nhớ:** Mọi response phải bằng tiếng Việt và tuân thủ strict design specifications trong `.github/` folder.
