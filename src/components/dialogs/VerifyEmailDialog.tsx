"use client";

import { useState, useRef, useEffect } from "react";
import { useConfirmEmail, useSendOtp } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RotateCcw } from "lucide-react";

interface VerifyEmailDialogProps {
  isOpen: boolean;
  email: string;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}

const RESEND_COUNTDOWN = 30; // 30 seconds

export function VerifyEmailDialog({
  isOpen,
  email,
  onSuccess,
  onOpenChange,
}: VerifyEmailDialogProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6));
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const { mutate: confirmEmail, isPending: isVerifying } =
    useConfirmEmail(onSuccess);
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp(() => {
    // Reset code and start countdown after successful resend
    setCode(Array(6).fill(""));
    setResendCountdown(RESEND_COUNTDOWN);
    inputRefs.current[0]?.focus();
  });

  // Focus first input and start countdown when dialog opens
  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
      setResendCountdown(RESEND_COUNTDOWN);
    }
  }, [isOpen]);

  // Handle countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      countdownInterval.current = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            if (countdownInterval.current) {
              clearInterval(countdownInterval.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [resendCountdown]);

  // Clear error when code changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [code, error]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (digits.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newCode[i] = digits[i];
      }
      setCode(newCode);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, 5);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 0);
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số");
      return;
    }

    confirmEmail(
      { email, code: fullCode },
      {
        onError: () => {
          setError("Mã xác thực không chính xác. Vui lòng thử lại.");
        },
      },
    );
  };

  const handleResend = () => {
    if (resendCountdown === 0) {
      sendOtp({ email });
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");
  const canResend = resendCountdown === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Xác thực Email
          </DialogTitle>
          <DialogDescription className="text-center">
            Chúng tôi đã gửi mã xác thực (6 chữ số) đến
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input Fields */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nhập mã xác thực</Label>
            <div className="flex gap-2 justify-between">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-14 w-14 text-center text-xl font-bold border-2 rounded-lg focus:border-primary focus:ring-0 transition-all duration-200 hover:border-primary/50"
                  placeholder="•"
                  disabled={isVerifying}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={!isCodeComplete || isVerifying}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-10 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Đang xác thực...
              </div>
            ) : (
              "Xác thực"
            )}
          </Button>

          {/* Resend Code Info */}
          <div className="space-y-3">
            {canResend ? (
              <div className="text-center text-sm text-muted-foreground">
                Không nhận được mã?{" "}
                <button
                  onClick={handleResend}
                  disabled={isSendingOtp || isVerifying}
                  className="text-primary hover:text-accent font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Gửi lại mã
                </button>
              </div>
            ) : (
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Gửi lại mã trong{" "}
                  <span className="font-semibold text-primary">
                    {resendCountdown}s
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
