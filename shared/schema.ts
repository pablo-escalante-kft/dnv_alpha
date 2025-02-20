import { pgTable, text, serial, integer, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  submissionKey: text("submission_key").notNull().unique(),
  organizationName: text("organization_name"),
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
  } | null>(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("pending"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStartupSchema = createInsertSchema(startups).pick({
  organizationName: true,
  industries: true,
  location: true,
  fundingRounds: true,
  lastFunding: true,
  lastFundingType: true,
  equity: true,
  totalFunding: true,
  revenue: true,
  industryGroups: true,
  foundersCount: true,
  employeesCount: true,
  topInvestors: true,
  growth: true,
  valuation: true,
  lastValuationDate: true,
  aiAnalysis: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Startup = typeof startups.$inferSelect;
export type InsertStartup = z.infer<typeof insertStartupSchema>;