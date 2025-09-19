import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { nametags } from "./db/schema";
import { eq } from "drizzle-orm";
import { D1Database } from "@cloudflare/workers-types";

export type Env = {
  DB: D1Database;
};
const app = new Hono<{ Bindings: Env }>();

app.get("/:cutesy-id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("cutesy-id");
  console.log("[info] request received for id: ", id);
  const result = await db
    .select()
    .from(nametags)
    .where(eq(nametags.id, id))
    .get();

  if (!result) {
    return c.json({ error: "Tag not found" }, 404);
  }

  return c.json(result);
});

app.post("/claim", async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const { identifier, data } = body;
  if (!identifier || !data) {
    return c.json({ error: "Missing identifier or data" }, 400);
  }

  const { name, email, bio, x, github, linkedin } = data;
  if (!name || !email || !bio) {
    return c.json({ error: "Missing required fields: name, email, bio" }, 400);
  }

  if (bio.length > 100) {
    return c.json({ error: "Bio must be 100 characters or less" }, 400);
  }

  const existing = await db
    .select()
    .from(nametags)
    .where(eq(nametags.id, identifier))
    .get();

  if (existing) {
    return c.json({ error: "Tag already claimed" }, 409);
  }

  await db.insert(nametags).values({
    id: identifier,
    name,
    email,
    bio,
    x,
    github,
    linkedin,
  });

  return c.json({ success: true, identifier });
});

export default app;
