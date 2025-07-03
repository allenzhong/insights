import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
};

export default (input: Input): Insight => {
  console.log(`Creating insight for brand=${input.brand}`);

  const createdAt = new Date().toISOString();

  // Insert into DB
  input.db.exec(
    insightsTable.insertStatement({
      brand: input.brand,
      createdAt,
      text: input.text,
    }),
  );

  // Get the last inserted row
  const [row] = input.db.sql<
    insightsTable.Row
  >`SELECT * FROM insights ORDER BY id DESC LIMIT 1`;

  const result = { ...row, createdAt: new Date(row.createdAt) };
  console.log("Insight created:", result);
  return result;
};
