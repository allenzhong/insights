// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import * as insightsTable from "./tables/insights.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

// Ensure the insights table exists
try {
  db.exec(insightsTable.createTable);
  console.log("Ensured insights table exists");
} catch (e) {
  console.error("Error ensuring insights table:", e);
}

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.body = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  try {
    // Debug: log the raw request body as text
    const rawText = await ctx.request.body.text();
    console.log("Raw request body (text):", rawText);
    // Debug: try to parse as JSON
    let value;
    try {
      value = await ctx.request.body.json();
      console.log("Parsed JSON body:", value);
    } catch (jsonErr) {
      console.log("Failed to parse JSON body:", jsonErr);
      throw jsonErr;
    }

    if (!value.brand || !value.text) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Missing required fields: brand, text" };
      return;
    }

    const result = createInsight({ db, brand: value.brand, text: value.text });
    ctx.response.body = result;
    ctx.response.status = 201;
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = {
      error: "Invalid JSON body",
      details: error instanceof Error ? error.message : String(error),
    };
  }
});

router.delete("/insights/delete/:id", (ctx) => {
  try {
    const params = ctx.params as Record<string, any>;
    const id = Number(params.id);

    if (isNaN(id)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid insight ID" };
      return;
    }

    const result = deleteInsight({ db, id });
    ctx.response.body = result;
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.status = 404;
    ctx.response.body = {
      error: error instanceof Error ? error.message : "Insight not found",
    };
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
