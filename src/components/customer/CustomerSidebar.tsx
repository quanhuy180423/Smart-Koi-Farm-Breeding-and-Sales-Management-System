"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  User,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Menu,
  ChevronRight,
  Heart,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import type { Route } from "next";
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
    title: "Địa chỉ",
    href: "/profile/addresses" as const,
    icon: MapPin,
    description: "Quản lý địa chỉ giao hàng",
  },
  {
    title: "Giỏ hàng",
    href: "/profile/cart" as const,
    icon: ShoppingCart,
    description: "Xem giỏ hàng của bạn",
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
] as const;

interface CustomerSidebarProps {
  className?: string;
}

export function CustomerSidebar({ className }: CustomerSidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Collapsed Sidebar - Always visible on mobile/tablet */}
      <div
        className={cn("lg:hidden fixed left-0 top-0 h-full z-40", className)}
      >
        <div className="w-16 bg-card border-r h-full flex flex-col items-center py-4 space-y-2">
          {/* Navigation Icons */}
          <nav className="flex-1 w-full px-2 space-y-2 mt-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href as Route}>
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:bg-accent/50 cursor-pointer",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Expanded Sidebar Sheet - Mobile/Tablet */}
      <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 pt-6 pb-4 border-b bg-linear-to-r from-background to-muted/30">
              <div className="flex items-center gap-3">
                <Image
                  src={Logo}
                  alt="ZenKoi Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <SheetTitle className="text-left text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    ZenKoi
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">
                    Koi Farm Premium
                  </p>
                </div>
              </div>
            </SheetHeader>

            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    onClick={() => setIsExpanded(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group hover:bg-accent/50 cursor-pointer",
                        isActive &&
                          "bg-primary/10 border border-primary/20 my-1"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-medium truncate",
                            isActive
                              ? "text-primary"
                              : "text-secondary-foreground"
                          )}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Full width */}
      <div className={cn("hidden lg:block", className)}>
        <div className="w-80 bg-card border-r h-full">
          <div className="flex flex-col h-full">
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href as Route}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group hover:bg-accent/50 cursor-pointer",
                        isActive &&
                          "bg-primary/10 border border-primary/20 my-1"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-medium truncate",
                            isActive
                              ? "text-primary"
                              : "text-secondary-foreground"
                          )}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerSidebar;
