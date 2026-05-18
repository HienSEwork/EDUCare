import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { AUTH_COPY } from "@/content/uiCopy";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const copy = AUTH_COPY.login;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(emailOrUsername, password);

    setLoading(false);

    if (result.success) {
      navigate(result.user?.isAdmin ? "/admin/dashboard" : "/dashboard");
      return;
    }

    setError(result.error || copy.genericError);
  };

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="mt-2 font-heading text-2xl font-bold">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        {error ? <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{copy.identityLabel}</Label>
            <Input value={emailOrUsername} onChange={(event) => setEmailOrUsername(event.target.value)} placeholder="email@example.com" required />
          </div>

          <div>
            <Label>{copy.passwordLabel}</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} required />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? copy.loading : copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {copy.missingAccount}{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            {copy.register}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
