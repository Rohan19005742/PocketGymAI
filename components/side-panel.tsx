"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, BarChart, MessageSquare, Apple } from "lucide-react";

const panelLinks = [
  {
    href: "/chat",
    label: "AI Coach",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    href: "/nutritionist",
    label: "AI Nutritionist",
    icon: <Apple className="w-5 h-5" />,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="w-5 h-5" />,
  },
];

export function SidePanel() {
  const { data: session } = useSession();
  const pathname = usePathname();
  if (!session) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-card border-r border-border flex flex-col items-stretch z-40 overflow-y-auto">
      <nav className="flex flex-col gap-2 p-4">
        {panelLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
