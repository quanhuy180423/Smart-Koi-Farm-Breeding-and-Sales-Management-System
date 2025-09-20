import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập - Koi Farm Management",
  description: "Đăng nhập vào hệ thống quản lý trang trại cá Koi",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-16 h-8 bg-primary/20 rounded-full animate-pulse animate-duration-[4s]"
          style={{
            clipPath: "ellipse(70% 50% at 30% 50%)",
            animation: "float-koi-1 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-12 h-6 bg-accent/15 rounded-full animate-pulse animate-duration-[6s]"
          style={{
            clipPath: "ellipse(70% 50% at 30% 50%)",
            animation: "float-koi-2 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/6 w-10 h-5 bg-primary/10 rounded-full animate-pulse animate-duration-[5s]"
          style={{
            clipPath: "ellipse(70% 50% at 30% 50%)",
            animation: "float-koi-3 12s ease-in-out infinite",
          }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
