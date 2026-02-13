"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, Crown, Zap } from "lucide-react";
import Link from "next/link";


const SUBSCRIPTION_PLANS = [
  {
    id: "FREE",
    name: "Free",
    description: "No credit card required",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "10 AI messages per day",
      "Static workout plan",
      "Basic weight tracking",
      "No analytics dashboard",
      "No grocery list generation",
    ],
    icon: Zap,
    popular: false,
    color: "from-neutral-500 to-neutral-600",
    border: "border-neutral-700",
  },
  {
    id: "PRO",
    name: "Pro",
    description: "Perfect for serious fitness enthusiasts",
    monthlyPrice: 9,
    yearlyPrice: 79,
    features: [
      "Unlimited AI chat",
      "Weekly auto-adjustments",
      "Dynamic calorie updates",
      "Macro tracking",
      "Analytics dashboard",
      "Grocery list generation",
    ],
    icon: Sparkles,
    popular: true,
    color: "from-blue-500 to-blue-600",
    border: "border-blue-500/50",
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Everything you need for maximum results",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Everything in Pro",
      "Advanced analytics",
      "Priority AI processing",
      "Body recomposition projections",
      "Wearable integration support",
    ],
    icon: Crown,
    popular: false,
    color: "from-purple-500 to-purple-600",
    border: "border-purple-500/50",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserPlan();
    }
  }, [session]);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      const subscription = await response.json();
      setUserPlan(subscription.plan);
    } catch (error) {
      console.error("Failed to fetch user plan:", error);
    }
  };

  const handleCheckout = async (planId: string) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (planId === "FREE") {
      return;
    }

    setLoading(planId);

    try {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
      if (!plan) return;

      // Map to environment variable keys
      const priceIdKey = isAnnual
        ? `NEXT_PUBLIC_STRIPE_${planId}_YEARLY_PRICE_ID`
        : `NEXT_PUBLIC_STRIPE_${planId}_MONTHLY_PRICE_ID`;

      const priceId = process.env[priceIdKey];

      if (!priceId) {
        alert(`Price ID not configured for ${planId}`);
        return;
      }

      const response = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/account`,
          cancelUrl: window.location.href,
        }),
      });

      const { sessionId } = await response.json();

      if (!sessionId) {
        alert("Failed to create checkout session");
        return;
      }

      // Redirect to Stripe checkout using the session ID
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl font-black mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-neutral-400 mb-8">
            Choose the perfect plan for your fitness journey
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm font-semibold ${
                !isAnnual ? "text-white" : "text-neutral-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAnnual ? "bg-blue-500" : "bg-neutral-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold ${
                isAnnual ? "text-white" : "text-neutral-400"
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-green-400 font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
            const monthlyEquivalent = isAnnual
              ? (plan.yearlyPrice / 12).toFixed(2)
              : plan.monthlyPrice.toFixed(2);
            const isCurrentPlan = userPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-neutral-900 border rounded-2xl p-8 fade-in transition-all hover:scale-105 ${plan.border} ${
                  plan.popular
                    ? `border-blue-500/50 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30`
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                {plan.id === "FREE" ? (
                  <div className="mb-6">
                    <p className="text-4xl font-black text-white">Free Forever</p>
                    <p className="text-sm text-neutral-400 mt-2">
                      No credit card required
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">
                        ${price}
                      </span>
                      <span className="text-neutral-400">
                        {isAnnual ? "/year" : "/month"}
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-green-400 font-semibold mt-2">
                        ${monthlyEquivalent}/month billed annually
                      </p>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={
                    loading !== null || (isCurrentPlan && plan.id !== "FREE")
                  }
                  className={`w-full mb-8 font-semibold py-3 rounded-lg transition-all ${
                    isCurrentPlan && plan.id !== "FREE"
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
                        : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                  }`}
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  ) : null}
                  {isCurrentPlan && plan.id !== "FREE"
                    ? "Current Plan"
                    : plan.id === "FREE"
                      ? "Get Started"
                      : "Upgrade Now"}
                </Button>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 fade-in">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes! You can change your plan at any time. Changes take effect at your next billing cycle.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, the Free plan gives you full access with daily message limits so you can try PocketGym risk-free.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit and debit cards through Stripe. Your payment data is encrypted and secure.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely! You can cancel your subscription anytime. You'll have access until the end of your billing period.",
              },
            ].map((faq, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-neutral-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-neutral-400">
          <p>
            Questions?{" "}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
