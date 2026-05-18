import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Miễn phí",
    price: "Miễn phí",
    period: "",
    features: ["Xem 30% bài học", "Đọc blog", "Chơi game cơ bản"],
    color: "border-teal",
    popular: false,
  },
  {
    name: "Phổ biến",
    price: "29.000đ",
    period: "/ tháng",
    features: ["Tất cả bài học", "Quiz tương tác", "Game đầy đủ", "Streak và XP", "Chứng chỉ hoàn thành"],
    color: "border-primary",
    popular: true,
  },
  {
    name: "Cao cấp",
    price: "49.000đ",
    period: "/ tháng",
    features: ["Mọi thứ trong gói Phổ biến", "Trợ lý AI học tập", "Game nâng cao", "Nội dung nâng cao", "Hỗ trợ ưu tiên"],
    color: "border-pink",
    popular: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">Bảng giá</h1>
          <p className="mx-auto max-w-lg text-muted-foreground">Chọn gói phù hợp với nhu cầu học tập và mức độ đồng hành mà bạn mong muốn.</p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border-2 ${plan.color} p-6 ${plan.popular ? "scale-105 shadow-hover" : "shadow-card"}`}
            >
              {plan.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold gradient-primary text-primary-foreground">
                  Phổ biến nhất
                </span>
              ) : null}
              <h3 className="mb-2 font-heading text-xl font-bold">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={user ? "#" : "/register"}>
                <Button className={`w-full ${plan.popular ? "gradient-primary text-primary-foreground" : ""}`} variant={plan.popular ? "default" : "outline"}>
                  {user ? "Chọn gói" : "Đăng ký ngay"}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Thanh toán qua: MoMo, VNPay, ZaloPay
        </div>
      </div>
    </div>
  );
}
