"use client";

import SaleLayout from "@/components/sale/SaleLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaleLayout>{children}</SaleLayout>;
}