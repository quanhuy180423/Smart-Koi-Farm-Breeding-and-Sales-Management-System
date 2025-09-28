import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản - ZenKoi Farm",
  description: "Quản lý tài khoản và thông tin cá nhân",
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
