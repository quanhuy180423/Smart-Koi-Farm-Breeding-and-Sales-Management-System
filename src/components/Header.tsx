"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFishSchool } from "@/lib/context/FishSchoolContext";
import Image from "next/image";
import logo from "@/assets/images/Logo_ZenKoi.png";
import { Separator } from "./ui/separator";
import { useAuthStore } from "@/store/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useGetVarieties } from "@/hooks/useVariety";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const { isEnabled, toggleFishSchool } = useFishSchool();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        (mobileMenuRef.current && mobileMenuRef.current.contains(target)) ||
        (menuButtonRef.current && menuButtonRef.current.contains(target))
      ) {
        return;
      }

      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const { data: koiVarieties } = useGetVarieties({
    pageIndex: 1,
    pageSize: 50,
  });

  const handleSelectVariety = (value: number | null) => {
    setIsMenuOpen(false);
    if (value) {
      router.push(`/catalog?varietyId=${value}`);
    } else {
      router.push(`/catalog`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
              <Image
                src={logo}
                alt="ZenKoi Logo"
                width={64}
                height={64}
                className="w-16 h-16 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-2xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                ZenKoi
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Koi Farm Premium
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-md font-medium text-secondary-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Trang chủ</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>

            <div className="relative group">
              <Button
                variant="ghost"
                className="w-full justify-between text-sm font-medium text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
              >
                Danh mục
              </Button>
              <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-44 bg-popover border border-border rounded-md shadow-md p-1">
                  <div
                    className="px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelectVariety(null)}
                  >
                    Tất cả
                  </div>
                  {koiVarieties?.data.map((koi) => (
                    <div
                      key={koi.id}
                      className="px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSelectVariety(koi.id)}
                    >
                      {koi.varietyName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/packet-fish"
              className="px-4 py-2 text-md font-medium text-secondary-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Gói cá</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-md font-medium text-secondary-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Giới thiệu</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-md font-medium text-secondary-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Liên hệ</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <div className="hidden sm:block">
              <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
            </div>

            {/* Auth actions - Desktop only */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium px-4 py-2.5 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 relative overflow-hidden group rounded-xl cursor-pointer">
                        <span className="relative z-10 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="hover:underline cursor-pointer">
                            {user?.name || "Tài khoản"}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4 hover:text-secondary-foreground" />
                        <span>Thông tin cá nhân</span>
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
              ) : (
                <Link href="/login">
                  <Button className="bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium px-6 py-2.5 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 relative overflow-hidden group rounded-xl cursor-pointer">
                    <span className="relative z-10 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Đăng nhập
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Cart (visible on small screens) */}
            <div className="sm:hidden">
              <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
            </div>

            {/* Mobile Menu Button */}
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="icon"
              className="lg:hidden p-2 hover:bg-primary/10 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-secondary-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-secondary-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden border-t border-border/40 bg-background/98 backdrop-blur-sm"
          >
            <div className="pb-4">
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="px-4 py-3 text-sm font-medium text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/catalog"
                  className="px-4 py-3 text-sm font-medium text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Danh mục
                </Link>
                <Link
                  href="/packet-fish"
                  className="px-4 py-3 text-sm font-medium text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gói cá
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-3 text-sm font-medium text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-3 text-sm font-medium text-secondary-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liên hệ
                </Link>
              </nav>

              {/* Mobile divider */}
              <Separator className="mb-2" />

              {/* Mobile action buttons */}
              <div className="px-4 flex flex-row gap-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full justify-center bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span className="hover:underline cursor-pointer">
                        {user?.name || user?.username || "Tài khoản"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={async () => {
                        await useAuthStore.getState().logout();
                        setIsMenuOpen(false);
                        router.push("/login");
                      }}
                    >
                      <LogOut />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1"
                    >
                      <Button className="w-full justify-center bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium">
                        <User className="w-4 h-4 mr-2" />
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Đăng ký
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
