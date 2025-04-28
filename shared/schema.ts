import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main project schema for theater lighting
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").notNull().$type<ProjectData>(),
  lastModified: text("last_modified").notNull(),
});

// Layer schema
export const LayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  locked: z.boolean(),
  opacity: z.number().min(0).max(100),
  elements: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["light", "gel", "grid", "stage"]),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      rotation: z.number(),
      assetId: z.string(),
      properties: z.record(z.any()).optional(),
    })
  )
});

// Grid settings schema
export const GridSettingsSchema = z.object({
  visible: z.boolean(),
  spacing: z.number().min(10).max(100),
  color: z.string(),
  style: z.enum(["lines", "dots", "dashed"]),
});

// Complete project data schema
export const ProjectDataSchema = z.object({
  layers: z.array(LayerSchema),
  activeLayerId: z.string(),
  gridSettings: GridSettingsSchema,
  canvasWidth: z.number(),
  canvasHeight: z.number(),
  zoom: z.number(),
});

export type Layer = z.infer<typeof LayerSchema>;
export type GridSettings = z.infer<typeof GridSettingsSchema>;
export type ProjectData = z.infer<typeof ProjectDataSchema>;

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  data: true,
  lastModified: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Users schema (for future authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
