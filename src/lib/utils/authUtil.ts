import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export interface RoleRedirectRule {
  role: string;
  redirectPath: string;
}

/**
 * Lấy vai trò hiện tại của người dùng từ cookie và chuẩn hóa.
 * Vai trò mặc định là "guest". Vai trò rỗng ("") cũng được coi là "guest".
 */
async function getCurrentRole(): Promise<string> {
  const cookieStore = await cookies();

  // Lấy giá trị cookie, nếu không có thì mặc định là "Guest"
  const currentToken = cookieStore.get("auth-token")?.value ?? "Guest";
  const decode = jwt.decode(currentToken) as { Role?: string } | null;
  // Chuẩn hóa role rỗng thành "Guest"
  return decode?.Role ?? "Guest";
}

/**
 * KIỂM TRA ĐA ĐIỀU KIỆN: Kiểm tra vai trò hiện tại và chuyển hướng theo quy tắc tương ứng.
 * * @param rules Mảng các đối tượng RoleRedirectRule xác định vai trò nào sẽ chuyển hướng đến đường dẫn nào.
 */
export async function redirectMultipleRestrictedRoles(
  rules: RoleRedirectRule[],
): Promise<void> {
  const currentRole = await getCurrentRole();
  // Tìm quy tắc chuyển hướng phù hợp với vai trò hiện tại
  const matchingRule = rules.find((rule) => rule.role === currentRole);

  if (matchingRule) {
    (redirect as (path: string) => never)(matchingRule.redirectPath);
  }
}

/**
 * Kiểm tra xem vai trò hiện tại có nằm trong danh sách các vai trò được phép truy cập không.
 * Nếu không được phép, thực hiện chuyển hướng.
 * * @param requiredRoles Một mảng các vai trò được phép truy cập trang này.
 * @param redirectPath Đường dẫn chuyển hướng nếu người dùng không có quyền (mặc định là "/login").
 */
export async function checkAuthAndRedirect(
  requiredRoles: string[],
  redirectPath: string = "/login",
): Promise<void> {
  const currentRole = await getCurrentRole();

  // Kiểm tra xem vai trò hiện tại có trong danh sách yêu cầu không
  if (!requiredRoles.includes(currentRole)) {
    (redirect as (path: string) => never)(redirectPath);
  }
}

/**
 * Kiểm tra và chuyển hướng người dùng có vai trò đặc quyền khỏi các trang công khai.
 * Thường dùng trong Root Layout để đẩy "manager" hoặc "admin" sang trang dashboard.
 * * @param restrictedRoles Các vai trò KHÔNG được phép ở trang hiện tại (ví dụ: ["manager"]).
 * @param redirectPath Đường dẫn chuyển hướng cho các vai trò bị hạn chế.
 */
export async function redirectHighPrivilegeUser(
  restrictedRoles: string[],
  redirectPath: string,
): Promise<void> {
  const currentRole = await getCurrentRole();

  if (restrictedRoles.includes(currentRole)) {
    (redirect as (path: string) => never)(redirectPath);
  }
}

/**
 * Decode JWT token and return payload
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 * @param token JWT token string
 * @param bufferSeconds Buffer time in seconds before actual expiration (default: 60)
 * @returns true if token is expired or will expire soon
 */
export function isTokenExpired(
  token: string,
  bufferSeconds: number = 60,
): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded || typeof decoded.exp !== "number") {
      return true; // Treat as expired if no exp claim
    }

    const now = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    const timeUntilExpiry = expirationTime - now;

    // Token is expired if expiry time <= current time + buffer
    return timeUntilExpiry <= bufferSeconds;
  } catch {
    return true; // Treat as expired if error
  }
}

/**
 * Get time remaining for token in seconds
 * @param token JWT token string
 * @returns Seconds until token expires, or -1 if invalid
 */
export function getTokenExpiryTime(token: string): number {
  try {
    const decoded = decodeToken(token);
    if (!decoded || typeof decoded.exp !== "number") {
      return -1;
    }

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  } catch {
    return -1;
  }
}
