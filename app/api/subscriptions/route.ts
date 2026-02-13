import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.subscription) {
      // Create default FREE subscription
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "active",
        },
      });
      return NextResponse.json(subscription);
    }

    return NextResponse.json(user.subscription);
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Failed to get subscription" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { action } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = user.subscription;

    if (action === "cancel") {
      if (!subscription.stripeSubscriptionId) {
        return NextResponse.json(
          { error: "No active Stripe subscription" },
          { status: 400 }
        );
      }

      // Cancel at period end
      await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: true },
      });

      return NextResponse.json({
        message: "Subscription will be canceled at period end",
      });
    }

    if (action === "resume") {
      if (!subscription.stripeSubscriptionId) {
        return NextResponse.json(
          { error: "No active Stripe subscription" },
          { status: 400 }
        );
      }

      // Resume subscription
      await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: false,
        }
      );

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: false },
      });

      return NextResponse.json({
        message: "Subscription resumed",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Subscription management error:", error);
    return NextResponse.json(
      { error: "Failed to manage subscription" },
      { status: 500 }
    );
  }
}
