import LeftSidebar from "@/components/MainLeftSidebar";
import { Line } from "@/components/elements/Line";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full">
      <LeftSidebar />
      {/* vertical line */}
      <Line orientation="vertical" />
      {/* content on the right */}
      <div className="relative flex-1 overflow-auto">{children}</div>
    </div>
  );
}
