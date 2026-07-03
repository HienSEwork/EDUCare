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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-teal-50/40">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-[2.5rem] border border-pink-100/80 bg-white/90 shadow-[0_20px_50px_rgba(244,63,94,0.12)] backdrop-blur-sm p-8 md:p-10"
      >
        <div className="mb-6 text-center">
          <h1 className="mt-2 font-heading text-2xl font-black text-gray-900">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-gray-500 font-medium">{copy.subtitle}</p>
        </div>

        {error ? <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-semibold text-gray-700">{copy.identityLabel}</Label>
            <Input value={emailOrUsername} onChange={(event) => setEmailOrUsername(event.target.value)} placeholder="email@example.com" required className="mt-1" />
          </div>

          <div>
            <Label className="font-semibold text-gray-700">{copy.passwordLabel}</Label>
            <div className="relative mt-1">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} required />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-2 gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white shadow-[0_6px_20px_rgba(244,63,94,0.25)] hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(244,63,94,0.35)] transition-all"
            disabled={loading}
          >
            {loading ? copy.loading : copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {copy.missingAccount}{" "}
          <Link to="/register" className="font-bold text-pink-600 hover:text-pink-700 hover:underline">
            {copy.register}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
