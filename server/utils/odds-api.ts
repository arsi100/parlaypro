import { env } from "node:process";

const ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4/sports";

export type Sport = "basketball_nba" | "americanfootball_nfl" | "baseball_mlb" | "icehockey_nhl";

export interface Game {
  id: string;
  sport: Sport;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

export interface OddsResponse {
  success: boolean;
  data: Game[];
}

async function fetchOdds(sport: Sport): Promise<Game[]> {
  const params = new URLSearchParams({
    apiKey: env.ODDS_API_KEY!,
    regions: "us",
    markets: "spreads,h2h,totals",
    oddsFormat: "american",
    dateFormat: "iso",
  });

  const response = await fetch(
    `${ODDS_API_BASE_URL}/${sport}/odds?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch odds: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`[Odds API] Fetched ${data.length} games for ${sport}`);
  return data;
}

// Cache odds data for 5 minutes
const cache = new Map<Sport, { data: Game[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getOdds(sport: Sport): Promise<Game[]> {
  const now = Date.now();
  const cached = cache.get(sport);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const freshData = await fetchOdds(sport);

  // Sort games by commence time
  freshData.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());

  // Log game details for debugging
  console.log(`[Odds API] ${sport} games (sorted by time):`);
  freshData.forEach(game => {
    console.log(`- ${game.away_team} @ ${game.home_team} (${new Date(game.commence_time).toLocaleTimeString()})`);
  });

  cache.set(sport, { data: freshData, timestamp: now });
  return freshData;
}

export async function getAllOdds(): Promise<Record<Sport, Game[]>> {
  const sports: Sport[] = [
    "basketball_nba",
    "americanfootball_nfl",
    "baseball_mlb",
    "icehockey_nhl",
  ];

  const results = await Promise.all(
    sports.map(async (sport) => ({
      sport,
      games: await getOdds(sport),
    }))
  );

  return results.reduce(
    (acc, { sport, games }) => ({
      ...acc,
      [sport]: games,
    }),
    {} as Record<Sport, Game[]>
  );
}

export function formatOdds(games: Game[]): Array<{
  game: string;
  pick: string;
  odds: string;
}> {
  return games.flatMap((game) => {
    const bets: Array<{
      game: string;
      pick: string;
      odds: string;
    }> = [];

    const bookmaker = game.bookmakers[0]; // Use first bookmaker for consistency

    if (!bookmaker) return [];

    // Add moneyline bets
    const moneyline = bookmaker.markets.find((m) => m.key === "h2h");
    if (moneyline) {
      moneyline.outcomes.forEach((outcome) => {
        bets.push({
          game: `${game.away_team} @ ${game.home_team}`,
          pick: `${outcome.name} ML`,
          odds: outcome.price >= 0 ? `+${outcome.price}` : outcome.price.toString(),
        });
      });
    }

    // Add spread bets
    const spreads = bookmaker.markets.find((m) => m.key === "spreads");
    if (spreads) {
      spreads.outcomes.forEach((outcome) => {
        bets.push({
          game: `${game.away_team} @ ${game.home_team}`,
          pick: `${outcome.name} ${outcome.point! >= 0 ? "+" : ""}${outcome.point}`,
          odds: outcome.price >= 0 ? `+${outcome.price}` : outcome.price.toString(),
        });
      });
    }

    // Add totals
    const totals = bookmaker.markets.find((m) => m.key === "totals");
    if (totals) {
      totals.outcomes.forEach((outcome) => {
        bets.push({
          game: `${game.away_team} @ ${game.home_team}`,
          pick: `${outcome.name} ${outcome.point}`,
          odds: outcome.price >= 0 ? `+${outcome.price}` : outcome.price.toString(),
        });
      });
    }

    return bets;
  });
}