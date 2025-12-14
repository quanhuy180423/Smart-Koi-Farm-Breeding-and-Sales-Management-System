"use client";

import CustomerSidebar from "@/components/customer/CustomerSidebar";
import { Header } from "../Header";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Customer Header */}
      <Header />

      <div className="flex">
        <CustomerSidebar className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)]" />
        {/* Add padding-left for collapsed sidebar on mobile/tablet, and full sidebar on desktop */}
        <div className="flex-1 ml-16 lg:ml-80">
          <div className="container mx-auto px-4 py-8 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;
