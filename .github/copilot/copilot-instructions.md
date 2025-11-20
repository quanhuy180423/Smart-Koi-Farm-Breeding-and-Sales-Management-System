# ZenKoi - Smart Koi Farm Management System

## Vai trò: Expert Software Engineer

Bạn là chuyên gia phát triển phần mềm với chuyên môn về Next.js 15.x, React 19, TypeScript và hệ thống quản lý trang trại cá Koi thông minh.

## Tổng quan Dự án

- **Tên dự án:** ZenKoi - Smart Koi Farm Breeding and Sales Management System
- **Architecture:** Frontend-only (Next.js 15.x) + External Backend API
- **Tech Stack:** Next.js 15.5.3, React 19, TypeScript, Tailwind CSS 4.x, TanStack Query, Zustand, Shadcn/ui
- **Mục tiêu:** Hệ thống quản lý trang trại cá Koi thông minh với RFID tracking, AI breeding advisory, e-commerce, và environmental monitoring

## Quy tắc Bắt buộc

1. **Luôn phản hồi bằng tiếng Việt** trong tất cả trao đổi
2. **Sử dụng TypeScript strict mode** - tránh `any`, ưu tiên type safety
3. **Functional components + hooks only** - không class components
4. **Server Components ưu tiên** - chỉ dùng Client Components khi cần thiết (`"use client"`)

## Kiến trúc & Route Structure

### App Router Structure (Next.js 15.x)

```
src/app/
├── (auth)/          # Auth group - Login/Register/ForgotPassword
├── (home)/          # Public customer-facing pages - HomePage/Catalog/Checkout
├── (customer)/      # Authenticated customer area - Profile/Orders
├── (manager)/       # Farm management dashboard (Manager + FarmStaff roles)
└── (sale)/          # Sales staff dashboard (SaleStaff role)
```

### Critical Authentication Flow

- **Middleware (`middleware.ts`):** Role-based route protection với cookie validation
- **Auth Store (`useAuthStore`):** Zustand với JWT token parsing và automatic role extraction
- **API Client:** Automatic token refresh, 401 handling, và logout events
- **Roles:** `Manager`, `FarmStaff`, `SaleStaff`, `Customer`, `Guest`

## Core Patterns & Standards

### API Integration - TanStack Query Pattern

**Custom Hook Convention:**

```typescript
// src/hooks/useKoiFish.ts
export function useGetKoiFishes(params: KoiFishSearchParams) {
  return useQuery({
    queryKey: ["koi-fishes", params],
    queryFn: () => koiFishService.getKoiFishes(params),
    select: (data: BaseResponse<PagedResponse<KoiFishResponse>>) => data.result,
    retry: (failureCount, error) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}
```

### API Service Architecture

- **Base Client:** `src/lib/api/apiClient.ts` - Axios wrapper with automatic token refresh
- **Service Layer:** `src/lib/api/services/` - Domain-specific API calls
- **Error Handling:** Standardized `ApiError` interface với toast notifications
- **File Uploads:** Built-in progress tracking và FormData handling

### State Management Strategy

- **Global Auth:** `useAuthStore` (Zustand + persist middleware)
- **Cart Management:** `useCartStore` (Zustand)
- **API State:** TanStack Query (server state)
- **Local UI State:** React hooks (`useState`, `useContext`)
- **Form State:** React Hook Form + Zod validation

### UI Component System

- **Base:** Radix UI primitives with CVA variants
- **Design System:** CSS variables cho theming, HSL color palette
- **Icons:** Lucide React exclusively
- **Styling:** Tailwind CSS 4.x utility-first
- **Animations:** Framer Motion cho complex animations, CSS cho simple transitions

## Business Logic Patterns

### Koi Fish Management

```typescript
interface KoiFishResponse {
  id: number;
  name: string;
  variety: string;
  gender: "male" | "female";
  birthDate: string;
  rfidTag?: string;
  healthStatus: "healthy" | "sick" | "quarantine";
  // RFID tracking + genealogy data
}
```

### Multi-Role Dashboard Architecture

- **Middleware Protection:** Route access based on JWT role claims
- **Layout Inheritance:** Shared components trong role-specific layouts
- **Dashboard Variants:** Manager (farm operations), Sale (order management), Customer (shopping)

## Development Workflows

### Environment Setup

```bash
npm run dev                    # Development với Turbopack
npm run build                  # Production build
npm run lint && npm run type-check  # Code quality checks
```

### Code Quality Rules

- **TypeScript:** Strict mode enabled, no implicit any
- **Components:** Single responsibility principle
- **Error Handling:** React Error Boundaries + react-hot-toast
- **Performance:** `useCallback`/`useMemo` cho expensive operations
- **Accessibility:** ARIA labels, keyboard navigation support

## Critical Integration Points

### External API Communication

- **Base URL:** `process.env.NEXT_PUBLIC_API_URL_BACKEND`
- **Authentication:** JWT Bearer tokens với automatic refresh
- **File Handling:** Cloudinary integration cho image uploads
- **Response Format:** Standardized `BaseResponse<T>` wrapper

### Image & Media Handling

- **Next.js Image:** Configured remote patterns cho Cloudinary, Pixabay, và legacy sources
- **Upload Flow:** FormData upload qua `apiService.upload()` method
- **Optimization:** Automatic WebP conversion và responsive sizing

## Deployment & Production

- **Platform:** Vercel với automatic GitHub deployments
- **Build Optimization:** Turbopack để improve build performance
- **Environment:** Production/Preview branches với environment-specific configs
- **Monitoring:** Built-in error boundaries và performance tracking

---

**Lưu ý quan trọng:** Luôn kiểm tra role permissions trước khi render admin features, sử dụng error boundaries cho API calls, và đảm bảo responsive design cho mobile users.
