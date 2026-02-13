"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import Link from "next/link";


const SUBSCRIPTION_PLANS = [
  {
    id: "FREE",
    name: "Starter",
    description: "AI coaching essentials",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "5 AI chat messages per day",
      "Preset workout programs",
      "Weight tracking",
      "Profile setup & fitness goals",
      "Community access",
    ],
    icon: Zap,
    popular: false,
    color: "from-neutral-500 to-neutral-600",
    border: "border-neutral-700",
  },
  {
    id: "PRO",
    name: "Pro",
    description: "Unlimited AI coaching",
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    features: [
      "Unlimited AI messages 🤖",
      "AI gym coach + nutritionist",
      "Preset & custom workouts",
      "Weight tracking & progress charts",
      "Workout history & stats",
      "Priority support",
    ],
    icon: Sparkles,
    popular: true,
    color: "from-blue-500 to-blue-600",
    border: "border-blue-500/50",
  },
  {
    id: "PREMIUM",
    name: "Elite",
    description: "Premium AI guidance",
    monthlyPrice: 12.99,
    yearlyPrice: 99.99,
    features: [
      "Everything in Pro",
      "Advanced analytics dashboard",
      "Detailed progress insights",
      "Monthly AI performance reviews",
      "Priority AI response queue",
      "Email support",
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

  const handleCheckout = async (planId: string) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (planId === "FREE") {
      return;
    }

    // For now, show a message that payment is coming soon
    alert(`Welcome to ${planId}! Payment integration coming soon. Thanks for your interest!`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <p className="text-green-400 font-bold text-sm">
              ⚡ Limited Time: 50% off annual plans
            </p>
          </div>
          <h1 className="text-5xl font-black mb-4">
            AI Coaching That Works
          </h1>
          <p className="text-xl text-neutral-400 mb-8">
            Your personal AI gym coach and nutritionist. Start free, upgrade to unlimited.
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
                isAnnual ? "bg-green-500" : "bg-neutral-700"
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
                Save 33%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
            const isCurrentPlan = false; // Subscription tracking removed for now

            return (
              <div
                key={plan.id}
                className={`relative bg-neutral-900 border rounded-2xl p-8 fade-in transition-all hover:scale-105 ${plan.border} ${
                  plan.popular
                    ? `border-green-500/50 shadow-lg shadow-green-500/20 ring-2 ring-green-500/30`
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      🎯 Most Popular - Save Most
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
                    <p className="text-4xl font-black text-white">Always Free</p>
                    <p className="text-sm text-neutral-400 mt-2">
                      No credit card needed ever
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">
                        £{price}
                      </span>
                      <span className="text-neutral-400">
                        {isAnnual ? "/year" : "/month"}
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-green-400 font-semibold mt-2">
                        Just £{(price / 12).toFixed(2)}/month
                      </p>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isCurrentPlan && plan.id !== "FREE"}
                  className={`w-full mb-8 font-semibold py-3 rounded-lg transition-all ${
                    isCurrentPlan && plan.id !== "FREE"
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : plan.popular
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20"
                        : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                  }`}
                >
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

        {/* Guarantee Section */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 mb-12 fade-in text-center">
          <p className="text-white text-lg font-bold mb-2">
            ✓ No Credit Card Required to Start
          </p>
          <p className="text-neutral-300">
            Try Starter free forever. Upgrade anytime when you're ready for unlimited AI coaching.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 fade-in">
          <h2 className="text-3xl font-bold text-white mb-8">
            Questions? We've Got Answers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "How many AI messages do I get on Starter?",
                a: "5 messages per day. That's enough to plan a workout, get nutrition advice, and ask follow-up questions. Need more? Upgrade to Pro for unlimited.",
              },
              {
                q: "What can the AI coaches help with?",
                a: "Our gym coach creates personalized workouts and training plans. Our nutritionist helps with meal planning, calorie advice, and dietary guidance. Both learn your goals over time.",
              },
              {
                q: "Do I need a credit card to start?",
                a: "Nope! Starter is completely free with no credit card required. Try it out, and upgrade to Pro anytime.",
              },
              {
                q: "What's included in Pro?",
                a: "Unlimited daily AI messages from both coaches, workout history tracking, weight progress charts, and priority support. Everything you need for serious training.",
              },
              {
                q: "What makes Elite different?",
                a: "Elite adds detailed analytics dashboards that show your training patterns and progress trends over time, plus advanced insights to optimize your fitness journey.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! No contract, no penalties. Cancel monthly anytime, or annual plans renew—no surprise charges.",
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
          <p className="mb-3">
            AI-powered fitness coaching for the web. Try free, upgrade when ready.
          </p>
          <p>
            Start free today with 5 daily AI messages.{" "}
            <Link href="/auth/signin" className="text-green-400 hover:text-green-300 font-semibold">
              Get started now →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
