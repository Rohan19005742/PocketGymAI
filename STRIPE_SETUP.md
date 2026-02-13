# Stripe Setup Guide for PocketGym AI

## Overview
This guide walks you through setting up Stripe for subscription management in the PocketGym AI fitness app.

## Prerequisites
- Stripe account (create at https://stripe.com)
- Node.js and npm installed
- Running PocketGym AI application

## Step 1: Create Stripe Account & Get API Keys

1. Go to https://stripe.com and create an account
2. Verify your email
3. Go to Dashboard → Developers → API keys
4. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Create Products and Prices

### Create Products

You need to create 3 products in Stripe:

#### 1. Free Plan (No Stripe product needed - handled in code)

#### 2. Pro Plan
1. Go to Products → Create Product
2. Name: `Pro Plan`
3. Description: `Unlimited AI chat, advanced features`
4. Pricing:
   - Monthly: $9/month
   - Annual: $79/year
5. Billing Interval: Monthly (for monthly price), Yearly (for annual price)
6. Note the Price IDs for both

#### 3. Premium Plan
1. Go to Products → Create Product
2. Name: `Premium Plan`
3. Description: `Everything in Pro + Advanced analytics + Priority support`
4. Pricing:
   - Monthly: $29/month
   - Annual: $290/year
5. Billing Interval: Monthly (for monthly price), Yearly (for annual price)
6. Note the Price IDs for both

### Get Price IDs
In Stripe Dashboard → Products:
- Click each product
- Go to Pricing section
- Copy the Price ID for each option

Example format: `price_1Abc123xyz`

## Step 3: Set Environment Variables

Create or update your `.env.local` file with:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Stripe Price IDs (Replace with your actual Price IDs from Step 2)
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_1Abc123PRO_MONTHLY
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_1Abc123PRO_YEARLY
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1Abc123PREMIUM_MONTHLY
NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_1Abc123PREMIUM_YEARLY

# Optional: Free plan prices (set to empty or same as others, not used for checkout)
NEXT_PUBLIC_STRIPE_FREE_MONTHLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_FREE_YEARLY_PRICE_ID=

# Webhook Secret (Get this after setting up webhooks)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Next Auth URL
NEXTAUTH_URL=http://localhost:3000
```

## Step 4: Set Up Webhooks

### Create a Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - For local testing, use: `http://localhost:3000/api/webhooks/stripe`
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. You'll see the Webhook Signing Secret (`whsec_...`)
7. Copy this and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Local Testing with Stripe CLI (Optional)

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli

# Login to your account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret and add to .env.local
```

## Step 5: Database Setup

Run Prisma migrations to create the subscription tables:

```bash
npm run prisma:migrate
# or
npx prisma migrate dev --name add_subscriptions
```

This will create:
- `Subscription` table
- `UsageTracking` table

## Step 6: Testing

### Test Checkout Flow

1. Start your app: `npm run dev`
2. Go to `/pricing`
3. Click "Upgrade Now" on Pro or Premium plan
4. You'll be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits

### Test Webhooks (Local)

If using Stripe CLI:
```bash
# Simulate a subscription creation
stripe trigger customer.subscription.created

# Check logs in CLI to verify webhook was received
```

### Verify Subscription Created

1. After successful checkout, you should be redirected to `/account`
2. Check that your subscription status shows "Pro" or "Premium"
3. In Stripe Dashboard → Customers, you should see your test customer with active subscription

## Step 7: Feature Gating

The feature gating system is already implemented. Use in your API routes:

```typescript
import { checkAIMessageLimit, hasFeature } from "@/lib/feature-gating";

// Check message limit for FREE tier
const result = await checkAIMessageLimit(userEmail);
if (!result.allowed) {
  return NextResponse.json({ error: result.error }, { status: 429 });
}

// Check if user has a feature
const hasAnalytics = await hasFeature(userEmail, "analytics");
if (!hasAnalytics) {
  return NextResponse.json(
    { error: "This feature requires Pro plan" },
    { status: 403 }
  );
}
```

## API Routes Overview

### GET/POST `/api/subscriptions`
- GET: Fetch user's current subscription
- POST: Manage subscription (cancel, resume)

### POST `/api/subscriptions/checkout`
- Create Stripe checkout session
- Returns `sessionId` for redirect

### POST `/api/webhooks/stripe`
- Receives Stripe webhook events
- Updates subscription status in database
- Handles subscription creation, updates, and cancellations

## Going to Production

### 1. Switch to Live Keys
```bash
# Replace test keys with live keys from Stripe Dashboard
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

### 2. Create Live Products and Prices
- Repeat Step 2 with your live account
- Update Price IDs in `.env.local`

### 3. Update Webhook URL
- In Stripe Dashboard, update webhook endpoint to your production domain
- Update webhook signing secret

### 4. Set Correct URLs
```bash
NEXTAUTH_URL=https://yourdomain.com
```

### 5. Test in Production
- Use real test cards or request test mode access
- Monitor Stripe Dashboard for transactions

## Important Security Notes

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Secret Key stays server-side** - Never expose in client code
3. **Verify webhook signatures** - Already done in `/api/webhooks/stripe`
4. **Validate all subscriptions server-side** - Use database + Stripe checks
5. **Keep Stripe SDK updated** - Regularly run `npm update stripe`

## Troubleshooting

### Checkout redirects to blank page
- Check that Price IDs are correct in `.env.local`
- Verify products exist in Stripe Dashboard
- Check browser console for errors

### Webhooks not firing
- Verify endpoint URL in Stripe Dashboard
- Check webhook signing secret in `.env.local`
- Use Stripe CLI to test locally: `stripe trigger customer.subscription.created`

### Subscription not updating after payment
- Check that webhook is enabled and receiving events
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check database for `Subscription` records

### Feature gating not working
- Verify user has a `Subscription` record (created automatically or via checkout)
- Check email matches between sessions and database
- Review `/lib/feature-gating.ts` for custom rules

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- GitHub Issues: Create an issue in your project repo
- Stripe Support: https://support.stripe.com

## Summary of Files Modified/Created

✓ `/lib/stripe.ts` - Stripe configuration and pricing
✓ `/lib/prisma.ts` - Prisma client setup
✓ `/lib/feature-gating.ts` - Feature gating logic
✓ `/app/api/subscriptions/checkout/route.ts` - Checkout API
✓ `/app/api/subscriptions/route.ts` - Subscription management API
✓ `/app/api/webhooks/stripe/route.ts` - Stripe webhook handler
✓ `/app/pricing/page.tsx` - Pricing page with Stripe integration
✓ `/app/account/page.tsx` - Account/billing page
✓ `/prisma/schema.prisma` - Updated with Subscription & UsageTracking models
✓ `package.json` - Added stripe dependency

## Next Steps

1. [ ] Set up Stripe account and get API keys
2. [ ] Create products and prices in Stripe Dashboard
3. [ ] Add environment variables to `.env.local`
4. [ ] Set up webhooks with webhook signing secret
5. [ ] Run Prisma migrations
6. [ ] Test checkout flow locally
7. [ ] Test feature gating
8. [ ] Deploy to production
9. [ ] Switch to live keys
10. [ ] Monitor transactions in Stripe Dashboard
