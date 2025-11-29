import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Định nghĩa Role giống hệt trong fetchAuth/authStore
// (Khai báo lại ở đây để tránh import file chứa logic client gây lỗi Edge Runtime)
enum Roles {
  Manager = "Manager",
  FarmStaff = "FarmStaff",
  SaleStaff = "SaleStaff",
  Customer = "Customer",
  Guest = "Guest",
}

// 2. Định nghĩa Dashboard mặc định cho từng Role
const ROLE_DASHBOARD: Record<string, string> = {
  [Roles.Manager]: "/manager",
  [Roles.FarmStaff]: "/manager", // FarmStaff dùng chung layout manager (theo logic cũ của bạn)
  [Roles.SaleStaff]: "/sale",
  [Roles.Customer]: "/",
};

// 3. Định nghĩa các Route được bảo vệ và Role được phép truy cập
const PROTECTED_ROUTES = {
  "/manager": [Roles.Manager],
  "/sale": [Roles.SaleStaff],
  // Thêm các route khác nếu cần, ví dụ: "/profile": [Roles.Customer, Roles.Manager...]
};

// 4. Định nghĩa các Route Auth (Login/Register)
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === BƯỚC 2: LẤY THÔNG TIN TỪ COOKIE ===
  // Token để xác định đã đăng nhập hay chưa (AuthStore của bạn cần đảm bảo set cookie này)
  // Trong AuthStore tôi thấy có logic apiService.setAuthToken nhưng chưa rõ có set cookie 'accessToken' không.
  // Tuy nhiên, đoạn logout có xóa 'auth-token', nên tôi giả định cookie tên là 'auth-token' hoặc 'accessToken'.
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("auth-token")?.value;

  // Role được AuthStore set vào cookie 'user-role'
  const userRole = request.cookies.get("user-role")?.value || Roles.Guest;

  const isAuthenticated = !!token;

  // === BƯỚC 3: XỬ LÝ TRANG AUTH (LOGIN/REGISTER) ===
  // Nếu User ĐÃ login mà cố vào trang Login -> Đá về Dashboard của họ
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated && userRole !== Roles.Guest) {
      const dashboardUrl = ROLE_DASHBOARD[userRole] || "/";
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    // Chưa login thì cho phép ở lại trang Login
    return NextResponse.next();
  }

  // === BƯỚC 4: XỬ LÝ CÁC TRANG ĐƯỢC BẢO VỆ (PROTECTED ROUTES) ===
  // Tìm xem URL hiện tại có khớp với route nào trong PROTECTED_ROUTES không
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route),
  );

  if (matchedRoute) {
    // 4.1: Nếu chưa đăng nhập -> Đá về Login
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      // Lưu lại trang họ đang muốn vào để redirect lại sau khi login xong
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 4.2: Kiểm tra quyền (Role)
    const allowedRoles =
      PROTECTED_ROUTES[matchedRoute as keyof typeof PROTECTED_ROUTES];

    // Chuyển userRole từ cookie về dạng Enum để so sánh chính xác
    // Lưu ý: Cookie là string, cần đảm bảo so sánh đúng (Case sensitive)
    const hasPermission = allowedRoles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase(),
    );

    if (!hasPermission) {
      // Sai quyền -> Đá về Dashboard đúng của họ
      const correctDashboard = ROLE_DASHBOARD[userRole] || "/";

      // Tránh redirect loop: Nếu dashboard của họ chính là trang họ đang đứng thì không redirect nữa (hiếm khi xảy ra ở đây nhưng nên cẩn thận)
      if (pathname !== correctDashboard) {
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    }

    // Đúng quyền -> Cho qua
    return NextResponse.next();
  }

  // === BƯỚC 5: CÁC TRANG CÔNG KHAI (HOME, ETC.) ===
  return NextResponse.next();
}

// Cấu hình matcher tối ưu
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
