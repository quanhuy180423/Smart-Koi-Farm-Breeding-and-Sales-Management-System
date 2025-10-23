import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  redirectMultipleRestrictedRoles,
  RoleRedirectRule,
} from "@/lib/utils/authUtil";

export const metadata: Metadata = {
  title: "Koi Farm Management - Cá Koi Chất Lượng Cao",
  description: "Hệ thống quản lý trại cá Koi với công nghệ RFID và AI",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const redirectRules: RoleRedirectRule[] = [
    { role: "manager", redirectPath: "/manager" },
    { role: "sale-staff", redirectPath: "/sale" },
  ];

  await redirectMultipleRestrictedRoles(redirectRules);

  return (
    <div>
      <Header />
      <Suspense fallback={null}>{children}</Suspense>
      <Footer />
    </div>
  );
}
