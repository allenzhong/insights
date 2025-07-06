import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createInsight,
  type CreateInsightRequest,
  deleteInsight,
  fetchInsights,
} from "./api.ts";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchInsights", () => {
  it("should fetch insights successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                brand: 1,
                text: "A",
                createdAt: "2025-07-06T09:00:00.000Z",
              },
              {
                id: 2,
                brand: 2,
                text: "B",
                createdAt: "2025-07-06T10:00:00.000Z",
              },
            ]),
          statusText: "OK",
        })
      ),
    );

    const result = await fetchInsights();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[0].brand).toBe(1);
    expect(result[0].createdAt).toBeInstanceOf(Date);
  });

  it("should throw on error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
          statusText: "Error",
        })
      ),
    );
    await expect(fetchInsights()).rejects.toThrow();
  });

  it("should throw on network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );
    await expect(fetchInsights()).rejects.toThrow("Network error");
  });
});

describe("createInsight", () => {
  it("should create insight successfully", async () => {
    const req: CreateInsightRequest = { brand: 1, text: "C" };
    const mockResp = {
      id: 3,
      brand: 1,
      text: "C",
      createdAt: "2025-07-06T11:00:00.000Z",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResp),
          statusText: "OK",
        })
      ),
    );

    const result = await createInsight(req);
    expect(result.id).toBe(3);
    expect(result.text).toBe("C");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("should throw on error response", async () => {
    const req: CreateInsightRequest = { brand: 1, text: "fail" };
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
          statusText: "Error",
        })
      ),
    );
    await expect(createInsight(req)).rejects.toThrow();
  });

  it("should throw on network error", async () => {
    const req: CreateInsightRequest = { brand: 1, text: "fail" };
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );
    await expect(createInsight(req)).rejects.toThrow("Network error");
  });
});

describe("deleteInsight", () => {
  it("should delete insight successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, statusText: "OK" })),
    );
    await expect(deleteInsight(1)).resolves.not.toThrow();
  });

  it("should throw on error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, statusText: "Not Found" })),
    );
    await expect(deleteInsight(999)).rejects.toThrow();
  });

  it("should throw on network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );
    await expect(deleteInsight(1)).rejects.toThrow("Network error");
  });
});
