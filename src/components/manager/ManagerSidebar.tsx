// components/manager/ManagerSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Fish,
  Users,
  Building2,
  Calendar,
  Heart,
  Truck,
  Menu,
  ChevronLeft,
  Shield,
  Bell,
  Grid2X2,
  BookMinus,
  FileSpreadsheet,
  Tag,
  AlertTriangle,
  Palette,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/images/ZenKoi.png"; // Đảm bảo đường dẫn ảnh đúng
import { useSidebarStore } from "@/store/use-sidebar-store";

// Định nghĩa danh sách menu
const sidebarItems = [
  { title: "Dashboard", href: "/manager", icon: LayoutDashboard },
  { title: "Quản lý tài khoản", href: "/manager/accounts", icon: Users },
  { title: "Quản lý đơn hàng", href: "/manager/orders", icon: Truck },
  { title: "Quản lý cá Koi", href: "/manager/koi", icon: Fish },
  { title: "Quản lý sinh sản", href: "/manager/breeding", icon: Heart },
  { title: "Lịch làm việc", href: "/manager/schedules", icon: Calendar },
  { title: "Quản lý khu", href: "/manager/area", icon: Grid2X2 },
  { title: "Quản lý hồ", href: "/manager/ponds", icon: Building2 },
  { title: "Quản lý loại hồ", href: "/manager/pond-types", icon: BookMinus },
  {
    title: "Quản lý giống cá",
    href: "/manager/varieties",
    icon: FileSpreadsheet,
  },
  { title: "Quản lý hoa văn", href: "/manager/patterns", icon: Palette },
  { title: "Chi phí vận chuyển", href: "/manager/shipping", icon: Truck },
  { title: "Khuyến mãi", href: "/manager/promotions", icon: Tag },
  { title: "Thông báo", href: "/manager/notifications", icon: Bell },
  { title: "Quản lý sự cố", href: "/manager/incidents", icon: AlertTriangle },
  {
    title: "Quản lý loại sự cố",
    href: "/manager/incident-types",
    icon: Shield,
  },
] as const;

interface ManagerSidebarProps {
  className?: string;
}

interface itemNav {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  href: any;
  icon: LucideIcon;
}
export default function ManagerSidebar({ className }: ManagerSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  // Component con hiển thị từng item nav
  const NavItem = ({
    item,
    isMobile = false,
  }: {
    item: itemNav;
    isMobile?: boolean;
  }) => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href ||
      (item.href !== "/manager" && pathname.startsWith(item.href));

    // Logic hiển thị: Mobile luôn hiện text, Desktop hiện khi không collapsed
    const showText = isMobile || !isCollapsed;

    const content = (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg py-2 transition-all duration-200 group hover:bg-accent hover:text-white",
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
          isCollapsed && !isMobile ? "justify-center px-0" : "px-3",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-2",
            isActive && "text-primary hover:text-white",
          )}
        />

        {/* Text Container với hiệu ứng transition */}
        <span
          className={cn(
            "whitespace-nowrap transition-all duration-300 overflow-hidden",
            showText ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-0",
          )}
        >
          {item.title}
        </span>
      </Link>
    );

    // Nếu đang thu gọn ở Desktop, bọc trong Tooltip để hover xem tên
    if (isCollapsed && !isMobile) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div className="mb-1">{content}</div>;
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card h-[calc(100vh-4rem)] sticky  transition-all duration-300 ease-in-out shrink-0 z-30",
          isCollapsed ? "w-[70px]" : "w-64",
          className,
        )}
      >
        {/* Nút Thu Gọn/Mở Rộng */}
        <div className="flex items-center justify-between lg:justify-center gap-2 h-16 p-2 mt-2">
          {!isCollapsed && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-md p-2 transition-all duration-300 w-full",
                isCollapsed
                  ? "justify-center bg-transparent"
                  : "bg-primary/5 border border-primary/10",
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/20 text-primary shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold truncate text-primary">
                  Quản trị viên
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  System Admin
                </span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-12 w-10 text-muted-foreground hover:text-white bg-primary/10"
          >
            <ChevronLeft
              className={cn(
                "h-8 w-8 transition-transform duration-300",
                isCollapsed && "rotate-180",
              )}
            />
          </Button>
        </div>

        {/* Danh sách Menu (Có thanh cuộn) */}
        <ScrollArea className="flex-1 py-4 overflow-auto ">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* --- MOBILE SIDEBAR (DRAWER) --- */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-3 z-50 h-10 w-10 rounded-full bg-background shadow-md border"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <SheetHeader className="border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="ZenKoi"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <SheetTitle className="text-left">ZenKoi Manager</SheetTitle>
              </div>
            </SheetHeader>
            <ScrollArea className="flex-1 py-4">
              <nav className="grid gap-1 px-4">
                {sidebarItems.map((item) => (
                  <NavItem key={item.href} item={item} isMobile={true} />
                ))}
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
