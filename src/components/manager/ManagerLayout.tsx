"use client";

import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { useAuthStore } from "@/store/auth-store";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useAuthStore(); // Ensure auth store is initialized

  if (!mounted) return null; // render chỉ khi client đã mount

  return (
    <div className="min-h-screen bg-background">
      {/* Manager Header */}
      <ManagerHeader />

      <div className="flex pt-16">
        <ManagerSidebar className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)]" />
        <div className="flex-1 lg:ml-80">{children}</div>
      </div>
    </div>
  );
}

export default ManagerLayout;
