"use client";

import {useState} from "react";
import {apiRequest} from "@/lib/api";

import {Card, CardContent} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";

export default function SubscriptionCard({subscription, onUpdated}) {
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

      onUpdated(updated);
    } catch {
      // revert toggle if request fails
      setActive(!checked);
    } finally {
      setLoading(false);
    }
  }

  const nextPayment = subscription.last_generated
    ? subscription.last_generated
    : subscription.start_date;

  return (
    <Card>
      <CardContent className="flex justify-between items-center py-4">
        <div>
          <p className="font-semibold">{subscription.title}</p>

          <p className="text-sm text-muted-foreground">
            ₹{subscription.amount} / {subscription.frequency.toLowerCase()}
          </p>

          <p className="text-sm text-muted-foreground">
            Start Date: {subscription.start_date}
          </p>
        </div>

        <Switch
          checked={active}
          onCheckedChange={handleToggle}
          disabled={loading}
        />
      </CardContent>
    </Card>
  );
}
