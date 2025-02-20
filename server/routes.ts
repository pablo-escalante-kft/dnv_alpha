import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertStartupSchema } from "@shared/schema";
import { analyzeStartup } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Generate submission key
  app.post("/api/startups/create", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const key = await storage.createStartupSubmission();
    res.json({ key });
  });

  // Get startup data
  app.get("/api/startups/:key", async (req, res) => {
    const startup = await storage.getStartupBySubmissionKey(req.params.key);
    if (!startup) return res.sendStatus(404);
    res.json(startup);
  });

  // Submit startup data
  app.post("/api/startups/:key", async (req, res) => {
    try {
      const data = insertStartupSchema.parse(req.body);
      const startup = await storage.updateStartup(req.params.key, data);
      
      // Generate AI analysis
      const analysis = await analyzeStartup(data);
      const updatedStartup = await storage.updateStartup(req.params.key, {
        aiAnalysis: analysis,
        status: "analyzed",
      });
      
      res.json(updatedStartup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(error.errors);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get all startups
  app.get("/api/startups", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const startups = await storage.getAllStartups();
    res.json(startups);
  });

  const httpServer = createServer(app);
  return httpServer;
}
