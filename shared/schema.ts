import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  sku: text("sku").notNull().unique(),
  // Stores URLs for different views: { front: string, back: string, left: string, right: string }
  images: jsonb("images").notNull(), 
  features: text("features").array(),
});

export const insertProductSchema = createInsertSchema(products);

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Types for the Virtual Try-On Configuration
export const tshirtConfigSchema = z.object({
  images: z.object({
    front: z.string(),
    back: z.string(),
    left: z.string(),
    right: z.string(),
  }),
  calibration: z.object({
    scaleFactor: z.number().default(1.0),
    verticalOffset: z.number().default(0),
  })
});

export type TshirtConfig = z.infer<typeof tshirtConfigSchema>;
