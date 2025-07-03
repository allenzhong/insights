import { useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onInsightAdded?: () => void;
};

export const AddInsight = (props: AddInsightProps) => {
  const [brand, setBrand] = useState(BRANDS[0].id);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/insights/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brand, text: text.trim() }),
      });

      if (response.ok) {
        setText("");
        setBrand(BRANDS[0].id);
        props.onInsightAdded?.();
        props.onClose?.();
      } else {
        console.error("Failed to add insight");
      }
    } catch (error) {
      console.error("Error adding insight:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          Brand
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={(e) => setBrand(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <Button
          className={styles.submit}
          type="submit"
          label={isSubmitting ? "Adding..." : "Add insight"}
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
};
