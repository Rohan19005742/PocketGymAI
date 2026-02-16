import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { AuthProvider } from "@/components/auth-provider";
import { SidePanel } from "@/components/side-panel";
import { AppMain } from "@/components/app-main";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StrivnAI - Your Personal AI Gym Coach",
  description: "Premium AI-powered personal training and fitness coaching in your pocket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <AuthProvider>
          <AnimatedBackground />
          <Navbar />
          <SidePanel />
          <AppMain>
            {children}
          </AppMain>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
