import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AUTH_COPY } from "@/content/uiCopy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 2 fields
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const copy = AUTH_COPY.forgotPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetToken(null);
    setLoading(true);

    try {
      const response = await apiRequest<{ status: string; resetToken?: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(response.status);
      // move to OTP step regardless of whether backend returns token (smtp will send email)
      setStep(2);
      if (response.resetToken) {
        setResetToken(response.resetToken);
        setOtp(response.resetToken);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.genericError);
    } finally {
      setLoading(false);
    }
  };

  const validateOtpAndPasswords = () => {
    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Mã OTP phải gồm 6 chữ số");
      return false;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleResetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!validateOtpAndPasswords()) return;
    setResetLoading(true);
    try {
      const tokenToUse = otp || resetToken || "";
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: email, token: tokenToUse, password: newPassword }),
      });
      setMessage("Mật khẩu đã được đặt lại. Bạn có thể đăng nhập lại.");
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.genericError);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="mt-2 font-heading text-2xl font-bold">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        {error ? <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        {message ? <div className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">{message}</div> : null}

        {/* Dev-only token display remains available for convenience */}
        {resetToken ? (
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm text-foreground">
            <p className="font-semibold">Mã reset (dùng cho môi trường dev):</p>
            <p className="break-all">{resetToken}</p>
            <p className="mt-3 text-sm text-muted-foreground">Bạn có thể nhập mã này vào ô OTP bên dưới.</p>
          </div>
        ) : null}

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{copy.emailLabel}</Label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" required />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? copy.loading : copy.submit}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <Label>Nhập mã OTP</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" inputMode="numeric" required />
            </div>
            <div>
              <Label>Mật khẩu mới</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" required />
            </div>
            <div>
              <Label>Xác nhận mật khẩu</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu" required />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={resetLoading}>
              {resetLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-foreground">Mật khẩu của bạn đã được đặt lại thành công.</p>
            <Link to="/login" className="inline-block text-sm font-medium text-primary hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            {copy.backToLogin}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
