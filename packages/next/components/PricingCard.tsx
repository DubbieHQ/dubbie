import { stripe } from "@/lib/stripe";
import Image from "next/image";
import { Button } from "./elements/buttons/DefaultButton";
import { CircularCheckMark } from "./icons/CircularCheckMark";
import { cva } from "class-variance-authority";
import { currentUser } from "@clerk/nextjs/server";
import { URLS } from "@/lib/constants";

const cardVariants = cva(
  [
    `flex h-[450px] w-[275px] shrink-0 grow-0
    flex-col justify-between rounded-[35px] px-6 py-6 text-black`,
  ],
  {
    variants: {
      variant: {
        recommended: "bg-btn border border-btn shadow-a",
        regular: "border border-btn bg-btn bg-opacity-50",
      },
    },
    defaultVariants: {
      variant: "regular",
    },
  },
);

export default async function PricingCard({
  priceId,
  variant,
}: {
  priceId: string;
  variant: "recommended" | "regular";
}) {
  const user = await currentUser();
  const stripeCustomerId = user?.privateMetadata?.stripeId as
    | string
    | undefined;

  let userPriceId: string | undefined;
  let isSubscribedToThisPlan = false;

  if (stripeCustomerId) {
    const userSubscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    if (userSubscriptions.data.length > 0) {
      userPriceId = userSubscriptions.data[0].items.data[0].price.id;
      isSubscribedToThisPlan = userPriceId === priceId;
    }
  }

  const price = await stripe.prices.retrieve(priceId);
  const product = await stripe.products.retrieve(price.product as string);
  const checkoutLink = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    client_reference_id: user?.id as string,
    success_url: URLS.SUCCCESS_URL,
    cancel_url: URLS.CANCEL_URL,
    customer: stripeCustomerId,
    metadata: {
      clerkUserId: user?.id as string,
    },
    allow_promotion_codes: true,
  });

  const cardClasses = cardVariants({ variant });

  return (
    <div className={cardClasses}>
      <div className="self-start">
        <div
          className={`w-fit rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-black ${
            variant === "recommended" ? "" : "pointer-events-none opacity-0"
          }`}
        >
          Most popular
        </div>
        <Image
          width={105}
          height={105}
          src={product.images[0]}
          alt={product.name}
        />
        <div className="mt-2 text-xl font-semibold">{product.name}</div>
        <div className="mt-2 text-sm leading-[16px] opacity-40">
          {product.description}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-start gap-2">
          <div className="text-3xl font-bold">
            ${((price.unit_amount ?? 0) / 100).toFixed(2)}
          </div>

          <div className="flex flex-col items-start text-sm leading-[14px] opacity-50">
            <div>per</div>
            <div>month</div>
          </div>
        </div>

        <Button
          className="mt-5 rounded-2xl font-normal shadow-none"
          variant="primary"
          href={checkoutLink.url as string}
          disabled={isSubscribedToThisPlan}
        >
          {isSubscribedToThisPlan ? "Current" : "Subscribe"}
        </Button>

        <div className="mt-5 text-sm opacity-70">This includes:</div>
        <div className="mt-2 flex flex-col gap-1.5 text-sm opacity-70">
          {product.marketing_features.map((feature) => (
            <div key={feature.name} className="ml-1 flex items-center gap-2">
              <CircularCheckMark />
              {feature.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
