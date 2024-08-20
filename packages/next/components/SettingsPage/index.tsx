import React from "react";
import { Line } from "@/components/elements/Line";
import { Section } from "./Section";
import SubscriptionDetails from "./SubscriptionDetails";
import LogoutButton from "./LogOutButton";
import { URLS } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10 px-16 py-10">
      <SubscriptionDetails />

      <Section>
        <Section.Title>Contact us</Section.Title>
        <Line orientation="horizontal" />
        <Section.ContentArea>
          <Section.KVRow title="Email" value="help@dubbie.com" />
          <Section.KVRow title="Phone number" value="14156327282" />
          <Section.KVRow
            title="Discord"
            value={<a href={URLS.DISCORD}>Click to join</a>}
          />
          <Section.KVRow
            title="Github"
            value={<a href={URLS.GITHUB}>Click to view</a>}
          />
        </Section.ContentArea>
      </Section>
      <LogoutButton />
    </div>
  );
}
