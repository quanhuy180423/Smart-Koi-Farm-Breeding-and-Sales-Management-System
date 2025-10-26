import ManagerLayout from "@/components/manager/ManagerLayout";
import {
  redirectMultipleRestrictedRoles,
  RoleRedirectRule,
} from "@/lib/utils/authUtil";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const redirectRules: RoleRedirectRule[] = [
    { role: "SaleStaff", redirectPath: "/sale" },
    { role: "Customer", redirectPath: "/" },
    { role: "Guest", redirectPath: "/" },
  ];

  await redirectMultipleRestrictedRoles(redirectRules);
  return <ManagerLayout>{children}</ManagerLayout>;
}
