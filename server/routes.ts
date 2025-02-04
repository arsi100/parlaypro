import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { parlayCalcSchema } from "@shared/schema";
import { findOptimalParlay, calculateParlayOdds, americanToDecimal } from "./utils/betting-math";

// Mock available bets until we integrate with The Odds API
const MOCK_AVAILABLE_BETS = [
  { game: "Lakers vs Warriors", pick: "Lakers -5.5", odds: "-110" },
  { game: "Celtics vs Heat", pick: "Over 220.5", odds: "-105" },
  { game: "Suns vs Clippers", pick: "Suns ML", odds: "-120" },
  { game: "Bucks vs 76ers", pick: "Bucks +2.5", odds: "+105" },
  { game: "Nuggets vs Trail Blazers", pick: "Under 235.5", odds: "-115" },
];

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/parlay-calc", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const validation = parlayCalcSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const { targetWinAmount, wagerAmount } = validation.data;

    // Find optimal parlay combination
    const selections = findOptimalParlay(
      targetWinAmount + wagerAmount, // total payout including wager
      wagerAmount,
      MOCK_AVAILABLE_BETS
    );

    // Calculate actual parlay odds
    const decimalOdds = selections.map(bet => americanToDecimal(bet.odds));
    const parlayDecimalOdds = calculateParlayOdds(decimalOdds);
    const parlayAmericanOdds = Math.round((parlayDecimalOdds - 1) * 100);

    const recommendation = {
      parlayOdds: parlayAmericanOdds > 0 ? `+${parlayAmericanOdds}` : parlayAmericanOdds.toString(),
      expectedPayout: (wagerAmount * parlayDecimalOdds).toFixed(2),
      selections,
      impliedProbability: (1 / parlayDecimalOdds * 100).toFixed(1) + "%"
    };

    const bet = await storage.createParlayBet({
      userId: req.user.id,
      targetWinAmount: targetWinAmount.toString(),
      wagerAmount: wagerAmount.toString(),
      recommendations: JSON.stringify(recommendation),
      createdAt: new Date()
    });

    res.json(bet);
  });

  app.get("/api/user/bets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bets = await storage.getUserParlayBets(req.user.id);
    res.json(bets);
  });

  const httpServer = createServer(app);
  return httpServer;
}