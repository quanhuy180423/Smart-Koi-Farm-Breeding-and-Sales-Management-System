"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart-sheet";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "@/assets/images/Logo_ZenKoi.png";
import { Separator } from "./ui/separator";
import { useAuthStore } from "@/store/auth-store";
// router not needed here; using window.location for navigation to avoid typing issues

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if clicking on the menu button or menu content
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
              <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
              className="px-4 py-2 text-md font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Trang chủ</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
            <Link
              href="/catalog"
              className="px-4 py-2 text-md font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Danh mục</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-md font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Giới thiệu</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-md font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 relative group"
            >
              <span className="relative z-10">Liên hệ</span>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200"></div>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <div className="hidden sm:block">
              <CartSheet />
            </div>

            {/* Auth actions - Desktop only */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      router.push("/profile");
                    }}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium px-4 py-2.5 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 relative overflow-hidden group rounded-xl cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hover:underline cursor-pointer">
                        {user?.name || user?.username || "Tài khoản"}
                      </span>
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const ok = await useAuthStore.getState().signOut();
                      if (ok) {
                        toast.success("Đăng xuất thành công");
                        router.push("/login");
                      } else {
                        toast.error("Đăng xuất thất bại");
                      }
                    }}
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium px-6 py-2.5 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 relative overflow-hidden group rounded-xl cursor-pointer">
                    <span className="relative z-10 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Đăng nhập
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Cart (visible on small screens) */}
            <div className="sm:hidden">
              <CartSheet />
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
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
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
                  className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/catalog"
                  className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Danh mục
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-3"
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
                      className="w-full justify-center bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium"
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
                        const ok = await useAuthStore.getState().signOut();
                        setIsMenuOpen(false);
                        if (ok) {
                          toast.success("Đăng xuất thành công");
                          router.push("/login");
                        } else {
                          toast.error("Đăng xuất thất bại");
                        }
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1"
                    >
                      <Button className="w-full justify-center bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium">
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
