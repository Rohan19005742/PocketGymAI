"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { PersonalizedDashboard } from "@/components/personalized-dashboard";

export function HomeContent() {
  const { data: session } = useSession();
  const router = useRouter();

  // Check if onboarding is complete
  useEffect(() => {
    if (session?.user && !(session.user as any).onboardingComplete) {
      router.push("/onboarding");
    }
  }, [session, router]);

  if (session) {
    return <PersonalizedDashboard />;
  }

  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <CTA />
    </>
  );
}
