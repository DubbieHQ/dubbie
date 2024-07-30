import PricingCard from "@/components/PricingCard";
import { BackButton } from "@/components/elements/buttons/BackButton";

const prices = [
  {
    name: "casual",
    id: "price_1Pi7ogL6tFox1TPFIIPSgmbq",
  },
  {
    name: "serious",
    id: "price_1Pi7oeL6tFox1TPF9xbbouAQ",
  },
  {
    name: "business",
    id: "price_1Pi7ocL6tFox1TPF8YCAbetR",
  },
];

export default async function PricingPage() {
  return (
    <div className="h-screen w-full flex-col center">
      <BackButton className="absolute left-8 top-8" />

      <div className="relative text-xl font-medium text-black">Pricing</div>
      <div className="relative mt-4 text-sm font-normal opacity-50">
        You can always change/cancel your subscription at any time in your
        settings.
      </div>

      <div className="mb-6 mt-6 flex gap-4 center">
        {prices.map((price) => (
          <PricingCard
            key={price.id}
            priceId={price.id}
            variant={price.name === "serious" ? "recommended" : "regular"}
          />
        ))}
      </div>
    </div>
  );
}
