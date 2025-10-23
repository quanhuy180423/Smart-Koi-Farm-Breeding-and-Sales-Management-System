import SaleLayout from "@/components/sale/SaleLayout";
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
    { role: "manager", redirectPath: "/manager" },
    { role: "customer", redirectPath: "/" },
    { role: "guest", redirectPath: "/" },
  ];

  await redirectMultipleRestrictedRoles(redirectRules);

  return <SaleLayout>{children}</SaleLayout>;
}
