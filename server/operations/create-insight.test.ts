import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";

describe("creating insights in the database", () => {
  describe("creating a new insight", () => {
    withDB((fixture) => {
      const insightData = {
        brand: 1,
        text: "Test insight text",
      };

      let result: Insight;

      beforeAll(() => {
        result = createInsight({ ...fixture, ...insightData });
      });

      it("returns the created insight", () => {
        expect(result).toBeDefined();
        expect(result.brand).toBe(insightData.brand);
        expect(result.text).toBe(insightData.text);
        expect(result.id).toBeGreaterThan(0);
        expect(result.createdAt).toBeInstanceOf(Date);
      });

      it("stores the insight in the database", () => {
        const allInsights = fixture.insights.selectAll();
        expect(allInsights.length).toBe(1);
        expect(allInsights[0].brand).toBe(insightData.brand);
        expect(allInsights[0].text).toBe(insightData.text);
      });
    });
  });

  describe("creating multiple insights", () => {
    withDB((fixture) => {
      const insightsData = [
        { brand: 1, text: "First insight" },
        { brand: 2, text: "Second insight" },
        { brand: 3, text: "Third insight" },
      ];

      let results: Insight[];

      beforeAll(() => {
        results = insightsData.map((data) =>
          createInsight({ ...fixture, ...data })
        );
      });

      it("creates all insights with unique IDs", () => {
        expect(results.length).toBe(3);
        const ids = results.map((r) => r.id);
        expect(new Set(ids).size).toBe(3); // All IDs should be unique
      });

      it("stores all insights in the database", () => {
        const allInsights = fixture.insights.selectAll();
        expect(allInsights.length).toBe(3);
      });
    });
  });
});
