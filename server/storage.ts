import { users, parlayBets, type User, type InsertUser, type ParlayBet } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createParlayBet(bet: Omit<ParlayBet, "id">): Promise<ParlayBet>;
  getUserParlayBets(userId: number): Promise<ParlayBet[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createParlayBet(bet: Omit<ParlayBet, "id">): Promise<ParlayBet> {
    const [parlayBet] = await db.insert(parlayBets).values(bet).returning();
    return parlayBet;
  }

  async getUserParlayBets(userId: number): Promise<ParlayBet[]> {
    return db.select().from(parlayBets).where(eq(parlayBets.userId, userId));
  }
}

export const storage = new DatabaseStorage();