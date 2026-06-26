import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuroraBackground from "@/components/AuroraBackground";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kalshi Dashboard",
  description: "Dashboard for analyzing Kalshi transactions",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Fixed aurora background — z-index 0 */}
        <AuroraBackground />
        {/* Content wrapper — explicitly above aurora */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
