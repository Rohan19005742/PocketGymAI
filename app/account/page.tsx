"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertCircle, CreditCard, Shield } from "lucide-react";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchSubscription();
    }
  }, [status, router]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure? You'll have access until the end of your billing period.")) {
      return;
    }

    setActionLoading("cancel");
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (response.ok) {
        alert("Subscription canceled. You'll have access until the end of your billing period.");
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      alert("Failed to cancel subscription");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeSubscription = async () => {
    setActionLoading("resume");
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume" }),
      });

      if (response.ok) {
        alert("Subscription resumed!");
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Failed to resume subscription:", error);
      alert("Failed to resume subscription");
    } finally {
      setActionLoading(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const planColors: Record<string, { bg: string; border: string; color: string }> = {
    FREE: {
      bg: "bg-neutral-900",
      border: "border-neutral-700",
      color: "text-neutral-400",
    },
    PRO: {
      bg: "bg-blue-900/20",
      border: "border-blue-500/50",
      color: "text-blue-400",
    },
    PREMIUM: {
      bg: "bg-purple-900/20",
      border: "border-purple-500/50",
      color: "text-purple-400",
    },
  };

  const currentPlan = subscription?.plan || "FREE";
  const planColor = planColors[currentPlan] || planColors.FREE;
  const periodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">Billing & Subscription</h1>
          <p className="text-neutral-400">Manage your account and subscription settings</p>
        </div>

        {/* Current Plan Card */}
        <div
          className={`border rounded-2xl p-8 mb-8 fade-in ${planColor.bg} ${planColor.border}`}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentPlan === "FREE" ? "Free Plan" : `${currentPlan} Plan`}
              </h2>
              <p className={`text-sm ${planColor.color}`}>
                {subscription?.status === "active" ? "✓ Active" : "Canceled"}
              </p>
            </div>
            <Shield className={`w-8 h-8 ${planColor.color}`} />
          </div>

          {/* Plan Details */}
          {currentPlan !== "FREE" && periodEnd && (
            <div className="space-y-3 mb-6 p-4 bg-neutral-800/50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-neutral-400">Billing Cycle Ends:</span>
                <span className="text-white font-semibold">{periodEnd}</span>
              </div>
              {subscription?.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    This subscription will cancel at the end of the billing period
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {currentPlan === "FREE" ? (
            <Button
              onClick={() => router.push("/pricing")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              Upgrade Plan
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/pricing")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Change Plan
              </Button>
              {!subscription?.cancelAtPeriodEnd ? (
                <Button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === "cancel"}
                  variant="outline"
                  className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                >
                  {actionLoading === "cancel" && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Cancel Subscription
                </Button>
              ) : (
                <Button
                  onClick={handleResumeSubscription}
                  disabled={actionLoading === "resume"}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
                >
                  {actionLoading === "resume" && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Resume Subscription
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Features Overview */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 fade-in">
          <h3 className="text-2xl font-bold text-white mb-6">Your Features</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                plan: "FREE",
                title: "Daily AI Messages",
                value: currentPlan === "FREE" ? "10 per day" : "Unlimited",
              },
              {
                plan: "PRO",
                title: "Weight Tracking",
                value: currentPlan !== "FREE" ? "Advanced" : "Basic",
              },
              {
                plan: "PRO",
                title: "Analytics Dashboard",
                value: currentPlan === "FREE" ? "—" : "✓ Included",
              },
              {
                plan: "PREMIUM",
                title: "Priority Support",
                value: currentPlan === "PREMIUM" ? "✓ Included" : "—",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  (currentPlan === "FREE" && feature.plan === "FREE") ||
                  (currentPlan !== "FREE" && feature.plan !== "FREE")
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : "bg-neutral-800/50"
                }`}
              >
                <p className="text-sm text-neutral-400 mb-1">{feature.title}</p>
                <p className="text-lg font-semibold text-white">{feature.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Billing Information</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-800/50 rounded-lg">
              <p className="text-sm text-neutral-400 mb-1">Account Email</p>
              <p className="text-white font-semibold">{session?.user?.email}</p>
            </div>

            {currentPlan !== "FREE" && (
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-400 mb-1">Billing Period</p>
                <p className="text-white font-semibold">
                  Monthly subscription
                  {periodEnd && ` • Renews ${periodEnd}`}
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Your payment information is secure
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    We use Stripe to securely process payments. Your credit card information is encrypted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us */}
        <div className="text-center mt-12">
          <p className="text-neutral-400 mb-4">
            Have questions or issues with your subscription?
          </p>
          <Button
            onClick={() => router.push("/contact")}
            className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
