import type React from "react";
import type { Metadata } from "next";
import { redirectMultipleRestrictedRoles, RoleRedirectRule } from "@/lib/utils/authUtil";

export const metadata: Metadata = {
  title: "Tài khoản - ZenKoi Farm",
  description: "Quản lý tài khoản và thông tin cá nhân",
};

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const redirectRules: RoleRedirectRule[] = [
    { role: "Manager", redirectPath: "/manager" },
    { role: "SaleStaff", redirectPath: "/sale" },
    { role: "Guest", redirectPath: "/" },
  ];

  await redirectMultipleRestrictedRoles(redirectRules);
  return <>{children}</>;
}
