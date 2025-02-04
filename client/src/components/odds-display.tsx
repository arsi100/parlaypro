import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOddsData } from "@/lib/mock-data";

export default function OddsDisplay() {
  return (
    <Tabs defaultValue="nba">
      <TabsList className="grid grid-cols-4 w-full max-w-[400px]">
        <TabsTrigger value="nba">NBA</TabsTrigger>
        <TabsTrigger value="nfl">NFL</TabsTrigger>
        <TabsTrigger value="mlb">MLB</TabsTrigger>
        <TabsTrigger value="nhl">NHL</TabsTrigger>
      </TabsList>

      {Object.entries(mockOddsData).map(([sport, games]) => (
        <TabsContent key={sport} value={sport.toLowerCase()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <Card key={game.id} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                    {game.time}
                  </span>
                  <span className="text-sm font-medium">{game.league}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{game.teams.away}</span>
                    <div className="space-x-4">
                      <span className="text-sm">
                        {game.odds.spread.away > 0
                          ? `+${game.odds.spread.away}`
                          : game.odds.spread.away}
                      </span>
                      <span className="text-sm">{game.odds.moneyline.away}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">{game.teams.home}</span>
                    <div className="space-x-4">
                      <span className="text-sm">
                        {game.odds.spread.home > 0
                          ? `+${game.odds.spread.home}`
                          : game.odds.spread.home}
                      </span>
                      <span className="text-sm">{game.odds.moneyline.home}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm">Total</span>
                    <div className="space-x-4">
                      <span className="text-sm">O {game.odds.total}</span>
                      <span className="text-sm">U {game.odds.total}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
