"use client";

import SubscriptionList from "@/components/subscriptions/subscription-list";

import {Separator} from "@/components/ui/separator";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">
          Manage your recurring expenses
        </p>
      </div>

      <Separator className="bg-white/10" />

      <SubscriptionList />
    </div>
  );
}
