import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Koi Farm Management - Cá Koi Chất Lượng Cao",
  description: "Hệ thống quản lý trại cá Koi với công nghệ RFID và AI",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <Suspense fallback={null}>{children}</Suspense>
      <Footer />
    </div>
  );
}
