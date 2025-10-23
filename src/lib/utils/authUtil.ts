import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole =
  | "guest"
  | "manager"
  | "farm-staff"
  | "sale-staff"
  | "customer"
  | "";

export interface RoleRedirectRule {
  role: UserRole;
  redirectPath: string;
}

/**
 * Lấy vai trò hiện tại của người dùng từ cookie và chuẩn hóa.
 * Vai trò mặc định là "guest". Vai trò rỗng ("") cũng được coi là "guest".
 */
async function getCurrentRole(): Promise<UserRole> {
  // Sửa lỗi TS2339: Await để đảm bảo cookieStore được resolve thành ReadonlyRequestCookies
  const cookieStore = await cookies();

  // Lấy giá trị cookie, nếu không có thì mặc định là "guest"
  const currentRole =
    (cookieStore.get("user-role")?.value?.toLowerCase() as UserRole) ?? "guest";

  // Chuẩn hóa role rỗng thành "guest"
  return currentRole === "" ? "guest" : currentRole;
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
  requiredRoles: UserRole[],
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
  restrictedRoles: UserRole[],
  redirectPath: string,
): Promise<void> {
  const currentRole = await getCurrentRole();

  if (restrictedRoles.includes(currentRole)) {
    (redirect as (path: string) => never)(redirectPath);
  }
}
