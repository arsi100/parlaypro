import { User, InsertUser, ParlayBet } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createParlayBet(bet: Omit<ParlayBet, "id">): Promise<ParlayBet>;
  getUserParlayBets(userId: number): Promise<ParlayBet[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parlayBets: Map<number, ParlayBet>;
  private currentUserId: number;
  private currentBetId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.parlayBets = new Map();
    this.currentUserId = 1;
    this.currentBetId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, subscriptionTier: 'free' };
    this.users.set(id, user);
    return user;
  }

  async createParlayBet(bet: Omit<ParlayBet, "id">): Promise<ParlayBet> {
    const id = this.currentBetId++;
    const parlayBet: ParlayBet = { ...bet, id };
    this.parlayBets.set(id, parlayBet);
    return parlayBet;
  }

  async getUserParlayBets(userId: number): Promise<ParlayBet[]> {
    return Array.from(this.parlayBets.values()).filter(
      (bet) => bet.userId === userId,
    );
  }
}

export const storage = new MemStorage();
