"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Fish,
  Users,
  Building2,
  Calendar,
  Heart,
  Truck,
  Menu,
  ChevronRight,
  Shield,
  Bell,
  Grid2X2,
  BookMinus,
  FileSpreadsheet,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/images/ZenKoi.png";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/manager" as const,
    icon: LayoutDashboard,
    description: "Tổng quan hệ thống",
  },
  {
    title: "Quản lý cá Koi",
    href: "/manager/koi" as const,
    icon: Fish,
    description: "Quản lý đàn cá",
  },
  {
    title: "Quản lý sinh sản",
    href: "/manager/breeding" as const,
    icon: Heart,
    description: "Chu kỳ sinh sản",
  },
  {
    title: "Quản lý tài khoản",
    href: "/manager/accounts" as const,
    icon: Users,
    description: "Người dùng hệ thống",
  },
  {
    title: "Lịch làm việc",
    href: "/manager/schedules" as const,
    icon: Calendar,
    description: "Phân công nhân sự",
  },
  {
    title: "Quản lý khu",
    href: "/manager/area" as const,
    icon: Grid2X2,
    description: "Quản lý các khu vực trong trang trại",
  },
  {
    title: "Quản lý hồ",
    href: "/manager/ponds" as const,
    icon: Building2,
    description: "Hồ cá và môi trường",
  },
  {
    title: "Quản lý loại hồ",
    href: "/manager/pond-types" as const,
    icon: BookMinus,
    description: "Quản lý các loại của hồ",
  },
  {
    title: "Quản lý giống cá",
    href: "/manager/varieties" as const,
    icon: FileSpreadsheet,
    description: "Quản lý các loại của hồ",
  },
  {
    title: "Chi phí vận chuyển",
    href: "/manager/shipping" as const,
    icon: Truck,
    description: "Quản lý giá cước",
  },
  {
    title: "Thông báo",
    href: "/manager/notifications" as const,
    icon: Bell,
    description: "Báo cáo hệ thống",
  },
] as const;

interface ManagerSidebarProps {
  className?: string;
}

export function ManagerSidebar({ className }: ManagerSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = ({
    showHeader = false,
    onItemClick,
  }: {
    showHeader?: boolean;
    onItemClick?: () => void;
  }) => (
    <div className="flex flex-col h-full">
      {showHeader && (
        <SheetHeader className="px-4 pt-6 pb-4 border-b bg-gradient-to-r from-background to-muted/30">
          <div className="flex items-center gap-3">
            <Image
              src={Logo}
              alt="ZenKoi Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ZenKoi Manager
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                Quản lý trang trại
              </p>
            </div>
          </div>
        </SheetHeader>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/manager" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href} onClick={onItemClick}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group hover:bg-accent/50 cursor-pointer",
                  isActive && "bg-primary/10 border border-primary/20 my-1",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium truncate",
                      isActive ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Admin Badge */}
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary">Quản lý viên</p>
            <p className="text-xs text-muted-foreground">Toàn quyền hệ thống</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block", className)}>
        <div className="w-80 bg-card border-r h-full">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-40 bg-background/80 backdrop-blur-sm border"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent
              showHeader={true}
              onItemClick={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default ManagerSidebar;
