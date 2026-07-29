import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import DashboardHeader from "@/app/components/common/dashboard-header";
import DashboardSidebar from "@/app/components/common/dashboard-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockIQ | Inventory Dashboard",
  description: "Inventory management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-white`}
    >
      <body className="relative antialiased h-screen">
        <div className="flex h-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col h-screen relative">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto bg-bg p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}