import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): { success: boolean; message: string } => {
  console.log(`Deleting insight with id=${input.id}`);

  // Check if insight exists
  const [existingRow] = input.db
    .sql<
    insightsTable.Row
  >`SELECT * FROM insights WHERE id = ${input.id} LIMIT 1`;

  if (!existingRow) {
    console.log("Insight not found for deletion");
    throw new Error(`Insight with id ${input.id} not found`);
  }

  // Delete the insight
  input.db.exec(`DELETE FROM insights WHERE id = ${input.id}`);

  console.log(`Insight with id=${input.id} deleted successfully`);
  return {
    success: true,
    message: `Insight with id ${input.id} deleted successfully`,
  };
};
