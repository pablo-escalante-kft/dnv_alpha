import { InsertUser, User, Startup, InsertStartup } from "@shared/schema";
import { nanoid } from "nanoid";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createStartupSubmission(): Promise<string>;
  getStartupBySubmissionKey(key: string): Promise<Startup | undefined>;
  updateStartup(key: string, data: Partial<InsertStartup>): Promise<Startup>;
  getAllStartups(): Promise<Startup[]>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private startups: Map<string, Startup>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.startups = new Map();
    this.currentId = 1;
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
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createStartupSubmission(): Promise<string> {
    const key = nanoid();
    const startup: Startup = {
      id: this.currentId++,
      submissionKey: key,
      status: "pending",
      createdAt: new Date(),
      aiAnalysis: null,
    } as Startup;
    
    this.startups.set(key, startup);
    return key;
  }

  async getStartupBySubmissionKey(key: string): Promise<Startup | undefined> {
    return this.startups.get(key);
  }

  async updateStartup(key: string, data: Partial<InsertStartup>): Promise<Startup> {
    const startup = await this.getStartupBySubmissionKey(key);
    if (!startup) {
      throw new Error("Startup not found");
    }

    const updated = { ...startup, ...data };
    this.startups.set(key, updated);
    return updated;
  }

  async getAllStartups(): Promise<Startup[]> {
    return Array.from(this.startups.values());
  }
}

export const storage = new MemStorage();
