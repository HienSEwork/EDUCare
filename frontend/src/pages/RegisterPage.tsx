import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { AUTH_COPY } from "@/content/uiCopy";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length < 4) return { label: AUTH_COPY.register.strength.weak, color: "bg-destructive", width: "w-1/4" };
  if (password.length < 6) return { label: AUTH_COPY.register.strength.medium, color: "bg-peach", width: "w-2/4" };
  if (password.length < 8) return { label: AUTH_COPY.register.strength.fair, color: "bg-teal", width: "w-3/4" };
  return { label: AUTH_COPY.register.strength.strong, color: "bg-mint", width: "w-full" };
}

export default function RegisterPage() {
  const copy = AUTH_COPY.register;
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }

    if (form.password.length < 6) {
      setError(copy.passwordTooShort);
      return;
    }

    const age = Number(form.age);
    if (Number.isNaN(age) || age < 10 || age > 20) {
      setError(copy.invalidAge);
      return;
    }

    setLoading(true);
    const result = await register({ ...form, age });
    setLoading(false);

    if (result.success) {
      navigate(result.user?.isAdmin ? "/admin/dashboard" : "/dashboard");
      return;
    }

    setError(result.error || copy.genericError);
  };

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card"
      >
        <div className="mb-6 text-center">
          <h1 className="mt-2 font-heading text-2xl font-bold">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        {error ? <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{copy.fullName}</Label>
            <Input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Nguyễn Văn A" required />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="email@example.com" required />
          </div>

          <div>
            <Label>{copy.username}</Label>
            <Input value={form.username} onChange={(event) => update("username", event.target.value)} placeholder="nguyenvana" required />
          </div>

          <div>
            <Label>{copy.password}</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                placeholder={copy.passwordPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {form.password ? (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy.passwordStrength}: {strength.label}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <Label>{copy.confirmPassword}</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) => update("confirmPassword", event.target.value)}
              placeholder={copy.confirmPasswordPlaceholder}
              required
            />
          </div>

          <div>
            <Label>{copy.age}</Label>
            <Input type="number" value={form.age} onChange={(event) => update("age", event.target.value)} min={10} max={20} placeholder="15" required />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? copy.loading : copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {copy.hasAccount}{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {copy.login}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
