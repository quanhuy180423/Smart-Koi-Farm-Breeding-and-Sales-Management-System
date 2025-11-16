"use client";

import SaleSidebar from "./SaleSidebar";
import { SaleHeader } from "./SaleHeader";
import { useAuthStore } from "@/store/auth-store";

interface SaleLayoutProps {
  children: React.ReactNode;
}

export function SaleLayout({ children }: SaleLayoutProps) {
  useAuthStore(); // Ensure auth store is initialized

  return (
    <div className="min-h-screen bg-background">
      {/* Sale Header */}
      <SaleHeader />

      <div className="flex pt-16">
        <SaleSidebar className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)]" />
        <div className="flex-1 lg:ml-80">{children}</div>
      </div>
    </div>
  );
}

export default SaleLayout;
