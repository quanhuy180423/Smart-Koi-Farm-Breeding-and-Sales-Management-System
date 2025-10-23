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
    { role: "sale-staff", redirectPath: "/sale" },
    { role: "customer", redirectPath: "/" },
    { role: "guest", redirectPath: "/" },
  ];

  await redirectMultipleRestrictedRoles(redirectRules);

  return <ManagerLayout>{children}</ManagerLayout>;
}
