"use server";
import { prisma } from "@dubbie/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripeProductBackupArray = [
  {
    name: "casual",
    id: "price_1PLgTFL6tFox1TPFdLVndkzH",
    price: 999,
    credits: 100,
  },
  {
    name: "serious",
    id: "price_1PLgSyL6tFox1TPFmGSsH6Cd",
    price: 2999,
    credits: 500,
  },
  {
    name: "business",
    id: "price_1PLgSbL6tFox1TPF7emW4PNX",
    price: 4999,
    credits: 1000,
  },
];

const EMPTY_SUBSCRIPTION_INFO = {
  creditsUsed: 0,
  cancelled: false,
  totalCredits: 0,
  remainingCredits: 0,
  planName: "No Plan",
  planPrice: 0,
  renewalDate: null,
  customerPortalLink: null,
  hasSubscription: false,
};

export async function fetchUserSubscriptionInfo() {
  const user = await currentUser();

  if (!user) {
    return EMPTY_SUBSCRIPTION_INFO;
  }

  if (!user.privateMetadata?.stripeId) {
    return EMPTY_SUBSCRIPTION_INFO;
  }

  const subscription = await fetchUserSubscription(
    user.privateMetadata?.stripeId as string,
  );

  if (!subscription) {
    return EMPTY_SUBSCRIPTION_INFO;
  }

  const cancelled = subscription.cancel_at_period_end;
  const planDetails = await getPlanDetails(subscription);

  const usage = await fetchAndCalculateUsageForCurrentPeriod(
    user.id,
    planDetails.periodStart,
    planDetails.periodEnd,
  );
  const customerPortalLink = await createCustomerPortalLink(
    user.privateMetadata?.stripeId as string,
  );

  return {
    hasSubscription: true,
    creditsUsed: usage,
    cancelled,
    totalCredits: Number.parseInt(planDetails.credits),
    remainingCredits: Number.parseInt(planDetails.credits) - usage,
    planName: planDetails.planName,
    planPrice: planDetails.planPrice,
    renewalDate: planDetails.renewalDate,
    customerPortalLink,
  };
}
/* -------------------- */

async function createCustomerPortalLink(
  stripeCustomerId: string,
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: "https://your-return-url.com", // Replace with your actual return URL
  });
  return session.url;
}

async function fetchUserSubscription(stripeCustomerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
  });
  return subscriptions.data[0];
}

async function getPlanDetails(subscription: Stripe.Subscription) {
  const subscriptionItem = subscription.items.data[0];
  const planId = subscriptionItem.plan.id;
  const planPrice = subscriptionItem.plan.amount;
  const product = await stripe.products.retrieve(
    subscriptionItem.plan.product as string,
  );
  const { planName, credits } = getPlanNameAndCredits(product, planId);

  const renewalDate = new Date(subscription.current_period_end * 1000);
  const periodStart = subscription.current_period_start;
  const periodEnd = subscription.current_period_end;

  return { planName, credits, planPrice, renewalDate, periodStart, periodEnd };
}

function getPlanNameAndCredits(product: any, planId: string) {
  let planName = product.name;
  let credits = product.metadata.credits;

  if (!credits) {
    const backupProduct = stripeProductBackupArray.find(
      (item) => item.id === planId,
    );
    if (backupProduct) {
      credits = backupProduct.credits.toString();
      planName = backupProduct.name;
    }
  }

  return { planName, credits };
}

async function fetchAndCalculateUsageForCurrentPeriod(
  userId: string,
  periodStart: number,
  periodEnd: number,
): Promise<number> {
  const projects = await prisma.project.findMany({
    where: {
      createdAt: {
        gte: new Date(periodStart * 1000),
        lt: new Date(periodEnd * 1000),
      },
      userId: userId,
      status: "COMPLETED",
    },
    select: {
      audioDurationInSeconds: true,
    },
  });

  return calculateTotalDurationInMinutes(projects);
}

function calculateTotalDurationInMinutes(projects: any[]): number {
  const totalDurationInSeconds = projects.reduce(
    (total, project) => total + (project.audioDurationInSeconds ?? 0),
    0,
  );
  return totalDurationInSeconds / 60;
}
