"use client";

import { Doughnut, InventoryEntry } from "@/lib/mockData";
import styles from "./DoughnutCard.module.css";

const LOW_STOCK_THRESHOLD = 5;

interface DoughnutCardProps {
  doughnut: Doughnut;
  inventory: InventoryEntry | undefined;
  cartQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function DoughnutCard({
  doughnut,
  inventory: entry,
  cartQuantity,
  onAdd,
  onRemove,
}: DoughnutCardProps) {
  const count = entry?.count ?? 0;
  const isOut = count === 0;
  const isLow = !isOut && count <= LOW_STOCK_THRESHOLD;
  const canAdd = count - cartQuantity > 0;

  return (
    <li
      className={`${styles.card} ${
        isOut ? styles.outOfStock : isLow ? styles.lowStock : ""
      }`}
    >
      <div className={styles.cardTop}>
        <h2 className={styles.name}>{doughnut.name}</h2>
        <span className={styles.price}>${doughnut.price.toFixed(2)}</span>
      </div>
      <p className={styles.description}>{doughnut.description}</p>

      <div className={styles.stockRow}>
        {isOut ? (
          <span className={`${styles.badge} ${styles.badgeOut}`}>
            Out of stock
          </span>
        ) : isLow ? (
          <span className={`${styles.badge} ${styles.badgeLow}`}>
            Low stock — {count} left
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeOk}`}>
            {count} in stock
          </span>
        )}
        {entry && (
          <span className={styles.updated}>
            Updated{" "}
            {new Date(entry.lastUpdated).toLocaleDateString("en-US", {
              timeZone: "UTC",
            })}
          </span>
        )}
      </div>

      {!isOut && (
        <div className={styles.cartActions}>
          {cartQuantity > 0 ? (
            <div className={styles.quantityControl}>
              <button
                className={styles.qtyBtn}
                onClick={onRemove}
                aria-label={`Remove one ${doughnut.name}`}
              >
                −
              </button>
              <span className={styles.qtyCount}>{cartQuantity}</span>
              <button
                className={styles.qtyBtn}
                onClick={onAdd}
                disabled={!canAdd}
                aria-label={`Add one ${doughnut.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className={styles.addBtn}
              onClick={onAdd}
              disabled={!canAdd}
            >
              Add to Order
            </button>
          )}
        </div>
      )}
    </li>
  );
}
