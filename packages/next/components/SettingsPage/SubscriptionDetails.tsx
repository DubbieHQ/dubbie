"use client";

import React from "react";
import { Line } from "@/components/elements/Line";
import { Button } from "@/components/elements/buttons/DefaultButton";
import useSubscriptionInfo from "@/lib/hooks/useSubscriptionInfo";
import { Section } from "./Section";
import { Spinner } from "../ui/Spinner";
import { useUser } from "@clerk/nextjs";

export default function SubscriptionDetails() {
  const { data: subscriptionInfo, isLoading } = useSubscriptionInfo();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (isLoading) {
    return (
      <Section>
        <Section.Title>Subscription</Section.Title>
        <Line orientation="horizontal" />
        <Section.ContentArea>
          <Section.KVRow
            title={<p>Loading...</p>}
            value={<Spinner size="small" />}
          />
        </Section.ContentArea>
      </Section>
    );
  }

  const {
    totalCredits,
    remainingCredits,
    cancelled,
    planName,
    renewalDate,
    customerPortalLink,
    hasSubscription,
  } = subscriptionInfo || {};

  if (!hasSubscription || cancelled) {
    return (
      <Section>
        <Section.Title>Subscription</Section.Title>
        <Line orientation="horizontal" />
        <Section.ContentArea>
          <Section.KVRow title="Email" value={email ?? "N/A"} />
          <Section.KVRow title="Your plan" value="No active subscription" />
        </Section.ContentArea>
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            className="mt-2 self-end text-sm"
            size="small"
            href="/pricing"
          >
            Upgrade
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <Section.Title>Subscription</Section.Title>
      <Line orientation="horizontal" />
      <Section.ContentArea>
        <Section.KVRow title="Email" value={email ?? "N/A"} />
        <Section.KVRow title="Your plan" value={planName ?? "🔄"} />
        <Section.KVRow
          title="Credits per month"
          value={totalCredits !== undefined ? totalCredits.toFixed(2) : "🔄"}
        />
        <Section.KVRow
          title="Credits remaining"
          value={
            remainingCredits !== undefined ? remainingCredits.toFixed(2) : "🔄"
          }
        />
        <Section.KVRow
          title="Renewal date"
          value={renewalDate ? renewalDate.toLocaleDateString() : "🔄"}
        />
      </Section.ContentArea>
      <div className="flex w-full items-center justify-end gap-2">
        <Button
          className="mt-2 self-end text-sm"
          size="small"
          href="/pricing"
          variant="secondary"
        >
          Change Plan
        </Button>
        <Button
          className="mt-2 self-end text-sm"
          size="small"
          href={customerPortalLink || "/pricing"}
        >
          Manage Subscription
        </Button>
      </div>
    </Section>
  );
}
