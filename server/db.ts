import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Using Supabase database URL
const supabaseUrl = 'https://nzmgatwsdhwsspliaxsk.supabase.co';
const supabaseDatabaseUrl = process.env.DATABASE_URL?.replace("postgres://", `postgres://postgres:${process.env.PGPASSWORD}@${supabaseUrl}:5432/`);

if (!supabaseDatabaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision the Supabase database?",
  );
}

export const pool = new Pool({ connectionString: supabaseDatabaseUrl });
export const db = drizzle(pool, { schema });