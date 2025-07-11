import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../lib/api.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onDeleteInsight: (id: number) => void;
};

export const Insights = ({
  insights,
  className,
  onDeleteInsight,
}: InsightsProps) => {
  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length ? (
          insights.map(({ id, text, createdAt, brand }) => (
            <div className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>{brand}</span>
                <div className={styles["insight-meta-details"]}>
                  <span>{new Date(createdAt).toLocaleString()}</span>
                  <Trash2Icon
                    className={styles["insight-delete"]}
                    onClick={() => onDeleteInsight(id)}
                  />
                </div>
              </div>
              <p className={styles["insight-content"]}>{text}</p>
            </div>
          ))
        ) : (
          <p>We have no insight!</p>
        )}
      </div>
    </div>
  );
};
