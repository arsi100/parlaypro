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

  // For high payouts, sort by highest odds (highest risk/reward)
  const payoutRatio = targetPayout / wager;
  if (payoutRatio > 5) {
    betsWithDecimal.sort((a, b) => b.decimalOdds - a.decimalOdds);
  } else {
    // For lower payouts, sort by lowest odds (safer picks)
    betsWithDecimal.sort((a, b) => a.decimalOdds - b.decimalOdds);
  }

  // Calculate required odds to achieve target payout
  const requiredDecimalOdds = targetPayout / wager;

  // Try different combinations of bets to get close to target
  for (let numPicks = 2; numPicks <= Math.min(4, betsWithDecimal.length); numPicks++) {
    // Try different combinations of numPicks bets
    for (let startIdx = 0; startIdx <= betsWithDecimal.length - numPicks; startIdx++) {
      const selectedBets = betsWithDecimal.slice(startIdx, startIdx + numPicks);
      const parlayOdds = calculateParlayOdds(selectedBets.map(b => b.decimalOdds));
      const potentialPayout = calculateParlayPayout(wager, parlayOdds);

      // If we're within 20% of target payout, use this combination
      if (potentialPayout >= targetPayout * 0.8 && potentialPayout <= targetPayout * 1.2) {
        return selectedBets.map(({ game, pick, odds }) => ({ game, pick, odds }));
      }
    }
  }

  // If no optimal combination found, use bets with highest combined odds
  const highestOddsBets = betsWithDecimal.slice(0, 3);
  return highestOddsBets.map(({ game, pick, odds }) => ({ game, pick, odds }));
}