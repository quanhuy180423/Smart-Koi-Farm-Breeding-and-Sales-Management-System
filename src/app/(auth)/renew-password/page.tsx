"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
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
import { useResetPassword } from "@/hooks/useAuth";
import Logo from "@/assets/images/Logo_ZenKoi.png";

export default function RenewPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const emailFromQuery = searchParams?.get("email") || "";

  // email is provided via query param; do not show it in the UI
  const email = emailFromQuery;
  const [newPassword, setNewPassword] = useState("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { resetPasswordAsync, isLoading } = useResetPassword();

  useEffect(() => {
    if (!token || !emailFromQuery) {
      toast.error("Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.");
    }
  }, [token, emailFromQuery]);

  const handleSubmit = async (data: React.FormEvent) => {
    data.preventDefault();

    if (!email) {
      toast.error("Vui lòng cung cấp email");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có tối thiểu 6 ký tự");
      return;
    }

    if (newPassword !== confirmedNewPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await resetPasswordAsync({
        email,
        newPassword,
        confirmedNewPassword,
        token,
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Reset Form */}
        <div className="flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10"></div>

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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

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
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Đặt lại mật khẩu
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Nhập mật khẩu mới của bạn để hoàn tất
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-1 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-foreground font-medium text-sm"
                  >
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary pr-11 transition-all duration-200 h-10 px-3 hover:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 rounded-md transition-all duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmedNewPassword"
                    className="text-foreground font-medium text-sm"
                  >
                    Xác nhận mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmedNewPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmedNewPassword}
                      onChange={(e) => setConfirmedNewPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới..."
                      className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary transition-all duration-200 h-10 px-3 hover:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 rounded-md transition-all duration-200"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-2.5 h-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:scale-100 disabled:shadow-none relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Đang lưu...
                      </div>
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>

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

                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Đã có tài khoản?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-accent font-semibold transition-all duration-200 hover:underline"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">
                    Vui lòng không chia sẻ mật khẩu của bạn với người khác để
                    bảo vệ tài khoản
                  </p>
                </div>
              </form>
            </CardContent>

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
          </Card>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block relative bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-japanese-koi-fish-swimming-in-clear-pond-1MrDrpINIJ33x6iP0z7Xz4hMlnVc50.jpg"
            alt="Beautiful Japanese Koi fish swimming in clear pond"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-20" />
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

          <div className="absolute inset-0 flex items-center justify-center p-12 z-40">
            <div className="text-center text-white space-y-6 max-w-lg">
              <h1 className="text-4xl font-bold text-balance leading-tight">
                Đặt lại mật khẩu ZenKoi
              </h1>
              <p className="text-lg text-white/90 text-pretty leading-relaxed">
                Tạo mật khẩu mới để tiếp tục trải nghiệm hệ thống quản lý cá Koi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
