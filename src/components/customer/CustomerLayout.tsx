"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import { CartSheet } from "@/components/cart-sheet";
import Image from "next/image";
import logo from "@/assets/images/Logo_ZenKoi.png";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Customer Header */}
      <header className="fixed top-0 right-0 left-0 lg:left-10 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 items-center justify-between pl-2 pr-4 lg:pl-4 lg:pr-8">
          <Link href="/" className="flex items-center space-x-2 group ml-12">
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
                ZenKoi
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">Koi Farm Premium</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="relative rounded-full">
              <Link href="/profile/notifications">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0">
                  2
                </Badge>
              </Link>
            </Button>

            <CartSheet />

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/user-avatar.jpg" alt="Avatar" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Nguyễn Văn An</p>
                <p className="text-xs text-muted-foreground">Khách hàng VIP</p>
              </div>
            </div>

            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/20">
              <Link href="/login">
                <LogOut className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <CustomerSidebar className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)]" />
        <div className="flex-1 lg:ml-80">
          <div className="container mx-auto px-4 py-8 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;