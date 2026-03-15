"use client";

import SubscriptionList from "@/components/subscriptions/subscription-list";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscriptions</h1>

      <SubscriptionList />
    </div>
  );
}
