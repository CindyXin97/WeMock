import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeMock - 数据岗位模拟面试匹配平台",
  description: "专为数据岗位(DA/DS/DE)求职者设计的模拟面试匹配平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="m-0 font-sans min-h-screen bg-background">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
