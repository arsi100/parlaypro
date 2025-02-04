import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default('free'),
});

export const parlayBets = pgTable("parlay_bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  targetWinAmount: decimal("target_win_amount").notNull(),
  wagerAmount: decimal("wager_amount").notNull(),
  recommendations: text("recommendations").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const parlayCalcSchema = z.object({
  targetWinAmount: z.number().positive(),
  wagerAmount: z.number().positive(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ParlayCalc = z.infer<typeof parlayCalcSchema>;
export type ParlayBet = typeof parlayBets.$inferSelect;
