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
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.genericError);
    } finally {
      setLoading(false);
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
        {resetToken ? (
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm text-foreground">
            <p className="font-semibold">Mã reset (dùng cho môi trường dev):</p>
            <p className="break-all">{resetToken}</p>
            <p className="mt-3 text-sm text-muted-foreground">Sao chép mã này hoặc bấm vào nút bên dưới để chuyển sang trang đặt lại mật khẩu.</p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Đặt lại mật khẩu ngay
            </Link>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{copy.emailLabel}</Label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" required />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? copy.loading : copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            {copy.backToLogin}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
