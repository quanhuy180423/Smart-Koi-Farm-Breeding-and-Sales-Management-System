"use client";

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
import { User, LogOut, Settings, CircleUserRound } from "lucide-react";
import Link from "next/link";
import ManagerSidebar from "@/components/manager/ManagerSidebar";
import { NotificationDropdown } from "@/components/manager/NotificationDropdown";
import Image from "next/image";
import logo from "@/assets/images/Logo_ZenKoi.png";
import { useEffect } from "react";
import { useAuthStore, UserRole } from "@/store/auth-store";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  // client-side guard: only allow managers and farm staff here
  useEffect(() => {
    const role = useAuthStore.getState().getUserRole();
    if (role !== UserRole.MANAGER && role !== UserRole.FARM_STAFF) {
      // Not allowed: send to login
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Manager Header */}
      <header className="fixed top-0 right-0 left-0 lg:left-10 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 items-center justify-between pl-2 pr-4 lg:pl-4 lg:pr-8">
          <Link
            href="/manager"
            className="flex items-center space-x-2 group ml-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
              <Image
                src={logo}
                alt="ZenKoi Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ZenKoi Manager
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Quản lý trang trại
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationDropdown />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user.png" alt="Avatar" />
                    <AvatarFallback>
                      <CircleUserRound className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nguyễn Văn Quản lý
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quản lý trang trại
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/manager/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4 group-hover:text-white" />
                    Thông tin cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/manager/settings"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4 group-hover:text-white" />
                    Cài đặt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="flex items-center text-red-600 cursor-pointer hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white transition-colors group"
                  >
                    <LogOut className="mr-2 h-4 w-4 group-hover:text-white" />
                    Đăng xuất
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <ManagerSidebar className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)]" />
        <div className="flex-1 lg:ml-80">{children}</div>
      </div>
    </div>
  );
}

export default ManagerLayout;
