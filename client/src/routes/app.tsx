import { useEffect, useState } from "react";
import { AddInsight } from "../components/add-insight/add-insight.tsx";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import {
  fetchInsights,
  createInsight,
  deleteInsight,
  type Insight,
} from "../lib/api.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadInsights = async () => {
    try {
      const data = await fetchInsights();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  const handleDeleteInsight = async (id: number) => {
    if (!confirm("Are you sure you want to delete this insight?")) {
      return;
    }

    try {
      await deleteInsight(id);
      loadInsights();
    } catch (error) {
      console.error("Error deleting insight:", error);
    }
  };

  const handleAddInsight = async (data: { brand: number; text: string }) => {
    try {
      await createInsight(data);
      loadInsights();
    } catch (error) {
      console.error("Failed to add insight:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (showAddModal) return;

    loadInsights();
  }, [showAddModal]);

  return (
    <main className={styles.main}>
      <Header onAddClick={() => setShowAddModal(true)} />
      <Insights
        className={styles.insights}
        insights={insights}
        onDeleteInsight={handleDeleteInsight}
      />
      <AddInsight
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddInsight}
      />
    </main>
  );
};
