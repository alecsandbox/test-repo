"use client";

import { useState, useCallback } from "react";
import { Doughnut, InventoryEntry } from "@/lib/mockData";
import DoughnutCard from "./DoughnutCard";
import CartPanel from "./CartPanel";
import styles from "./InventoryView.module.css";

interface InventoryViewProps {
  doughnuts: Doughnut[];
  inventory: InventoryEntry[];
}

export default function InventoryView({
  doughnuts,
  inventory,
}: InventoryViewProps) {
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);

  const inventoryMap = new Map<string, InventoryEntry>(
    inventory.map((entry) => [entry.doughnutId, entry])
  );

  const updateQuantity = useCallback((doughnutId: string, delta: number) => {
    setCart((prev) => {
      const next = new Map(prev);
      const current = next.get(doughnutId) ?? 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        next.delete(doughnutId);
      } else {
        next.set(doughnutId, updated);
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(new Map());
  }, []);

  const handleOrderPlaced = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const totalItems = Array.from(cart.values()).reduce(
    (sum, qty) => sum + qty,
    0
  );

  return (
    <div className={styles.layout} key={refreshKey}>
      <div className={styles.menuSection}>
        <header className={styles.header}>
          <h1>🍩 Doughnut Inventory</h1>
          <p className={styles.subtitle}>
            Fresh doughnuts — updated daily
            {totalItems > 0 && (
              <span className={styles.cartCount}>
                {" "}
                · {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
              </span>
            )}
          </p>
        </header>

        <div className={styles.legend}>
          <span className={`${styles.legendDot} ${styles.legendDotLow}`} />
          <span>Low stock (≤ 5)</span>
          <span className={`${styles.legendDot} ${styles.legendDotOut}`} />
          <span>Out of stock</span>
        </div>

        <ul className={styles.grid}>
          {doughnuts.map((doughnut) => (
            <DoughnutCard
              key={doughnut.id}
              doughnut={doughnut}
              inventory={inventoryMap.get(doughnut.id)}
              cartQuantity={cart.get(doughnut.id) ?? 0}
              onAdd={() => updateQuantity(doughnut.id, 1)}
              onRemove={() => updateQuantity(doughnut.id, -1)}
            />
          ))}
        </ul>
      </div>

      <aside className={styles.cartSection}>
        <CartPanel
          cart={cart}
          doughnuts={doughnuts}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
          onOrderPlaced={handleOrderPlaced}
        />
      </aside>
    </div>
  );
}
