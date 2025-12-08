"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Logo from "@/assets/images/Logo_ZenKoi.png";
import { useSendOtp } from "@/hooks/useAuth";
import { VerifyEmailDialog } from "@/components/dialogs/VerifyEmailDialog";
import { Mail, RotateCcw } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp(() => {
    // Show verification dialog after successful OTP send
    setShowVerifyDialog(true);
  });

  const handleSendOtp = () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    setEmailError("");
    sendOtp({ email });
  };

  const handleVerifySuccess = () => {
    // Reset and redirect to login
    setShowVerifyDialog(false);
    setEmail("");
    setEmailError("");
    toast.success("Email đã được xác thực! Bạn có thể đăng nhập ngay bây giờ.");
    // Optional: redirect to login after a delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <>
      <VerifyEmailDialog
        isOpen={showVerifyDialog}
        email={email}
        onSuccess={handleVerifySuccess}
        onOpenChange={(open) => {
          if (!open) {
            setEmail("");
            setEmailError("");
          }
          setShowVerifyDialog(open);
        }}
      />

      <div className="min-h-screen bg-background">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Side - Verify Form */}
          <div className="flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-background">
            {/* Background effects */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/10"></div>

            {/* Floating koi fish animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute top-1/4 left-1/6 w-8 h-4 bg-primary/10 rounded-full animate-pulse"
                style={{
                  clipPath: "ellipse(70% 50% at 30% 50%)",
                  animation: "float-koi-1 15s ease-in-out infinite",
                }}
              />
              <div
                className="absolute bottom-1/3 right-1/4 w-6 h-3 bg-accent/10 rounded-full animate-pulse"
                style={{
                  clipPath: "ellipse(70% 50% at 30% 50%)",
                  animation: "float-koi-3 18s ease-in-out infinite",
                }}
              />
            </div>

            <Card className="w-full max-w-md mx-auto bg-card/95 backdrop-blur-md border-border/60 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 rounded-2xl overflow-hidden">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

              <CardHeader className="text-center space-y-4 relative z-10">
                <Link href="/" className="flex justify-center mb-1 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
                    <Image
                      src={Logo}
                      alt="ZenKoi Logo"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    Xác thực Email
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Nhập email của bạn để nhận mã xác thực
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-1 relative z-10">
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-secondary-foreground font-medium text-sm"
                    >
                      Địa chỉ Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email của bạn..."
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        disabled={isSendingOtp}
                        className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary transition-all duration-200 h-10 px-10 hover:border-primary/50 pl-10"
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-destructive font-medium flex items-center gap-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Send OTP Button */}
                  <Button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-2.5 h-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:scale-100 disabled:shadow-none relative overflow-hidden group mt-4"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSendingOtp ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                          Đang gửi OTP...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          Gửi OTP
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </Button>

                  {/* Info Text */}
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Chúng tôi sẽ gửi một mã xác thực gồm 6 chữ số đến email của
                    bạn
                  </p>
                </div>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground/70 font-medium">
                      hoặc
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="text-center space-y-2">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Chưa có tài khoản?{" "}
                      <Link
                        href="/register"
                        className="text-primary hover:text-accent font-semibold transition-all duration-200 hover:underline"
                      >
                        Đăng ký ngay
                      </Link>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Đã có tài khoản?{" "}
                      <Link
                        href="/login"
                        className="text-primary hover:text-accent font-semibold transition-all duration-200 hover:underline"
                      >
                        Đăng nhập
                      </Link>
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* Bottom highlight */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent"></div>
            </Card>
          </div>

          {/* Right Side - Hero Image */}
          <div className="hidden lg:block relative bg-muted">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 z-10" />

            {/* Hero Image */}
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
              alt="Beautiful Japanese Koi fish swimming in clear pond"
              fill
              className="object-cover"
              priority
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 z-20" />

            {/* Floating koi fish animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
              <div
                className="absolute top-1/6 right-1/4 w-16 h-8 bg-white/10 rounded-full animate-pulse"
                style={{
                  clipPath: "ellipse(70% 50% at 30% 50%)",
                  animation: "float-koi-1 20s ease-in-out infinite",
                }}
              />
              <div
                className="absolute top-1/2 left-1/6 w-12 h-6 bg-white/10 rounded-full animate-pulse"
                style={{
                  clipPath: "ellipse(70% 50% at 30% 50%)",
                  animation: "float-koi-2 25s ease-in-out infinite reverse",
                }}
              />
              <div
                className="absolute bottom-1/4 right-1/3 w-14 h-7 bg-white/10 rounded-full animate-pulse"
                style={{
                  clipPath: "ellipse(70% 50% at 30% 50%)",
                  animation: "float-koi-3 22s ease-in-out infinite",
                }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center p-12 z-40">
              <div className="text-center text-white space-y-6 max-w-lg">
                <h1 className="text-4xl font-bold text-balance leading-tight">
                  Xác thực Email của Bạn
                </h1>
                <p className="text-lg text-white/90 text-pretty leading-relaxed">
                  Chỉ cần vài bước đơn giản để xác thực email và bắt đầu sử dụng
                  tất cả các tính năng của ZenKoi
                </p>

                {/* Benefits */}
                <div className="pt-4">
                  <div className="flex flex-col gap-4 text-white/90">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-secondary shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Xác thực nhanh chóng và an toàn</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-accent shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>Bảo vệ tài khoản của bạn</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-primary shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Truy cập toàn bộ tính năng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
