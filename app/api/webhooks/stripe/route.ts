import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanByStripeId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );

        const userEmail = (customer as any).email;
        if (!userEmail) break;

        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (!user) break;

        const plan =
          getPlanByStripeId(subscription.items.data[0].price.id) || "FREE";
        const status =
          subscription.status === "active"
            ? "active"
            : subscription.status === "past_due"
              ? "past_due"
              : "canceled";

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan,
            status,
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            plan,
            status,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd:
              subscription.cancel_at_period_end || false,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );

        const userEmail = (customer as any).email;
        if (!userEmail) break;

        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (!user) break;

        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            status: "canceled",
            plan: "FREE",
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        // Handle successful payment
        const invoice = event.data.object as any;
        const customer = await stripe.customers.retrieve(
          invoice.customer as string
        );

        console.log("Payment succeeded for:", (customer as any).email);
        break;
      }

      case "invoice.payment_failed": {
        // Handle failed payment
        const invoice = event.data.object as any;
        const customer = await stripe.customers.retrieve(
          invoice.customer as string
        );

        const userEmail = (customer as any).email;
        if (!userEmail) break;

        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (!user) break;

        await prisma.subscription.update({
          where: { userId: user.id },
          data: { status: "past_due" },
        });

        console.log("Payment failed for:", userEmail);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
