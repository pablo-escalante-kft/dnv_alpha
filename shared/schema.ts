import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  name: text("name"),
  industry: text("industry"),
  foundingYear: integer("founding_year"),
  location: text("location"),
  employeeCount: integer("employee_count"),
  teamDetails: jsonb("team_details").$type<any[]>(),
  businessModel: text("business_model"),
  problemStatement: text("problem_statement"),
  revenueModel: text("revenue_model"),
  traction: jsonb("traction").$type<Record<string, any>>(),
  fundingHistory: jsonb("funding_history").$type<any[]>(),
  financialProjections: jsonb("financial_projections").$type<Record<string, any>>(),
  marketSize: text("market_size"),
  competitorAnalysis: jsonb("competitor_analysis").$type<any[]>(),
  uniqueSellingProposition: text("unique_selling_proposition"),
  productOverview: text("product_overview"),
  technologyStack: jsonb("technology_stack").$type<string[]>(),
  intellectualProperty: jsonb("intellectual_property").$type<any[]>(),
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
  name: true,
  industry: true,
  foundingYear: true,
  location: true,
  employeeCount: true,
  teamDetails: true,
  businessModel: true,
  problemStatement: true,
  revenueModel: true,
  traction: true,
  fundingHistory: true,
  financialProjections: true,
  marketSize: true,
  competitorAnalysis: true,
  uniqueSellingProposition: true,
  productOverview: true,
  technologyStack: true,
  intellectualProperty: true,
  aiAnalysis: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Startup = typeof startups.$inferSelect;
export type InsertStartup = z.infer<typeof insertStartupSchema>;