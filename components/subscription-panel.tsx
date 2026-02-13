"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Subscription {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionPanelProps {
  userSubscription?: string;
  onSelect?: (id: string) => void;
}

export function SubscriptionPanel({ userSubscription, onSelect }: SubscriptionPanelProps) {
  const [tiers, setTiers] = useState<Subscription[]>([]);

  useEffect(() => {
    fetch("/data/subscriptions.json")
      .then(res => res.json())
      .then(setTiers);
  }, []);

  // Collect all unique features for comparison
  const allFeatures = Array.from(new Set(
    tiers.flatMap(t => t.features.map(f => f.replace(/^All .* features$/, '')))
  )).filter(Boolean);

  return (
    <section className="max-w-4xl mx-auto p-6 bg-neutral-900 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Choose Your Subscription</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {tiers.map(tier => (
          <div key={tier.id} className={`border rounded-lg p-4 bg-black/80 ${userSubscription === tier.id ? 'border-blue-500' : 'border-neutral-800'}`}> 
            <h3 className="text-xl font-semibold mb-2 text-white">{tier.name}</h3>
            <p className="text-3xl font-bold mb-4 text-blue-400">{tier.price === 0 ? "Free" : `$${tier.price}/mo`}</p>
            <ul className="mb-4 text-neutral-300 list-disc pl-5">
              {tier.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <Button
              disabled={userSubscription === tier.id}
              onClick={() => onSelect && onSelect(tier.id)}
              className="w-full"
            >
              {userSubscription === tier.id ? "Current Plan" : "Select"}
            </Button>
          </div>
        ))}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">Tier Comparison</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-neutral-800 rounded-lg bg-neutral-950">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-neutral-300">Feature</th>
              {tiers.map(tier => (
                <th key={tier.id} className="px-4 py-2 text-center text-blue-400">{tier.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map(feature => (
              <tr key={feature} className="border-t border-neutral-800">
                <td className="px-4 py-2 text-neutral-200">{feature}</td>
                {tiers.map(tier => (
                  <td key={tier.id} className="px-4 py-2 text-center">
                    {tier.features.some(f => f.includes(feature)) ? '✔️' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
