import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { nametags } from "./db/schema";
import { eq } from "drizzle-orm";
import { D1Database } from "@cloudflare/workers-types";
import { getCardHtml } from "./card";
import { getClaimHtml } from "./claim";

export type Env = {
  DB: D1Database;
};
const app = new Hono<{ Bindings: Env }>();

// Serve homepage
app.get("/", async (c) => {
  return c.html(
    "Lost? Go to /:cutesy-id to see a tag or /claim/:cutesy-id to claim one.",
  );
});

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
    return c.html("Tag isnt claimed yet", 303, {
      Location: `/claim/${id}`,
    });
  }

  return c.html(getCardHtml({ data: result }));
});

app.get("/claim/:cutesy-id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("cutesy-id");
  console.log("[info] claim request received for id: ", id);
  let result = await db
    .select()
    .from(nametags)
    .where(eq(nametags.id, id))
    .get();
  if (result) {
    return c.html("Tag already claimed", 303, {
      Location: `/${id}`,
    });
  }
  return c.html(getClaimHtml({ data: { id: id } }));
});

app.post("/api/claim", async (c) => {
  const db = drizzle(c.env.DB);
  console.log("[info] API claim request received: ", await c.req.text());
  const body = await c.req.json();

  const { id, name, email, bio, x, github, linkedin, site } = body;
  if (!id || !name || !email || !bio) {
    return c.json(
      { error: "Missing id or required fields: name, email, bio" },
      400,
    );
  }

  if (bio.length > 100) {
    return c.json({ error: "Bio must be 100 characters or less" }, 400);
  }

  const existing = await db
    .select()
    .from(nametags)
    .where(eq(nametags.id, id))
    .get();

  if (existing) {
    return c.json({ error: "Tag already claimed" }, 409);
  }

  await db.insert(nametags).values({
    id: id,
    name,
    email,
    bio,
    x,
    github,
    linkedin,
    site,
  });

  return c.json({ success: true, id: id });
});

export default app;
