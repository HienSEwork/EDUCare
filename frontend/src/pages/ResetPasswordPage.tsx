import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AUTH_COPY } from "@/content/uiCopy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api/client";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const copy = AUTH_COPY.resetPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(copy.passwordTooShort);
      return;
    }

    if (!token) {
      setError(copy.missingToken);
      return;
    }

    setLoading(true);

    try {
      await apiRequest<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setMessage(copy.successMessage);
      setTimeout(() => navigate("/login"), 1200);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{copy.tokenLabel}</Label>
            <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder={copy.tokenPlaceholder} required />
          </div>

          <div>
            <Label>{copy.password}</Label>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} required />
          </div>

          <div>
            <Label>{copy.confirmPassword}</Label>
            <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={copy.confirmPasswordPlaceholder} required />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? copy.loading : copy.submit}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
