import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Sparkles, Loader2, Zap, Crown, Lock, ArrowRight, Star, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, ApiError } from "@/lib/api/client";
import { SubscriptionPlan } from "@/types/api";

interface PlanItem {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  period: string;
  features: string[];
  color: string;
  popular: boolean;
  badge?: string;
  planType?: "REGULAR" | "TRIAL" | "PROMOTION";
}

const defaultPlans: PlanItem[] = [
  {
    id: "FREE",
    name: "Học viên Miễn phí",
    price: "0đ",
    rawPrice: 0,
    period: "Miễn phí mãi mãi",
    features: [
      "Xem 30% bài học cơ bản",
      "Đọc các bài viết blog cộng đồng",
      "Chơi game giáo dục cơ bản",
      "Bảo mật thông tin 100% ẩn danh"
    ],
    color: "border-slate-700/60 bg-slate-900/50 backdrop-blur-xl text-slate-100",
    popular: false,
    planType: "REGULAR"
  },
  {
    id: "VIP_1M",
    name: "Học viên VIP 1 Tháng",
    price: "29.000đ",
    rawPrice: 29000,
    period: "/ 30 ngày",
    features: [
      "Xem 100% bài học chuyên sâu",
      "Hệ thống câu hỏi khuyên học động",
      "Làm tất cả bài tập quiz & kiểm tra",
      "Chơi full 8+ game tình huống 3D",
      "Tích lũy Streak & XP xếp hạng",
      "Hỗ trợ tư vấn trực tuyến"
    ],
    color: "border-cyan-400/60 bg-gradient-to-b from-cyan-950/40 via-purple-950/30 to-slate-900/60 shadow-[0_0_35px_rgba(6,182,212,0.2)] md:scale-[1.03] z-10",
    popular: true,
    badge: "⚡ Gợi ý cho bạn",
    planType: "REGULAR"
  },
  {
    id: "PREMIUM_4M",
    name: "Premium 4 Tháng",
    price: "99.000đ",
    rawPrice: 99000,
    period: "/ 120 ngày",
    features: [
      "Mọi quyền lợi đặc quyền gói VIP",
      "Tư vấn ưu tiên 24/7 với chuyên gia",
      "Mở khóa sớm các chủ đề nhạy cảm",
      "Tham gia phòng chat kín đặc quyền",
      "Tiết kiệm 15% chi phí đăng ký"
    ],
    color: "border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-purple-950/30 to-slate-900/60 shadow-[0_0_35px_rgba(245,158,11,0.2)]",
    popular: false,
    badge: "💎 Tiết kiệm nhất",
    planType: "REGULAR"
  },
];

const mapPlanToItem = (apiPlan: SubscriptionPlan): PlanItem => {
  if (!apiPlan) {
    return defaultPlans[0];
  }
  const planId = apiPlan.id ? String(apiPlan.id) : "FREE";
  const isFree = planId === "FREE";
  const isVip = planId.toUpperCase().includes("VIP");
  const isPremium = planId.toUpperCase().includes("PREMIUM");

  let features: string[] = [];
  if (isFree) {
    features = [
      "Xem 30% bài học cơ bản",
      "Đọc các bài viết blog cộng đồng",
      "Chơi game giáo dục cơ bản",
      "Bảo mật thông tin 100% ẩn danh"
    ];
  } else if (planId === "VIP_1M") {
    features = [
      "Xem 100% bài học chuyên sâu",
      "Hệ thống câu hỏi khuyên học động",
      "Làm tất cả bài tập quiz & kiểm tra",
      "Chơi full 8+ game tình huống 3D",
      "Tích lũy Streak & XP xếp hạng",
      "Hỗ trợ tư vấn trực tuyến"
    ];
  } else if (planId === "PREMIUM_4M") {
    features = [
      "Mọi quyền lợi đặc quyền gói VIP",
      "Tư vấn ưu tiên 24/7 với chuyên gia",
      "Mở khóa sớm các chủ đề nhạy cảm",
      "Tham gia phòng chat kín đặc quyền",
      "Tiết kiệm 15% chi phí đăng ký"
    ];
  } else if (apiPlan.description) {
    features = String(apiPlan.description).split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
  }

  const rawPrice = typeof apiPlan.price === "number" ? apiPlan.price : (Number(apiPlan.price) || 0);
  let formattedPrice = rawPrice > 0 ? `${rawPrice.toLocaleString("vi-VN")}đ` : "0đ";
  if (isFree) {
    formattedPrice = "0đ";
  }

  let period = "Miễn phí mãi mãi";
  if (!isFree && apiPlan.durationDays) {
    period = `/ ${apiPlan.durationDays} ngày`;
  }

  let color = "border-slate-700/60 bg-slate-900/50 backdrop-blur-xl text-slate-100";
  let popular = false;
  let badge: string | undefined = undefined;

  if (apiPlan.planType === "PROMOTION") {
    color = "border-amber-400/80 bg-gradient-to-b from-amber-950/50 via-purple-950/40 to-slate-900/70 shadow-[0_0_40px_rgba(245,158,11,0.25)] md:scale-[1.03] z-10";
    popular = true;
    badge = "🔥 Ưu đãi cực Hot";
  } else if (isVip) {
    color = "border-cyan-400/60 bg-gradient-to-b from-cyan-950/40 via-purple-950/30 to-slate-900/60 shadow-[0_0_35px_rgba(6,182,212,0.2)] md:scale-[1.03] z-10";
    popular = true;
    badge = "⚡ Gợi ý cho bạn";
  } else if (isPremium) {
    color = "border-pink-400/60 bg-gradient-to-b from-pink-950/40 via-purple-950/30 to-slate-900/60 shadow-[0_0_35px_rgba(244,63,94,0.2)]";
    popular = false;
    badge = "💎 Tiết kiệm nhất";
  }

  return {
    id: planId,
    name: apiPlan.name || "Gói học tập",
    price: formattedPrice,
    rawPrice: rawPrice,
    period: period,
    features: features.length > 0 ? features : ["Đầy đủ tính năng hỗ trợ học tập"],
    color: color,
    popular: popular,
    badge: badge,
    planType: apiPlan.planType
  };
};

const getTierLevel = (planId?: string) => {
  if (!planId) return 1;
  const idUpper = String(planId).toUpperCase();
  if (idUpper.includes("PREMIUM")) return 3;
  if (idUpper === "FREE") return 1;
  return 2;
};

const getUserTierLevel = (userPlan?: string) => {
  if (!userPlan) return 1;
  const planUpper = String(userPlan).toUpperCase();
  if (planUpper === "PREMIUM") return 3;
  if (planUpper === "POPULAR") return 2;
  return 1;
};

function formatExpiryDate(dateStr?: string) {
  if (!dateStr) return "";
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

  const [displayPlans, setDisplayPlans] = useState<PlanItem[]>(defaultPlans);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTrials, setActiveTrials] = useState<SubscriptionPlan[]>([]);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);

  const userSubPlan = user?.subscriptionPlanId 
    ? allPlans.find(p => p.id === user.subscriptionPlanId)
    : null;
  const isUserOnTrial = userSubPlan 
    ? userSubPlan.planType === "TRIAL"
    : user?.subscriptionPlanId === "VIP_TRIAL";

  const formatPromoDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const apiPlans = await apiRequest<SubscriptionPlan[]>("/payments/plans");
        if (Array.isArray(apiPlans) && apiPlans.length > 0) {
          setAllPlans(apiPlans);
          const trials = apiPlans.filter(p => p.planType === "TRIAL" && p.active);
          setActiveTrials(trials);

          const displayable = apiPlans.filter(p => p.planType !== "TRIAL");
          const sorted = [...displayable].sort((a, b) => {
            const priceA = a.price ? Number(a.price) : 0;
            const priceB = b.price ? Number(b.price) : 0;
            return priceA - priceB;
          });
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
    <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header Title Section */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Nâng Cấp Tri Thức – Khám Phá Không Giới Hạn</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Bảng Giá Đăng Ký Thành Viên <br />
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
              Gói Đồng Hành EDUcare
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-sm md:text-base font-medium text-indigo-100/80 mt-4 leading-relaxed"
          >
            Mở khóa toàn bộ kiến thức giáo dục giới tính chuẩn y khoa, trải nghiệm game tình huống 3D và tương tác tư vấn riêng tư 24/7 cùng chuyên gia.
          </motion.p>
        </div>

        {/* Trial Promotion Banners */}
        {Array.isArray(activeTrials) && activeTrials.map((trialPlan) => {
          if (!trialPlan || !trialPlan.id) return null;
          const isEligible = !user || (user.subscriptionPlanId !== trialPlan.id && user.plan !== "popular" && user.plan !== "premium");
          
          return isEligible && (
            <motion.div
              key={trialPlan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="mx-auto max-w-3xl mb-8 rounded-3xl border border-pink-400/50 bg-gradient-to-r from-pink-950/70 via-purple-950/60 to-slate-900/80 p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.2)]"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-xl shadow-md">
                  <Gift className="h-6 w-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-heading font-extrabold text-white text-base sm:text-lg">
                      {trialPlan.name}
                    </h3>
                    <span className="rounded-full bg-pink-500/30 border border-pink-400/50 text-pink-200 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider animate-pulse">
                      Đặc quyền tân thủ
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-100/90 font-medium mt-1 leading-relaxed">
                    {trialPlan.description || `Tất cả tài khoản mới đăng ký đều được tự động kích hoạt dùng thử VIP ${trialPlan.durationDays} ngày miễn phí.`}
                  </p>
                  {(trialPlan.startDate || trialPlan.endDate) && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-pink-200 bg-pink-900/40 border border-pink-500/40 rounded-xl py-1 px-3 font-semibold">
                      <span className="text-pink-400">⏱️ Thời gian áp dụng:</span>
                      <span>
                        {trialPlan.startDate ? `từ ${formatPromoDate(trialPlan.startDate)} ` : ""}
                        {trialPlan.endDate ? `đến ${formatPromoDate(trialPlan.endDate)}` : "vô thời hạn"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Active Trial Info Banner */}
        {isUserOnTrial && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl mb-10 rounded-3xl border border-emerald-400/50 bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-slate-900/80 p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.2)]"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xl shadow-md">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-extrabold text-emerald-200 text-base sm:text-lg">Bạn đang sử dụng quyền dùng thử VIP miễn phí!</h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-0.5">
                  Hạn dùng thử đến ngày: <strong className="font-black text-amber-300">{formatExpiryDate(user?.subscriptionEndDate || "")}</strong>. Trải nghiệm đầy đủ trước khi nâng cấp chính thức nhé!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mx-auto max-w-md mb-8 rounded-2xl bg-rose-950/80 border border-rose-500/40 p-4 text-center text-sm font-semibold text-rose-200 backdrop-blur-md shadow-lg">
            {error}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {Array.isArray(displayPlans) && displayPlans.map((plan, index) => {
            if (!plan || !plan.id) return null;
            const isCurrentPlan =
              (plan.id === "FREE" && (!user?.subscriptionPlanId || user.subscriptionPlanId === "FREE")) ||
              (plan.id === user?.subscriptionPlanId) ||
              (plan.id === "VIP_1M" && !user?.subscriptionPlanId && user?.plan?.toUpperCase() === "POPULAR") ||
              (plan.id === "PREMIUM_4M" && !user?.subscriptionPlanId && user?.plan?.toUpperCase() === "PREMIUM");

            const isLowerTier =
              plan.id !== "FREE" && getTierLevel(plan.id) < getUserTierLevel(user?.plan);

            const isVip1M = plan.id === "VIP_1M";
            const isPremium = plan.id.toUpperCase().includes("PREMIUM");
            const isVip = plan.id.toUpperCase().includes("VIP");
            const isPromo = plan.planType === "PROMOTION";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className={`relative rounded-3xl border p-7 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${plan.color}`}
              >
                <div>
                  {/* Badge */}
                  {plan.badge && (
                    <span className={`absolute -top-3.5 left-6 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-wider shadow-lg ${
                      isPromo
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 animate-pulse"
                        : isVip
                          ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-slate-950"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    }`}>
                      {plan.badge}
                    </span>
                  )}

                  {/* Header Title */}
                  <div className="flex items-center justify-between mt-2">
                    <h3 className="font-heading text-xl md:text-2xl font-extrabold text-white leading-snug">
                      {plan.name}
                    </h3>
                    {isVip && <Crown className="h-6 w-6 text-amber-300 shrink-0" />}
                    {isPremium && <Star className="h-6 w-6 text-pink-400 shrink-0" />}
                  </div>

                  {/* Price Row */}
                  <div className="mt-5 mb-6 flex items-baseline gap-1.5">
                    <span className="font-heading text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs font-bold text-indigo-200/70">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent my-6" />

                  {/* Features List */}
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs md:text-sm font-medium text-indigo-100/90 leading-relaxed">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                          isVip
                            ? "text-cyan-300"
                            : isPremium
                              ? "text-pink-400"
                              : "text-indigo-400"
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button Area */}
                <div className="mt-9">
                  {plan.id === "FREE" ? (
                    <div className="w-full rounded-2xl border border-slate-700/60 bg-slate-800/40 py-3.5 text-center text-slate-400 font-extrabold text-xs uppercase tracking-wider backdrop-blur-md">
                      Gói mặc định
                    </div>
                  ) : isCurrentPlan ? (
                    <div className="w-full rounded-2xl border border-emerald-500/60 bg-emerald-950/50 p-4 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-md">
                      <div className="flex items-center justify-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-wider">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span>Gói đang kích hoạt</span>
                      </div>
                      {user?.subscriptionEndDate && (
                        <p className="text-[11px] text-emerald-200/80 font-semibold mt-1">
                          Hạn dùng: <strong className="text-amber-300 font-bold">{formatExpiryDate(user.subscriptionEndDate)}</strong>
                        </p>
                      )}
                    </div>
                  ) : isLowerTier ? (
                    <div className="w-full rounded-2xl border border-slate-700/60 bg-slate-800/40 p-3.5 text-center backdrop-blur-md">
                      <span className="text-xs font-bold text-slate-400">Đã bao gồm trong gói Premium</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={loadingPlanId !== null}
                      className={`w-full rounded-2xl h-13 font-black text-sm transition-all active:scale-[0.98] shadow-lg ${
                        isPromo
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/20"
                          : isVip1M || isVip
                            ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white hover:brightness-110 shadow-cyan-500/25 border-0"
                            : isPremium
                              ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:brightness-110 shadow-pink-500/25 border-0"
                              : "border border-indigo-400/40 bg-indigo-950/60 text-cyan-200 hover:bg-indigo-900/80"
                      }`}
                    >
                      {loadingPlanId === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          Đang tạo đơn thanh toán...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Đăng ký gói ngay <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Methods & Security Guarantee Banner */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-500/30 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left max-w-lg">
                <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span>Cổng thanh toán bảo mật VietQR 24/7</span>
                </div>
                <h4 className="font-heading font-extrabold text-white text-lg sm:text-xl">
                  Kích hoạt tài khoản tự động trong 30 giây
                </h4>
                <p className="text-xs sm:text-sm text-indigo-100/70 font-medium mt-1">
                  Chuyển khoản qua quét mã QR mở ứng dụng Ngân hàng hoặc Ví điện tử bất kỳ. Hệ thống xử lý tự động 100%.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center">
                {["MB Bank", "Vietcombank", "Techcombank", "ACB", "MoMo", "VNPay QR"].map((bank) => (
                  <span
                    key={bank}
                    className="rounded-xl border border-indigo-400/25 bg-indigo-950/50 px-4 py-2 text-indigo-200 font-bold text-xs shadow-inner"
                  >
                    {bank}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
