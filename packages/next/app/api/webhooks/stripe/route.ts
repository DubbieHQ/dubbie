import { headers } from "next/headers";
import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error constructing Stripe event:", error.message);
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
    console.error("Unknown error constructing Stripe event");
    return new Response("Webhook Error: Unknown error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const stripeCustomerId = session.customer as string;
    const dubbieUserId = session.client_reference_id as string;
    await clerkClient.users.updateUserMetadata(dubbieUserId, {
      privateMetadata: {
        stripeId: stripeCustomerId,
      },
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    // Update other subscriptions to cancel at period end if there's more than one subscription
    if (subscriptions.data.length > 1) {
      const currentSubscriptionId = session.subscription as string;

      for (const sub of subscriptions.data) {
        if (sub.id !== currentSubscriptionId) {
          await stripe.subscriptions.update(sub.id, {
            cancel_at_period_end: true,
          });
          console.log(`Set subscription ${sub.id} to cancel at period end`);
        }
      }
    }
  }

  return new Response(null, { status: 200 });
}
