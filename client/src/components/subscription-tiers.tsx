import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";

type SubscriptionTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

const tiers: SubscriptionTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Basic access to ParlayPro features",
    features: [
      "Basic parlay calculator",
      "Live odds viewing",
      "Chat assistance",
      "Up to 3 parlays per day",
    ],
  },
  {
    name: "Pro",
    price: "$29.99",
    description: "Advanced features for serious bettors",
    features: [
      "Advanced parlay calculator",
      "Premium betting insights",
      "Priority chat support",
      "Unlimited parlays",
      "Historical betting analysis",
      "Custom alerts",
    ],
  },
  {
    name: "Elite",
    price: "$99.99",
    description: "Professional-grade betting tools",
    features: [
      "All Pro features",
      "VIP betting recommendations",
      "Real-time odds comparison",
      "Expert chat consultations",
      "Advanced analytics dashboard",
      "Private betting community",
      "1-on-1 strategy sessions",
    ],
  },
];

export default function SubscriptionTiers({
  currentTier = "free",
}: {
  currentTier?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={`relative ${
            tier.name.toLowerCase() === currentTier
              ? "border-primary shadow-lg"
              : ""
          }`}
        >
          {tier.name.toLowerCase() === currentTier && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
              Current Plan
            </div>
          )}
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">{tier.price}</div>
            <ul className="space-y-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={
                tier.name.toLowerCase() === currentTier ? "outline" : "default"
              }
            >
              {tier.name.toLowerCase() === currentTier
                ? "Current Plan"
                : "Upgrade"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
