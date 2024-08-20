"use client";

import { revalidatePathAction } from "@/lib/actions/revalidatePath";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({
  className,
  url,
}: {
  className?: string;
  url?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg bg-default p-1.5 transition-all duration-500 center hover:bg-default-hover",
        className,
      )}
      onClick={() => {
        revalidatePathAction("/(dashboard)", "page");
        if (url) {
          router.push(url);
        } else {
          router.push("/");
        }
      }}
    >
      <ChevronLeft size={20} />
    </div>
  );
}
