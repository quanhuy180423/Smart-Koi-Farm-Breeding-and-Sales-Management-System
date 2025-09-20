"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart-sheet";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.jpg";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={60} height={60} />
            {/* <span className="font-bold text-xl">ZenKoi</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/catalog"
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Danh mục cá
            </Link>
            <Link
              href="/about"
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="text-xl font-medium hover:text-primary transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Link
              href="/auth/sign-in"
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg"
            >
              Đăng nhập
            </Link>
            <CartSheet />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/catalog"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Danh mục cá
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
