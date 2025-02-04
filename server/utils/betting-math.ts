/**
 * Betting math utilities for parlay calculations
 */

/**
 * Convert American odds to decimal odds
 * @param americanOdds American odds (e.g. +150, -110)
 * @returns Decimal odds (e.g. 2.5, 1.91)
 */
export function americanToDecimal(americanOdds: string): number {
  const odds = parseInt(americanOdds);
  if (odds > 0) {
    return odds / 100 + 1;
  } else {
    return 100 / Math.abs(odds) + 1;
  }
}

/**
 * Convert decimal odds to American odds
 * @param decimalOdds Decimal odds (e.g. 2.5)
 * @returns American odds (e.g. +150, -110)
 */
export function decimalToAmerican(decimalOdds: number): string {
  const americanOdds = (decimalOdds - 1) * 100;
  return americanOdds >= 0 ? `+${Math.round(americanOdds)}` : Math.round(americanOdds).toString();
}

/**
 * Convert decimal odds to implied probability
 * @param decimalOdds Decimal odds (e.g. 2.5)
 * @returns Probability between 0 and 1
 */
export function decimalToProbability(decimalOdds: number): number {
  return 1 / decimalOdds;
}

/**
 * Calculate parlay decimal odds from array of individual odds
 * @param decimalOdds Array of decimal odds
 * @returns Combined parlay odds
 */
export function calculateParlayOdds(decimalOdds: number[]): number {
  return decimalOdds.reduce((acc, odds) => acc * odds, 1);
}

/**
 * Calculate potential payout for a parlay bet
 * @param wager Bet amount
 * @param parlayOdds Combined parlay odds
 * @returns Potential payout including original wager
 */
export function calculateParlayPayout(wager: number, parlayOdds: number): number {
  return wager * parlayOdds;
}

/**
 * Find optimal parlay combination for target payout
 * @param targetPayout Desired payout amount
 * @param wager Bet amount
 * @param availableBets Array of available bets with odds
 * @returns Selected bets that achieve target payout
 */
export function findOptimalParlay(
  targetPayout: number,
  wager: number,
  availableBets: Array<{
    game: string;
    pick: string;
    odds: string;
  }>,
): Array<{
  game: string;
  pick: string;
  odds: string;
}> {
  // Convert all odds to decimal
  const betsWithDecimal = availableBets.map(bet => ({
    ...bet,
    decimalOdds: americanToDecimal(bet.odds)
  }));

  // Calculate required odds to achieve target payout
  const requiredDecimalOdds = targetPayout / wager;

  // Sort bets by decimal odds (highest to lowest)
  betsWithDecimal.sort((a, b) => b.decimalOdds - a.decimalOdds);

  // Try combinations of different sizes to reach target
  for (let numPicks = 2; numPicks <= Math.min(4, betsWithDecimal.length); numPicks++) {
    // Generate all possible combinations of numPicks size
    for (let i = 0; i <= betsWithDecimal.length - numPicks; i++) {
      for (let j = i + 1; j <= betsWithDecimal.length - numPicks + 1; j++) {
        // Get current combination
        const selectedBets = betsWithDecimal.slice(i, i + numPicks);
        const parlayOdds = calculateParlayOdds(selectedBets.map(b => b.decimalOdds));
        const potentialPayout = calculateParlayPayout(wager, parlayOdds);

        // If this combination gets us within 10% of target, use it
        if (potentialPayout >= targetPayout * 0.9 && potentialPayout <= targetPayout * 1.1) {
          return selectedBets.map(({ game, pick, odds }) => ({ game, pick, odds }));
        }
      }
    }
  }

  // If no combination gets close enough to target, return the highest possible payout combination
  const bestBets = betsWithDecimal
    .slice(0, 3)
    .sort((a, b) => b.decimalOdds - a.decimalOdds);

  return bestBets.map(({ game, pick, odds }) => ({ game, pick, odds }));
}