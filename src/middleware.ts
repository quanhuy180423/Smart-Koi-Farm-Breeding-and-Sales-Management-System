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

// Utility functions for token handling (Edge Runtime compatible)

/**
 * Decode JWT token (no signature verification - for expiry check only)
 */
function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode payload (second part)
    const decoded = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8"),
    );
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired or expiring soon
 * @param token JWT token string
 * @param bufferSeconds Buffer time before actual expiration (default: 60 seconds)
 */
function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  try {
    const payload = decodeTokenPayload(token);
    if (!payload || typeof payload.exp !== "number") {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp - now <= bufferSeconds;
  } catch {
    return true;
  }
}

/**
 * Renew token via API call (Edge Runtime compatible using fetch)
 */
async function renewToken(
  accessToken: string,
  refreshToken: string,
  apiBaseURL: string,
): Promise<{
  newAccessToken: string | null;
  newRefreshToken: string | null;
}> {
  try {
    const response = await fetch(`${apiBaseURL}/api/Accounts/renew-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (!response.ok) {
      return { newAccessToken: null, newRefreshToken: null };
    }

    const data = (await response.json()) as {
      isSuccess?: boolean;
      result?: { accessToken?: string; refreshToken?: string };
    };

    if (data.isSuccess && data.result) {
      return {
        newAccessToken: data.result.accessToken || null,
        newRefreshToken: data.result.refreshToken || null,
      };
    }

    return { newAccessToken: null, newRefreshToken: null };
  } catch {
    return { newAccessToken: null, newRefreshToken: null };
  }
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const apiBaseURL =
    process.env.NEXT_PUBLIC_API_URL_BACKEND || "http://localhost:5000";

  // === BƯỚC 1: LẤY THÔNG TIN COOKIES ===
  let token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("auth-token")?.value;

  const refreshToken = request.cookies.get("refresh-token")?.value;

  const userRole = request.cookies.get("user-role")?.value || Roles.Guest;

  let isAuthenticated = !!token;
  const response = NextResponse.next();

  // Store renewed tokens to apply to response
  const renewedTokens: {
    authToken?: string;
    refreshToken?: string;
  } = {};

  // === BƯỚC 2: PROACTIVE TOKEN RENEWAL ===
  // Kiểm tra token có sắp hết hạn không, nếu có thì renew trước khi request
  if (isAuthenticated && token && refreshToken && isTokenExpired(token, 60)) {
    const { newAccessToken, newRefreshToken } = await renewToken(
      token,
      refreshToken,
      apiBaseURL,
    );

    if (newAccessToken) {
      // Token renewal thành công - store tokens to apply later
      renewedTokens.authToken = newAccessToken;
      if (newRefreshToken) {
        renewedTokens.refreshToken = newRefreshToken;
      }
      token = newAccessToken; // Update token variable for subsequent checks
    } else {
      // Token renewal thất bại - xóa cookies và logout
      response.cookies.delete("auth-token");
      response.cookies.delete("refresh-token");
      response.cookies.delete("user-role");
      isAuthenticated = false;
    }
  }

  // Apply renewed tokens to response
  if (renewedTokens.authToken) {
    response.cookies.set("auth-token", renewedTokens.authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  if (renewedTokens.refreshToken) {
    response.cookies.set("refresh-token", renewedTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  // === BƯỚC 3: XỬ LÝ TRANG AUTH (LOGIN/REGISTER) ===
  // Nếu User ĐÃ login mà cố vào trang Login -> Đá về Dashboard của họ
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated && userRole !== Roles.Guest) {
      const dashboardUrl = ROLE_DASHBOARD[userRole] || "/";
      const redirectResponse = NextResponse.redirect(
        new URL(dashboardUrl, request.url),
      );
      // Preserve renewed tokens in redirect response
      if (renewedTokens.authToken) {
        redirectResponse.cookies.set("auth-token", renewedTokens.authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      if (renewedTokens.refreshToken) {
        redirectResponse.cookies.set(
          "refresh-token",
          renewedTokens.refreshToken,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          },
        );
      }
      return redirectResponse;
    }
    // Chưa login thì cho phép ở lại trang Login
    return response;
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
        const redirectResponse = NextResponse.redirect(
          new URL(correctDashboard, request.url),
        );
        // Preserve renewed tokens in redirect response
        if (renewedTokens.authToken) {
          redirectResponse.cookies.set("auth-token", renewedTokens.authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
        if (renewedTokens.refreshToken) {
          redirectResponse.cookies.set(
            "refresh-token",
            renewedTokens.refreshToken,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            },
          );
        }
        return redirectResponse;
      }
    }

    // Đúng quyền -> Cho qua với renewed tokens
    return response;
  }

  // === BƯỚC 5: CÁC TRANG CÔNG KHAI (HOME, ETC.) ===
  return response;
}

// Cấu hình matcher tối ưu
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
