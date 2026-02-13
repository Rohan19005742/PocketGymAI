"use client";

import { useSession } from "next-auth/react";

export function AppMain({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <main className={`min-h-screen relative ${session ? "ml-56" : ""}`}>
      {children}
    </main>
  );
}
