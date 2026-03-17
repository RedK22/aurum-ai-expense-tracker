"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import SubscriptionCard from "./subscription-card";
import CreateSubscriptionDialog from "./create-subscription-dialog";

import {Skeleton} from "@/components/ui/skeleton";

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const data = await apiRequest("/recurring/");
      const list = Array.isArray(data) ? data : data.results || [];
      setSubscriptions(list);
    } finally {
      setLoading(false);
    }
  }

  function updateSubscription(updated) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  }

  function addSubscription(subscription) {
    setSubscriptions((prev) => [...prev, subscription]);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return(
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex justify-end">
        <CreateSubscriptionDialog onCreated={addSubscription} />
      </div>

      {/* List */}
      <div className="space-y-3">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onUpdated={updateSubscription}
          />
        ))}
      </div>
    </div>,
  );
}
