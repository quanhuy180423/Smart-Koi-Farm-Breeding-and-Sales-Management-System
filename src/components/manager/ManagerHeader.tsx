// components/manager/ManagerHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, CircleUserRound } from "lucide-react";

// Components UI
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Hooks & Contexts (Giữ nguyên logic của bạn)
import { useAuthStore } from "@/store/auth-store";
import { useFishSchool } from "@/lib/context/FishSchoolContext";
import { useNotification } from "@/hooks/useNotification";
import { NotificationDropdown } from "@/components/manager/NotificationDropdown"; // Giả định bạn đã có
import logo from "@/assets/images/Logo_ZenKoi.png"; // Đường dẫn logo
import { cn } from "@/lib/utils";

export function ManagerHeader() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isEnabled, toggleFishSchool } = useFishSchool();

  // Logic notification
  useNotification({ autoConnect: true });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Logo Section - Thêm margin-left cho mobile để tránh nút hamburger */}
        <div className="flex items-center gap-2 ml-12 lg:ml-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
              <Image
                src={logo}
                alt="ZenKoi Logo"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ZenKoi Manager
              </h1>
            </div>
          </Link>
        </div>

        {/* Right Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Component */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 pl-2 pr-1 h-10 rounded-full lg:rounded-md hover:bg-muted"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={user?.avatar || "/user.png"}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    <CircleUserRound className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left mr-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/manager/profile" className="cursor-pointer w-full">
                  <User className="mr-2 h-4 w-4" /> Thông tin cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/manager/settings"
                  className="cursor-pointer w-full"
                >
                  <Settings className="mr-2 h-4 w-4" /> Cài đặt
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Fish Effect Toggle */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  toggleFishSchool();
                }}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">🐠</span> Hiệu ứng cá
                </div>
                <div
                  className={cn(
                    "w-8 h-4 rounded-full relative transition-colors ml-2",
                    isEnabled ? "bg-primary" : "bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                      isEnabled ? "left-4.5" : "left-0.5",
                    )}
                  />
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                onClick={async () => {
                  await useAuthStore.getState().logout();
                  router.push("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
