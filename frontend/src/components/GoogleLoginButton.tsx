import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/lib/api/client";

type GoogleCredentialResponse = { credential?: string };

type GoogleAccounts = {
  id: {
    initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
    renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

interface GoogleLoginButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}

const SCRIPT_ID = "google-identity-services";
let initializedClientId = "";
let activeCredentialCallback: ((response: GoogleCredentialResponse) => void) | null = null;

export default function GoogleLoginButton({ onCredential, disabled = false }: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const disabledRef = useRef(disabled);
  const [scriptReady, setScriptReady] = useState(Boolean(window.google?.accounts));
  const [clientId, setClientId] = useState(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || "");
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  callbackRef.current = onCredential;
  disabledRef.current = disabled;

  useEffect(() => {
    if (clientId) return;
    apiRequest<{ googleClientId: string }>("/public/config")
      .then((config) => setClientId(config.googleClientId?.trim() || ""))
      .catch(() => setLoadError(true));
  }, [clientId]);

  useEffect(() => {
    if (!clientId || window.google?.accounts) {
      setScriptReady(Boolean(window.google?.accounts));
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement("script");
    const handleLoad = () => setScriptReady(true);
    const handleError = () => setLoadError(true);

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [clientId, retryKey]);

  useEffect(() => {
    if (!clientId || !scriptReady || !containerRef.current || !window.google?.accounts) return;

    containerRef.current.replaceChildren();
    activeCredentialCallback = (response) => {
      if (response.credential && !disabledRef.current) callbackRef.current(response.credential);
    };
    if (initializedClientId !== clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => activeCredentialCallback?.(response),
      });
      initializedClientId = clientId;
    }
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "signin_with",
      locale: "vi",
      width: Math.min(containerRef.current.clientWidth || 360, 400),
    });
  }, [clientId, scriptReady]);

  if (loadError) {
    return (
      <button type="button" onClick={() => { document.getElementById(SCRIPT_ID)?.remove(); setLoadError(false); setScriptReady(false); setRetryKey((value) => value + 1); }} className="h-11 w-full rounded-full border border-pink-200 bg-white text-sm font-semibold text-slate-700 hover:bg-pink-50">
        Đăng nhập bằng Google
      </button>
    );
  }

  if (!clientId || !scriptReady) return <div className="flex h-11 w-full items-center justify-center rounded-full border border-pink-200 bg-white text-sm font-semibold text-slate-500">Đang tải đăng nhập bằng Google...</div>;

  return <div ref={containerRef} className={disabled ? "pointer-events-none opacity-60" : "flex min-h-11 justify-center"} />;
}
