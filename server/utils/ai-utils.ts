import OpenAI from "openai";

const openai = new OpenAI();

export async function generateBetExplanation(
  targetWin: number,
  wager: number,
  selections: Array<{
    game: string;
    pick: string;
    odds: string;
  }>,
  parlayOdds: string,
  impliedProbability: string
): Promise<string> {
  const prompt = `
As a sports betting expert, explain why this parlay combination is optimal for a $${wager} wager targeting $${targetWin} in winnings.

Parlay Details:
- Combined Odds: ${parlayOdds}
- Implied Probability: ${impliedProbability}

Selected Bets:
${selections.map(s => `- ${s.game}: ${s.pick} (${s.odds})`).join('\n')}

Provide a 2-3 sentence explanation focusing on:
1. Risk vs reward balance
2. Why these specific games/picks were chosen
3. The mathematical reasoning behind the combination
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional sports betting analyst providing concise, data-driven explanations for parlay bet combinations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 150,
    temperature: 0.7
  });

  return completion.choices[0].message.content || "Unable to generate explanation.";
}
