import { InsertUser, User, Startup, InsertStartup, users, startups } from "@shared/schema";
import { nanoid } from "nanoid";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

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

  async createStartupSubmission(): Promise<string> {
    const key = nanoid();
    const [startup] = await db
      .insert(startups)
      .values({
        submissionKey: key,
        status: "pending",
      })
      .returning();
    return startup.submissionKey;
  }

  async getStartupBySubmissionKey(key: string): Promise<Startup | undefined> {
    const [startup] = await db
      .select()
      .from(startups)
      .where(eq(startups.submissionKey, key));
    return startup;
  }

  async updateStartup(key: string, data: Partial<InsertStartup>): Promise<Startup> {
    const [startup] = await db
      .update(startups)
      .set(data)
      .where(eq(startups.submissionKey, key))
      .returning();
    return startup;
  }

  async getAllStartups(): Promise<Startup[]> {
    return await db.select().from(startups);
  }
}

export const storage = new DatabaseStorage();