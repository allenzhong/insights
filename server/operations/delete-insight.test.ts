import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleting insights from the database", () => {
  describe("deleting an existing insight", () => {
    withDB((fixture) => {
      const insightData = {
        brand: 1,
        createdAt: new Date().toISOString(),
        text: "Test insight to delete",
      };

      let result: { success: boolean; message: string };

      beforeAll(() => {
        // Insert a test insight first
        fixture.insights.insert([insightData]);
        const allInsights = fixture.insights.selectAll();
        const insightId = allInsights[0].id;

        result = deleteInsight({ ...fixture, id: insightId });
      });

      it("returns success message", () => {
        expect(result.success).toBe(true);
        expect(result.message).toContain("deleted successfully");
      });

      it("removes the insight from the database", () => {
        const allInsights = fixture.insights.selectAll();
        expect(allInsights.length).toBe(0);
      });
    });
  });

  describe("deleting a non-existent insight", () => {
    withDB((fixture) => {
      it("throws an error", () => {
        expect(() => deleteInsight({ ...fixture, id: 999 })).toThrow(
          "Insight with id 999 not found",
        );
      });
    });
  });

  describe("deleting multiple insights", () => {
    withDB((fixture) => {
      const insightsData = [
        {
          brand: 1,
          createdAt: new Date().toISOString(),
          text: "First insight",
        },
        {
          brand: 2,
          createdAt: new Date().toISOString(),
          text: "Second insight",
        },
        {
          brand: 3,
          createdAt: new Date().toISOString(),
          text: "Third insight",
        },
      ];

      beforeAll(() => {
        // Insert test insights
        fixture.insights.insert(insightsData);
      });

      it("deletes specific insight and leaves others", () => {
        const allInsights = fixture.insights.selectAll();
        const insightToDelete = allInsights[1]; // Second insight

        deleteInsight({ ...fixture, id: insightToDelete.id });

        const remainingInsights = fixture.insights.selectAll();
        expect(remainingInsights.length).toBe(2);
        expect(remainingInsights.find((i) => i.id === insightToDelete.id))
          .toBeUndefined();
      });
    });
  });
});
