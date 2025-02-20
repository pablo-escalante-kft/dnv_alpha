import { pgTable, text, serial, integer, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table aligned with Supabase structure
export const users = pgTable("users", {
  id: text("id").primaryKey(), // UUID from Supabase Auth
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Rest of the schema 
export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  submission_key: text("submission_key").notNull().unique(),
  organizationName: text("organization_name"),
  url: text("url"),
  industries: jsonb("industries").$type<string[]>(),
  location: text("location"),
  fundingRounds: integer("funding_rounds"),
  lastFunding: decimal("last_funding"),
  lastFundingType: text("last_funding_type"),
  equity: decimal("equity"),
  totalFunding: decimal("total_funding"),
  revenue: decimal("revenue"),
  industryGroups: jsonb("industry_groups").$type<string[]>(),
  foundersCount: integer("founders_count"),
  employeesCount: integer("employees_count"),
  topInvestors: jsonb("top_investors").$type<string[]>(),
  growth: decimal("growth"),
  valuation: decimal("valuation"),
  lastValuationDate: timestamp("last_valuation_date"),
  founders: jsonb("founders").$type<{
    name: string;
    role: string;
    linkedIn?: string;
    education?: string;
    experience?: string;
    previousCompanies?: string[];
    bio?: string;
    achievements?: string[];
  }[]>(),
  monthlyMetrics: jsonb("monthly_metrics").$type<{
    date: string;
    revenue?: number;
    users?: number;
    growth?: number;
    burn?: number;
  }[]>(),
  keyMetrics: jsonb("key_metrics").$type<{
    metric: string;
    value: number;
    change: number;
    timeframe: string;
  }[]>(),
  aiAnalysis: jsonb("ai_analysis").$type<{
    scores: {
      marketPotential: number;
      teamStrength: number;
      productInnovation: number;
      competitiveAdvantage: number;
      financialViability: number;
    };
    analysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    recommendations: string[];
    riskLevel: "low" | "medium" | "high";
    investmentPotential: "strong" | "moderate" | "weak";
    founderAssessment?: {
      leadership: number;
      experience: number;
      domainExpertise: number;
      trackRecord: number;
    };
  } | null>(),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").default("pending"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStartupSchema = createInsertSchema(startups).omit({
  id: true,
  created_at: true,
  submission_key: true,
  status: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Startup = typeof startups.$inferSelect;
export type InsertStartup = z.infer<typeof insertStartupSchema>;