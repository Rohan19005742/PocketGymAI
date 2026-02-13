import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

// Pricing data
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Free",
    description: "Get started with basic features",
    price: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_YEARLY_PRICE_ID,
    features: [
      "10 AI messages per day",
      "Static workout plan",
      "Basic weight tracking",
      "No analytics dashboard",
      "No grocery list generation",
    ],
    popular: false,
  },
  PRO: {
    name: "Pro",
    description: "Perfect for serious fitness enthusiasts",
    monthlyPrice: 9,
    yearlyPrice: 79, // ~$6.58/month
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    features: [
      "Unlimited AI chat",
      "Weekly auto-adjustments",
      "Dynamic calorie updates",
      "Macro tracking",
      "Analytics dashboard",
      "Grocery list generation",
    ],
    popular: true,
  },
  PREMIUM: {
    name: "Premium",
    description: "Everything you need for maximum results",
    monthlyPrice: 29,
    yearlyPrice: 290, // ~$24.17/month
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID,
    features: [
      "Everything in Pro",
      "Advanced analytics",
      "Priority AI processing",
      "Body recomposition projections",
      "Wearable integration support",
    ],
    popular: false,
  },
};

export const getPlanByStripeId = (priceId: string): string | null => {
  for (const [plan, data] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (
      data.monthlyPriceId === priceId ||
      data.yearlyPriceId === priceId
    ) {
      return plan;
    }
  }
  return null;
};
