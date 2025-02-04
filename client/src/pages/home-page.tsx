import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ParlayCalculator from "@/components/parlay-calculator";
import ChatInterface from "@/components/chat-interface";
import SubscriptionTiers from "@/components/subscription-tiers";
import OddsDisplay from "@/components/odds-display";
import { Layout } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-6 w-6" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ParlayPro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username}</span>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Parlay Calculator</h2>
            <ParlayCalculator />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Chat Assistant</h2>
            <ChatInterface />
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Live Odds</h2>
            <OddsDisplay />
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
          <SubscriptionTiers currentTier={user?.subscriptionTier} />
        </div>
      </main>
    </div>
  );
}
