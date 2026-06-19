import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, ApiError } from "@/lib/api/client";
import { SubscriptionPlan } from "@/types/api";

interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  popular: boolean;
  badge?: string;
}

const plans: PlanItem[] = [
  {
    id: "FREE",
    name: "Học viên Miễn phí",
    price: "0đ",
    period: "",
    features: [
      "Xem 30% bài học cơ bản",
      "Đọc các bài viết blog",
      "Chơi game giáo dục cơ bản",
      "Ẩn danh bảo mật thông tin"
    ],
    color: "border-slate-200/80 bg-white/40",
    popular: false,
  },
  {
    id: "VIP_1M",
    name: "Học viên VIP 1 Tháng",
    price: "99.000đ",
    period: "/ 30 ngày",
    features: [
      "Xem 100% bài học chuyên sâu",
      "Hệ thống câu hỏi khuyên học động",
      "Làm tất cả bài tập quiz",
      "Chơi game tình huống đầy đủ",
      "Tích lũy Streak & XP xếp hạng",
      "Hỗ trợ tư vấn trực tuyến"
    ],
    color: "border-primary bg-primary/5 shadow-soft",
    popular: true,
    badge: "⚡ Gợi ý cho bạn",
  },
  {
    id: "PREMIUM_3M",
    name: "Premium 3 Tháng",
    price: "249.000đ",
    period: "/ 90 ngày",
    features: [
      "Mọi quyền lợi của gói VIP",
      "Tư vấn ưu tiên 24/7 với chuyên gia",
      "Mở khóa sớm các chủ đề nhạy cảm",
      "Tham gia phòng chat kín đặc quyền",
      "Nhận chứng chỉ điện tử chính thức",
      "Tiết kiệm 16% chi phí"
    ],
    color: "border-pink-300/80 bg-pink-50/20",
    popular: false,
    badge: "💎 Tiết kiệm nhất",
  },
];

const mapPlanToItem = (apiPlan: SubscriptionPlan): PlanItem => {
  const isFree = apiPlan.id === "FREE";
  const isVip = apiPlan.id.toUpperCase().includes("VIP");
  const isPremium = apiPlan.id.toUpperCase().includes("PREMIUM");

  let features: string[] = [];
  if (isFree) {
    features = [
      "Xem 30% bài học cơ bản",
      "Đọc các bài viết blog",
      "Chơi game giáo dục cơ bản",
      "Ẩn danh bảo mật thông tin"
    ];
  } else if (apiPlan.id === "VIP_1M") {
    features = [
      "Xem 100% bài học chuyên sâu",
      "Hệ thống câu hỏi khuyên học động",
      "Làm tất cả bài tập quiz",
      "Chơi game tình huống đầy đủ",
      "Tích lũy Streak & XP xếp hạng",
      "Hỗ trợ tư vấn trực tuyến"
    ];
  } else if (apiPlan.id === "PREMIUM_3M") {
    features = [
      "Mọi quyền lợi của gói VIP",
      "Tư vấn ưu tiên 24/7 với chuyên gia",
      "Mở khóa sớm các chủ đề nhạy cảm",
      "Tham gia phòng chat kín đặc quyền",
      "Nhận chứng chỉ điện tử chính thức",
      "Tiết kiệm 16% chi phí"
    ];
  } else if (apiPlan.description) {
    features = apiPlan.description.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
  }

  let formattedPrice = `${apiPlan.price.toLocaleString("vi-VN")}đ`;
  if (isFree || apiPlan.price === 0) {
    formattedPrice = "0đ";
  }

  let period = "";
  if (!isFree && apiPlan.durationDays) {
    period = `/ ${apiPlan.durationDays} ngày`;
  }

  let color = "border-slate-200 bg-white/40";
  let popular = false;
  let badge: string | undefined = undefined;

  if (isVip) {
    color = "border-primary bg-primary/5 shadow-soft";
    popular = true;
    badge = "⚡ Gợi ý cho bạn";
  } else if (isPremium) {
    color = "border-pink-300/80 bg-pink-50/20";
    popular = false;
    badge = "💎 Tiết kiệm nhất";
  }

  return {
    id: apiPlan.id,
    name: apiPlan.name,
    price: formattedPrice,
    period: period,
    features: features,
    color: color,
    popular: popular,
    badge: badge
  };
};

const getTierLevel = (planId: string) => {
  const idUpper = planId.toUpperCase();
  if (idUpper.includes("PREMIUM")) return 3;
  if (idUpper === "FREE") return 1;
  return 2; // Default any other/custom plan (including VIP) to tier 2
};

const getUserTierLevel = (userPlan: string | undefined) => {
  const planUpper = userPlan?.toUpperCase();
  if (planUpper === "PREMIUM") return 3;
  if (planUpper === "POPULAR") return 2;
  return 1;
};

function formatExpiryDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch (e) {
    return "";
  }
}

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [displayPlans, setDisplayPlans] = useState<PlanItem[]>(plans);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const apiPlans = await apiRequest<SubscriptionPlan[]>("/payments/plans");
        if (apiPlans && apiPlans.length > 0) {
          const sorted = [...apiPlans].sort((a, b) => a.price - b.price);
          setDisplayPlans(sorted.map(mapPlanToItem));
        }
      } catch (err) {
        console.error("Failed to load subscription plans dynamically, using local fallback.", err);
      }
    };
    void fetchPlans();
  }, []);

  const handleSelectPlan = async (plan: PlanItem) => {
    if (plan.id === "FREE") {
      navigate("/dashboard");
      return;
    }

    if (!user) {
      navigate("/login?redirect=/pricing");
      return;
    }

    setLoadingPlanId(plan.id);
    setError(null);

    try {
      const response = await apiRequest<{ checkoutUrl: string }>("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: plan.id,
          cancelUrl: window.location.origin + `/payment/callback?status=cancel&planId=${plan.id}`,
          returnUrl: window.location.origin + `/payment/callback?status=success&planId=${plan.id}`
        })
      });

      if (response && response.checkoutUrl) {
        // Redirect to PayOS payment link
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error("Không nhận được liên kết thanh toán từ cổng.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof ApiError 
          ? err.message 
          : "Đã xảy ra lỗi khi tạo yêu cầu thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-[linear-gradient(135deg,rgba(253,244,255,0.4)_0%,rgba(239,246,255,0.4)_100%)]">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Title Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-extrabold text-primary mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>Đầu tư cho kiến thức và an toàn bản thân</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl"
          >
            Chọn gói đồng hành cùng <span className="text-primary">EDUcare</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-xl text-sm md:text-base font-medium text-slate-500 mt-3 leading-relaxed"
          >
            Trang bị kiến thức giáo dục giới tính khoa học, an toàn ẩn danh và kết nối cùng chuyên gia tư vấn tin cậy.
          </motion.p>
        </div>

        {error && (
          <div className="mx-auto max-w-md mb-8 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-center text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {displayPlans.map((plan, index) => {
            const isCurrentPlan = 
              (plan.id === "FREE" && (!user?.subscriptionPlanId || user.subscriptionPlanId === "FREE")) ||
              (plan.id === user?.subscriptionPlanId) ||
              (plan.id === "VIP_1M" && !user?.subscriptionPlanId && user?.plan?.toUpperCase() === "POPULAR") ||
              (plan.id === "PREMIUM_3M" && !user?.subscriptionPlanId && user?.plan?.toUpperCase() === "PREMIUM");

            const isLowerTier = 
              plan.id !== "FREE" && getTierLevel(plan.id) < getUserTierLevel(user?.plan);

            const isVip = plan.id.toUpperCase().includes("VIP");
            const isPremium = plan.id.toUpperCase().includes("PREMIUM");
            
            // Dynamic card styles
            let cardStyle = "border-slate-200/80 bg-white/70 shadow-md hover:scale-[1.02] hover:shadow-lg";
            if (isVip) {
              cardStyle = "border-primary bg-gradient-to-b from-primary/[0.06] to-primary/[0.01] shadow-[0_15px_40px_rgba(147,51,234,0.12)] md:scale-[1.03] md:-translate-y-1 z-10 hover:scale-[1.05] hover:shadow-[0_15px_40px_rgba(147,51,234,0.18)]";
            } else if (isPremium) {
              cardStyle = "border-pink-300 bg-gradient-to-b from-pink-500/[0.04] to-pink-500/[0.01] shadow-[0_15px_40px_rgba(244,63,94,0.1)] hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(244,63,94,0.16)]";
            } else {
              cardStyle = "border-slate-200/80 bg-gradient-to-b from-slate-100/50 to-white/40 shadow-md hover:scale-[1.02] hover:shadow-lg";
            }

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative rounded-3xl border-2 p-6 flex flex-col justify-between backdrop-blur-md transition-all duration-300 ${cardStyle}`}
              >
                <div>
                  {plan.badge && (
                    <span className={`absolute -top-3 left-6 rounded-full px-3.5 py-1 text-[11px] font-black shadow-soft uppercase tracking-wider ${
                      isVip ? "bg-primary text-white" : "bg-pink-500 text-white"
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                  
                  <div className="flex justify-between items-start mt-1">
                    <h3 className="font-heading text-xl md:text-2xl font-black text-slate-800 leading-none">{plan.name}</h3>
                  </div>

                  <div className="mt-4 mb-5 flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-none">{plan.price}</span>
                    {plan.period && <span className="text-[13px] font-extrabold text-slate-500">{plan.period}</span>}
                  </div>

                  <hr className="border-slate-150 my-5" />

                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[14px] md:text-[15px] font-semibold text-slate-600 leading-relaxed">
                        <Check className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                          isPremium ? "text-pink-500 animate-pulse" : "text-primary"
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {plan.id === "FREE" ? (
                    <div className="w-full rounded-2xl border border-slate-200 bg-slate-100/60 py-3 text-center text-slate-500 font-extrabold text-[14px] shadow-inner">
                      Gói cơ bản mặc định
                    </div>
                  ) : isCurrentPlan ? (
                    <div className="w-full rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-3.5 text-center shadow-[0_10px_25px_rgba(16,185,129,0.1)] relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10 text-emerald-600">
                        <ShieldCheck className="h-14 w-14" />
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-black text-[13px] uppercase tracking-wider">
                        <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
                        <span>Gói đang kích hoạt</span>
                      </div>
                      {user?.subscriptionEndDate && (
                        <div className="mt-2.5 flex flex-col items-center justify-center bg-white/90 border border-emerald-200/80 rounded-xl py-1.5 px-3 shadow-sm">
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black">Hạn sử dụng gói</span>
                          <span className="text-sm font-extrabold text-emerald-700 mt-0.5">
                            {formatExpiryDate(user.subscriptionEndDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : isLowerTier ? (
                    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3 px-3 text-center shadow-inner relative overflow-hidden">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <ShieldCheck className="h-5 w-5 text-slate-450 shrink-0" />
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-wide mt-1">Đã bao gồm trong Premium</span>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={loadingPlanId !== null}
                      className={`w-full rounded-2xl h-12 font-black text-sm transition-all active:scale-[0.98] ${
                        isVip
                          ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-soft hover:shadow-lg hover:shadow-primary/20"
                          : isPremium
                            ? "bg-pink-500 text-white hover:bg-pink-600 shadow-soft hover:shadow-lg hover:shadow-pink-500/20"
                            : "border-2 border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-800"
                      }`}
                      variant={isVip || isPremium ? "default" : "outline"}
                    >
                      {loadingPlanId === plan.id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang khởi tạo...
                        </span>
                      ) : user ? (
                        "Đăng ký ngay"
                      ) : (
                        "Đăng ký thành viên"
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Payment Info */}
        <div className="mt-16 text-center flex flex-col gap-3.5 justify-center items-center">
          <p className="font-extrabold text-sm text-slate-500 uppercase tracking-wider">Hình thức thanh toán quét mã VietQR tự động:</p>
          <div className="flex gap-3 justify-center items-center flex-wrap">
            {["MB Bank", "Vietcombank", "Techcombank", "ACB", "MoMo / VNPay QR"].map((bank) => (
              <span
                key={bank}
                className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-700 font-extrabold text-sm shadow-sm transition-all hover:border-primary/30"
              >
                {bank}
              </span>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
