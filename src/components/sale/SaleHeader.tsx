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
import { User, LogOut, CircleUserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/Logo_ZenKoi.png";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useFishSchool } from "@/lib/context/FishSchoolContext";

export function SaleHeader() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isEnabled, toggleFishSchool } = useFishSchool();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-10 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-16 items-center justify-between pl-2 pr-4 lg:pl-4 lg:pr-8">
        <Link href="/sale" className="flex items-center space-x-2 group ml-12">
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
              ZenKoi Sale
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Quản lý bán hàng
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
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
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nhân viên bán hàng
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={"/sale/profile" as const}
                  className="flex items-center cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 group-hover:text-white" />
                  Thông tin cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div
                  className="flex items-center gap-2 cursor-pointer px-2 py-1.5 hover:bg-accent/10 rounded transition-colors"
                  onClick={toggleFishSchool}
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <span>🐠</span>
                  </div>
                  <span>Hiệu ứng cá</span>
                  <div className="ml-auto">
                    <div
                      className={`w-8 h-5 rounded-full flex items-center relative transition-colors ${isEnabled ? "bg-primary/40" : "bg-muted/40"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full absolute transition-all ${isEnabled ? "bg-primary left-3.5" : "bg-muted left-0.5"}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-red-600 cursor-pointer hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white transition-colors group"
                onClick={async () => {
                  await useAuthStore.getState().logout();
                  router.push("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4 group-hover:text-white" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
