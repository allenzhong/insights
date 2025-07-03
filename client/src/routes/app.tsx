import { useEffect, useState } from "react";
import { AddInsight } from "../components/add-insight/add-insight.tsx";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchInsights = () => {
    fetch(`/api/insights`)
      .then((res) => res.json())
      .then((data) => setInsights(data));
  };

  useEffect(() => {
    if (showAddModal) return;

    fetchInsights();
  }, [showAddModal]);

  return (
    <main className={styles.main}>
      <Header onAddClick={() => setShowAddModal(true)} />
      <Insights className={styles.insights} insights={insights} />
      <AddInsight
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onInsightAdded={fetchInsights}
      />
    </main>
  );
};
