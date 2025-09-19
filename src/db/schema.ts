import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const nametags = sqliteTable("nametags", {
  id: text("id").notNull().primaryKey(), // This will be of type adjective-noun
  name: text("name").notNull(),
  email: text("email").notNull(),
  bio: text("bio").notNull(),
  x: text("x"),
  github: text("github"),
  linkedin: text("linkedin"),
});
