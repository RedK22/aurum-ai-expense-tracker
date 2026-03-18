"use client";

import {useState} from "react";

import {apiRequest} from "@/lib/api";
import {toast} from "@/components/optics/sonner";

import {Card, CardContent} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";
import {formatCurrency} from "@/lib/currency";
import {useCurrency} from "@/components/currency-context";

export default function SubscriptionCard({subscription, onUpdated}) {
  const {currency} = useCurrency();
  const [active, setActive] = useState(subscription.is_active);
  const [loading, setLoading] = useState(false);

  async function handleToggle(checked) {
    setActive(checked);
    setLoading(true);

    try {
      const updated = await apiRequest(`/recurring/${subscription.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          ...subscription,
          is_active: checked,
        }),
      });

      toast({
        type: "success",
        title: checked ? "Subscription activated" : "Subscription deactivated",
        description: `Subscription '${subscription.title}' is now ${
          checked ? "active" : "inactive"
        }.`,
      });

      onUpdated(updated);
    } catch {
      setActive(!checked);
      toast({
        type: "error",
        title: "Status update failed",
        description: `Could not update subscription status.`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-md hover:shadow-lg hover:border-white/20 transition-all duration-300">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold truncate">{subscription.title}</p>

          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
            <span>{formatCurrency(subscription.amount, currency)}</span>
            <span>•</span>
            <span>{subscription.frequency.toLowerCase()}</span>
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            Start: {subscription.start_date}
          </p>
        </div>

        {/* Right */}
        <Switch
          checked={active}
          onCheckedChange={handleToggle}
          disabled={loading}
        />
      </CardContent>

      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </Card>
  );
}
