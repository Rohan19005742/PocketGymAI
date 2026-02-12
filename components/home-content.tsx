"use client";

import { useSession } from "next-auth/react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CTA } from "@/components/cta";
import { PersonalizedDashboard } from "@/components/personalized-dashboard";

export function HomeContent() {
  const { data: session } = useSession();

  if (session) {
    return <PersonalizedDashboard />;
  }

  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  );
}
