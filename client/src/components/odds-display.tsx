import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const sportDisplayNames: Record<string, string> = {
  basketball_nba: "NBA",
  americanfootball_nfl: "NFL",
  baseball_mlb: "MLB",
  icehockey_nhl: "NHL",
};

export default function OddsDisplay() {
  const { data: odds, isLoading, error } = useQuery({
    queryKey: ["/api/odds"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Error loading odds data. Please try again later.
      </div>
    );
  }

  return (
    <Tabs defaultValue="basketball_nba">
      <TabsList className="grid grid-cols-4 w-full max-w-[400px]">
        {Object.keys(sportDisplayNames).map((sport) => (
          <TabsTrigger key={sport} value={sport}>
            {sportDisplayNames[sport]}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(odds || {}).map(([sport, games]) => (
        <TabsContent key={sport} value={sport}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => {
              const bookmaker = game.bookmakers[0];
              if (!bookmaker) return null;

              const moneyline = bookmaker.markets.find((m) => m.key === "h2h");
              const spreads = bookmaker.markets.find((m) => m.key === "spreads");
              const totals = bookmaker.markets.find((m) => m.key === "totals");

              return (
                <Card key={game.id} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(game.commence_time).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZoneName: "short",
                      })}
                    </span>
                    <span className="text-sm font-medium">
                      {sportDisplayNames[sport]}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Away Team */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{game.away_team}</span>
                      <div className="space-x-4">
                        {spreads && (
                          <span className="text-sm">
                            {spreads.outcomes.find(
                              (o) => o.name === game.away_team
                            )?.point}
                          </span>
                        )}
                        {moneyline && (
                          <span className="text-sm">
                            {moneyline.outcomes.find(
                              (o) => o.name === game.away_team
                            )?.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Home Team */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{game.home_team}</span>
                      <div className="space-x-4">
                        {spreads && (
                          <span className="text-sm">
                            {spreads.outcomes.find(
                              (o) => o.name === game.home_team
                            )?.point}
                          </span>
                        )}
                        {moneyline && (
                          <span className="text-sm">
                            {moneyline.outcomes.find(
                              (o) => o.name === game.home_team
                            )?.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    {totals && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm">Total</span>
                        <div className="space-x-4">
                          <span className="text-sm">
                            O {totals.outcomes.find((o) => o.name === "Over")?.point}
                          </span>
                          <span className="text-sm">
                            U {totals.outcomes.find((o) => o.name === "Under")?.point}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}