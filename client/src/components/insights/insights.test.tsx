import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Insights } from "./insights.tsx";

const TEST_INSIGHTS = [
  {
    id: 1,
    brand: 1,
    createdAt: new Date(),
    text: "Test insight",
  },
  { id: 2, brand: 2, createdAt: new Date(), text: "Another test insight" },
];

describe("Insights component", () => {
  it("renders insights", () => {
    render(<Insights insights={TEST_INSIGHTS} onDeleteInsight={() => {}} />);

    expect(screen.getByText(TEST_INSIGHTS[0].text)).toBeInTheDocument();
    expect(screen.getByText(TEST_INSIGHTS[1].text)).toBeInTheDocument();
  });
});
