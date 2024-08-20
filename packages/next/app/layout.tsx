import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Dubbie",
  description: "Uhhhhh, this is just an open source dubbing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <script async src="https://js.stripe.com/v3/pricing-table.js" />
      <html lang="en">
        <body
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Inter'",
            color: "rgba(0, 0, 0, 0.7)",
          }}
          className="bg-default"
        >
          <Toaster />
          {children}
        </body>
      </html>
    </Providers>
  );
}
