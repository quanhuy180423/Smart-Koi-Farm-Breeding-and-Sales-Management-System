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
  User,
  ShoppingBag,
  CreditCard,
  Menu,
  ChevronRight,
  Settings,
  Heart,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/images/ZenKoi.png";

const sidebarItems = [
  {
    title: "Thông tin cá nhân",
    href: "/profile" as const,
    icon: User,
    description: "Quản lý thông tin tài khoản",
  },
  {
    title: "Đơn hàng",
    href: "/profile/orders" as const,
    icon: ShoppingBag,
    description: "Lịch sử mua hàng",
  },
  {
    title: "Giao dịch",
    href: "/profile/transactions" as const,
    icon: CreditCard,
    description: "Lịch sử thanh toán",
  },
  {
    title: "Yêu thích",
    href: "/profile/favorites" as const,
    icon: Heart,
    description: "Cá Koi yêu thích",
  },
  {
    title: "Thông báo",
    href: "/profile/notifications" as const,
    icon: Bell,
    description: "Thông báo & cập nhật",
  },
  {
    title: "Cài đặt",
    href: "/profile/settings" as const,
    icon: Settings,
    description: "Cài đặt tài khoản",
  },
] as const;

interface CustomerSidebarProps {
  className?: string;
}

export function CustomerSidebar({ className }: CustomerSidebarProps) {
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
                ZenKoi
              </SheetTitle>
              <p className="text-xs text-muted-foreground">Koi Farm Premium</p>
            </div>
          </div>
        </SheetHeader>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

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

export default CustomerSidebar;
