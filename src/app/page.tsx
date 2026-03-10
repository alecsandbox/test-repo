import styles from "./page.module.css";
import { Doughnut, InventoryEntry } from "@/lib/mockData";

const LOW_STOCK_THRESHOLD = 5;

async function getDoughnuts(): Promise<Doughnut[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/doughnuts`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch doughnuts");
  return res.json();
}

async function getInventory(): Promise<InventoryEntry[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/inventory`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export default async function Home() {
  const [doughnuts, inventory] = await Promise.all([getDoughnuts(), getInventory()]);

  const inventoryMap = new Map<string, InventoryEntry>(
    inventory.map((entry) => [entry.doughnutId, entry])
  );

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>🍩 Doughnut Inventory</h1>
        <p className={styles.subtitle}>Fresh doughnuts — updated daily</p>
      </header>

      <div className={styles.legend}>
        <span className={`${styles.legendDot} ${styles.legendDotLow}`} />
        <span>Low stock (≤ {LOW_STOCK_THRESHOLD})</span>
        <span className={`${styles.legendDot} ${styles.legendDotOut}`} />
        <span>Out of stock</span>
      </div>

      <ul className={styles.grid}>
        {doughnuts.map((doughnut) => {
          const entry = inventoryMap.get(doughnut.id);
          const count = entry?.count ?? 0;
          const isOut = count === 0;
          const isLow = !isOut && count <= LOW_STOCK_THRESHOLD;

          return (
            <li
              key={doughnut.id}
              className={`${styles.card} ${isOut ? styles.outOfStock : isLow ? styles.lowStock : ""}`}
            >
              <div className={styles.cardTop}>
                <h2 className={styles.name}>{doughnut.name}</h2>
                <span className={styles.price}>${doughnut.price.toFixed(2)}</span>
              </div>
              <p className={styles.description}>{doughnut.description}</p>
              <div className={styles.stockRow}>
                {isOut ? (
                  <span className={`${styles.badge} ${styles.badgeOut}`}>Out of stock</span>
                ) : isLow ? (
                  <span className={`${styles.badge} ${styles.badgeLow}`}>
                    Low stock — {count} left
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeOk}`}>{count} in stock</span>
                )}
                {entry && (
                  <span className={styles.updated}>
                    Updated {new Date(entry.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
