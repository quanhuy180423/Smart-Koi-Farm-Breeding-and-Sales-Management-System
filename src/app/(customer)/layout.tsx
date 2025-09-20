import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Koi Farm Management - Cá Koi Chất Lượng Cao",
  description: "Hệ thống quản lý trại cá Koi với công nghệ RFID và AI",
};

export default function CusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navigation />
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
