import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { AUTH_COPY } from "@/content/uiCopy";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
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
      navigate(result.user?.isAdmin ? "/domain/dashboard" : "/dashboard");
      return;
    }

    setError(result.error || copy.genericError);
  };

  const handleGoogleLogin = async (credential: string) => {
    setError("");
    setLoading(true);
    const result = await googleLogin(credential);
    setLoading(false);
    if (result.success) {
      navigate(result.user?.isAdmin ? "/domain/dashboard" : "/dashboard");
    } else {
      setError(result.error || "Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    }
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

        <GoogleLoginButton onCredential={(credential) => void handleGoogleLogin(credential)} disabled={loading} />

        <div className="my-5 flex items-center gap-3 text-xs font-medium text-indigo-200/60">
          <span className="h-px flex-1 bg-indigo-400/25" />
          Hoặc đăng nhập bằng tài khoản
          <span className="h-px flex-1 bg-indigo-400/25" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-semibold text-indigo-100">{copy.identityLabel}</Label>
            <Input value={emailOrUsername} onChange={(event) => setEmailOrUsername(event.target.value)} placeholder="email@example.com" required className="mt-1 bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40" />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <Label className="font-semibold text-indigo-100">{copy.passwordLabel}</Label>
              <Link to="/forgot-password" className="text-xs font-bold text-amber-300 hover:text-amber-200 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative mt-1">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} required className="bg-indigo-900/50 border-indigo-400/30 text-white placeholder:text-indigo-300/40" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
          {copy.missingAccount}{" "}
          <Link to="/register" className="font-bold text-amber-300 hover:text-amber-200 hover:underline">
            {copy.register}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
