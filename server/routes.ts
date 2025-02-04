import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { parlayCalcSchema } from "@shared/schema";
import { findOptimalParlay, calculateParlayOdds, americanToDecimal } from "./utils/betting-math";
import { generateBetExplanation } from "./utils/ai-utils";
import { getAllOdds, formatOdds, type Game, type Sport } from "./utils/odds-api";

// Cache for available bets
let AVAILABLE_BETS: Array<{ game: string; pick: string; odds: string }> = [];
let lastFetch = 0;
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function updateAvailableBets() {
  const now = Date.now();
  if (now - lastFetch > FETCH_INTERVAL) {
    const odds = await getAllOdds();
    const allGames = Object.values(odds).flat();
    AVAILABLE_BETS = formatOdds(allGames);
    lastFetch = now;
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/odds", async (req, res) => {
    try {
      const odds = await getAllOdds();
      res.json(odds);
    } catch (error) {
      console.error("Error fetching odds:", error);
      res.status(500).json({ error: "Failed to fetch odds" });
    }
  });

  app.post("/api/parlay-calc", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const validation = parlayCalcSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const { targetWinAmount, wagerAmount } = validation.data;

    // Update available bets
    await updateAvailableBets();

    // Find optimal parlay combination
    const selections = findOptimalParlay(
      targetWinAmount + wagerAmount, // total payout including wager
      wagerAmount,
      AVAILABLE_BETS
    );

    // Calculate actual parlay odds
    const decimalOdds = selections.map(bet => americanToDecimal(bet.odds));
    const parlayDecimalOdds = calculateParlayOdds(decimalOdds);
    const parlayAmericanOdds = Math.round((parlayDecimalOdds - 1) * 100);
    const parlayOddsStr = parlayAmericanOdds > 0 ? `+${parlayAmericanOdds}` : parlayAmericanOdds.toString();
    const impliedProbability = (1 / parlayDecimalOdds * 100).toFixed(1) + "%";

    // Generate AI explanation
    const explanation = await generateBetExplanation(
      targetWinAmount,
      wagerAmount,
      selections,
      parlayOddsStr,
      impliedProbability
    );

    const recommendation = {
      parlayOdds: parlayOddsStr,
      expectedPayout: (wagerAmount * parlayDecimalOdds).toFixed(2),
      selections,
      impliedProbability,
      explanation
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