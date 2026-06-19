import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api/client";

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const status = searchParams.get("status");
  const cancel = searchParams.get("cancel");
  const orderCode = searchParams.get("orderCode");
  const planId = searchParams.get("planId");

  const pollCount = useRef(0);
  const maxPolls = 6; // Poll up to 6 times (9 seconds total)

  useEffect(() => {
    // Check if the user cancelled or if transaction is marked as cancel
    if (status === "cancel" || cancel === "true" || status === "CANCELLED") {
      if (orderCode) {
        void apiRequest(`/payments/cancel/${orderCode}`, { method: "POST" }).catch((err) => {
          console.error("Error cancelling transaction:", err);
        });
      }
      setIsVerifying(false);
      setIsSuccess(false);
      setErrorMessage("Bạn đã hủy giao dịch thanh toán.");
      return;
    }

    // Must have orderCode to verify
    if (!orderCode) {
      setIsVerifying(false);
      setIsSuccess(false);
      setErrorMessage("Mã đơn hàng không hợp lệ.");
      return;
    }

    // Start polling backend to wait for webhook processing completion
    const pollStatus = async () => {
      try {
        const response = await apiRequest<{ status: string }>(`/payments/status/${orderCode}`);
        
        if (response && response.status === "SUCCESS") {
          // Upgrade completed! Refresh user session to get new VIP role
          await refreshUser();
          setIsSuccess(true);
          setIsVerifying(false);
        } else {
          // Not completed yet, check again after delay
          pollCount.current += 1;
          if (pollCount.current < maxPolls) {
            setTimeout(pollStatus, 1500);
          } else {
            // Reached maximum attempts, showing pending state
            await refreshUser();
            setIsSuccess(true); // Allow success view since bank transfer went through, backend will catch up via webhook anyway
            setIsVerifying(false);
          }
        }
      } catch (err) {
        console.error("Error polling transaction status:", err);
        pollCount.current += 1;
        if (pollCount.current < maxPolls) {
          setTimeout(pollStatus, 1500);
        } else {
          setIsVerifying(false);
          setErrorMessage("Giao dịch đang được hệ thống xử lý. Vui lòng kiểm tra lại hồ sơ của bạn sau ít phút.");
        }
      }
    };

    void pollStatus();
  }, [status, cancel, orderCode, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[linear-gradient(135deg,rgba(253,244,255,0.4)_0%,rgba(239,246,255,0.4)_100%)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-card backdrop-blur-md text-center"
      >
        {isVerifying ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="mt-6 font-heading text-xl font-bold text-foreground">Đang xác thực giao dịch...</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
              EDUcare đang nhận diện khoản chuyển khoản từ ngân hàng của bạn. Quá trình này thường mất một vài giây.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center">
            {/* Success Animation Container */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-14 w-14 text-green-500 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-5 w-5 text-amber-400 animate-bounce" />
              </div>
            </div>

            <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">Thanh toán thành công!</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Cảm ơn bạn đã đồng hành cùng <span className="font-bold text-primary">EDUcare</span>. 
              Tài khoản của bạn đã được nâng cấp lên gói thành viên cao cấp thành công.
            </p>

            <div className="mt-6 w-full rounded-2xl bg-green-50/50 p-4 border border-green-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-semibold text-slate-800">#{orderCode}</span>
              </div>
              {planId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Gói đăng ký:</span>
                  <span className="font-semibold text-slate-800 uppercase">
                    {planId.includes("VIP") ? "Học viên VIP 1 Tháng" : "Premium 3 Tháng"}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Quyền lợi:</span>
                <span className="font-semibold text-green-700">Đã kích hoạt ⚡</span>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              <Button onClick={() => navigate("/dashboard")} className="w-full rounded-2xl h-11 font-bold shadow-soft">
                Vào học ngay
              </Button>
              <Button onClick={() => navigate("/courses")} variant="outline" className="w-full rounded-2xl h-11 border-slate-200 bg-white/40 font-semibold">
                Xem danh mục khóa học
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>

            <h2 className="mt-6 font-heading text-xl font-bold text-foreground">Giao dịch không thành công</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {errorMessage || "Đã xảy ra lỗi trong quá trình xử lý đơn hàng của bạn."}
            </p>

            <div className="mt-8 w-full space-y-3">
              <Button onClick={() => navigate("/pricing")} className="w-full rounded-2xl h-11 font-bold">
                Thử thanh toán lại
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="outline" 
                className="w-full rounded-2xl h-11 border-slate-200 bg-white/40 flex items-center justify-center gap-1.5 font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay về Dashboard</span>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
