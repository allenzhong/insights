export interface Insight {
  id: number;
  brand: number;
  text: string;
  createdAt: Date;
}

export interface CreateInsightRequest {
  brand: number;
  text: string;
}

const API_BASE_URL = "/api";

export async function fetchInsights(): Promise<Insight[]> {
  const response = await fetch(`${API_BASE_URL}/insights`);
  if (!response.ok) {
    throw new Error(`Failed to fetch insights: ${response.statusText}`);
  }
  const data = await response.json();
  return data.map((insight: Insight) => ({
    ...insight,
    createdAt: new Date(insight.createdAt),
  }));
}

export async function createInsight(
  data: CreateInsightRequest,
): Promise<Insight> {
  const response = await fetch(`${API_BASE_URL}/insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create insight: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function deleteInsight(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/insights/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete insight: ${response.statusText}`);
  }
}
