"use client";

import { Home } from "lucide-react";
import { DubbieLogo } from "./icons/DubbieLogo";
import { SidebarButton } from "./elements/buttons/SidebarButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftSidebar() {
  const pathname = usePathname();

  const isOnDashboard = pathname === "/";
  return (
    <div className="flex w-[240px] shrink-0 flex-col items-center justify-between gap-8 py-8">
      <Link href="/">
        <DubbieLogo />
      </Link>
      {/* Add other sidebar content here */}

      {/* middle contnet */}
      <div className="flex w-full flex-1 flex-col justify-between gap-4 px-4">
        <Link href="/" passHref>
          <SidebarButton
            icon={<Home size={18} opacity={0.6} />}
            className={isOnDashboard ? "bg-btn-focused" : ""}
          >
            <div className="text-sm">Projects</div>
          </SidebarButton>
        </Link>

        <Link href="/settings" className="self-center opacity-45">
          Settings
        </Link>
      </div>
    </div>
  );
}
