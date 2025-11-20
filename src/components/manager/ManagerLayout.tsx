// components/manager/ManagerLayout.tsx
"use client";

import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { useAuthStore } from "@/store/auth-store";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Gọi hook auth để đảm bảo state đã load (tùy logic app của bạn)
  useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Hoặc return <LoadingSkeleton />

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. Header cố định ở trên cùng */}
      <ManagerHeader />

      {/* 2. Wrapper chính: Đẩy nội dung xuống dưới Header (pt-16) */}
      <div className="flex pt-16 h-[calc(100vh)] overflow-hidden">
        {/* Sidebar: Tự động hiển thị/ẩn theo breakpoint lg */}
        <ManagerSidebar className="hidden lg:flex" />

        {/* Main Content: Flex-1 để chiếm toàn bộ khoảng trống còn lại */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/5 p-4 md:p-6 lg:p-8 transition-all duration-300">
          <div className="mx-auto max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default ManagerLayout;
