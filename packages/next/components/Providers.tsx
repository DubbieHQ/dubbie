"use client";

import { fetchUserSubscriptionInfo } from "@/lib/actions/fetchSubscriptionInfo";
import { QUERY_KEYS } from "@/lib/constants";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "jotai";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    queryClient.prefetchQuery(QUERY_KEYS.subscription, () => {
      return fetchUserSubscriptionInfo();
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={500}>
        <ClerkProvider>
          <Provider>{children}</Provider>
        </ClerkProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
