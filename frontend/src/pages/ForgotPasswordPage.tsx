import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { MessageResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "Không thể kết nối máy chủ. Vui lòng thử lại.";
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const requestOtp = async (isResend = false) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await apiRequest<MessageResponse>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setMessage(response.message);
      setStep("otp");
      setResendIn(60);
      if (isResend) setOtp("");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    await requestOtp();
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Mã OTP phải gồm đúng 6 chữ số.");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<MessageResponse>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), otp, newPassword: password }),
      });
      setMessage(response.message);
      setStep("done");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-16 dark:from-indigo-950 dark:via-slate-950 dark:to-purple-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md rounded-3xl border border-pink-200 bg-white/90 p-7 shadow-xl shadow-pink-100/60 backdrop-blur md:p-9 dark:border-amber-300/20 dark:bg-indigo-950/80 dark:shadow-black/20"
      >
        <Link to="/login" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-pink-600 hover:text-pink-700 dark:text-amber-300 dark:hover:text-amber-200">
          <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
        </Link>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 dark:bg-amber-300/15 dark:text-amber-300">
            {step === "done" ? <CheckCircle2 className="h-7 w-7" /> : step === "email" ? <Mail className="h-7 w-7" /> : <KeyRound className="h-7 w-7" />}
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 dark:text-white">
            {step === "email" ? "Quên mật khẩu" : step === "otp" ? "Nhập mã xác thực" : "Đổi mật khẩu thành công"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-indigo-200/75">
            {step === "email"
              ? "Nhập email tài khoản, EDUcare sẽ gửi mã OTP có hiệu lực trong 15 phút."
              : step === "otp"
                ? `Mã xác thực đã được gửi tới ${email}.`
                : "Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ."}
          </p>
        </div>

        {error ? <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-950/30 dark:text-red-200">{error}</div> : null}
        {message && step !== "done" ? <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-950/30 dark:text-emerald-200">{message}</div> : null}

        {step === "email" ? (
          <form onSubmit={submitEmail} className="space-y-5">
            <div>
              <Label htmlFor="reset-email" className="font-bold text-slate-800 dark:text-indigo-100">Email</Label>
              <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" required className="mt-2 h-12 border-pink-200 bg-pink-50/50 dark:border-indigo-400/30 dark:bg-indigo-900/50" />
            </div>
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-pink-600 font-bold text-white hover:bg-pink-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
              {loading ? "Đang gửi mã..." : "Gửi mã OTP"}
            </Button>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <Label htmlFor="otp" className="font-bold text-slate-800 dark:text-indigo-100">Mã OTP</Label>
              <Input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" required className="mt-2 h-12 text-center text-lg font-black tracking-[0.4em] border-pink-200 bg-pink-50/50 dark:border-indigo-400/30 dark:bg-indigo-900/50" />
            </div>
            <div>
              <Label htmlFor="new-password" className="font-bold text-slate-800 dark:text-indigo-100">Mật khẩu mới</Label>
              <div className="relative mt-2">
                <Input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required className="h-12 border-pink-200 bg-pink-50/50 pr-11 dark:border-indigo-400/30 dark:bg-indigo-900/50" />
                <button type="button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-indigo-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password" className="font-bold text-slate-800 dark:text-indigo-100">Xác nhận mật khẩu</Label>
              <Input id="confirm-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required className="mt-2 h-12 border-pink-200 bg-pink-50/50 dark:border-indigo-400/30 dark:bg-indigo-900/50" />
            </div>
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-pink-600 font-bold text-white hover:bg-pink-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
              {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </Button>
            <button type="button" disabled={loading || resendIn > 0} onClick={() => void requestOtp(true)} className="w-full text-sm font-bold text-pink-600 disabled:text-slate-400 dark:text-amber-300 dark:disabled:text-indigo-300/50">
              {resendIn > 0 ? `Gửi lại mã sau ${resendIn}s` : "Gửi lại mã OTP"}
            </button>
          </form>
        ) : null}

        {step === "done" ? (
          <Button type="button" onClick={() => navigate("/login")} className="h-12 w-full rounded-full bg-pink-600 font-bold text-white hover:bg-pink-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
            Đăng nhập ngay
          </Button>
        ) : null}
      </motion.div>
    </div>
  );
}
