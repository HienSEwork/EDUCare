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
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-indigo-400/30 bg-indigo-950/70 backdrop-blur-xl p-8 md:p-10 shadow-2xl text-white"
      >
        <div className="mb-6 text-center">
          <h1 className="mt-2 font-heading text-2xl font-black text-white">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-indigo-200/70 font-medium">{copy.subtitle}</p>
        </div>

        {error ? <div className="mb-4 rounded-lg bg-destructive/20 p-3 text-sm text-destructive border border-destructive/30">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-semibold text-indigo-100">{copy.fullName}</Label>
            <Input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Nguyễn Văn A" required className="mt-1 bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40" />
          </div>

          <div>
            <Label className="font-semibold text-indigo-100 font-sans">Email</Label>
            <Input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="email@example.com" required className="mt-1 bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40" />
          </div>

          <div>
            <Label className="font-semibold text-indigo-100">{copy.username}</Label>
            <Input value={form.username} onChange={(event) => update("username", event.target.value)} placeholder="nguyenvana" required className="mt-1 bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40" />
          </div>

          <div>
            <Label className="font-semibold text-indigo-100">{copy.password}</Label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                placeholder={copy.passwordPlaceholder}
                required
                className="bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {form.password ? (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-indigo-950">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="mt-1 text-xs text-indigo-200/70">
                  {copy.passwordStrength}: {strength.label}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <Label className="font-semibold text-indigo-100">{copy.confirmPassword}</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) => update("confirmPassword", event.target.value)}
              placeholder={copy.confirmPasswordPlaceholder}
              required
              className="mt-1 bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40"
            />
          </div>

          <div>
            <Label className="font-semibold text-indigo-100">{copy.age}</Label>
            <Input type="number" value={form.age} onChange={(event) => update("age", event.target.value)} min={10} max={20} placeholder="15" required className="mt-1 bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40" />
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-2 gap-2 rounded-full magic-btn-primary font-bold text-slate-950 shadow-lg"
            disabled={loading}
          >
            {loading ? copy.loading : copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-indigo-200/70">
          {copy.hasAccount}{" "}
          <Link to="/login" className="font-bold text-amber-300 hover:text-amber-200 hover:underline">
            {copy.login}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
