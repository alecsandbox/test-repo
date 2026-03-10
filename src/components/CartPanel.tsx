"use client";

import { useState } from "react";
import { Doughnut } from "@/lib/mockData";
import styles from "./CartPanel.module.css";

interface CartPanelProps {
  cart: Map<string, number>;
  doughnuts: Doughnut[];
  onUpdateQuantity: (doughnutId: string, delta: number) => void;
  onClearCart: () => void;
  onOrderPlaced: () => void;
}

export default function CartPanel({
  cart,
  doughnuts,
  onUpdateQuantity,
  onClearCart,
  onOrderPlaced,
}: CartPanelProps) {
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const doughnutMap = new Map(doughnuts.map((d) => [d.id, d]));
  const cartEntries = Array.from(cart.entries())
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ doughnut: doughnutMap.get(id)!, quantity: qty }));

  const total = cartEntries.reduce(
    (sum, { doughnut, quantity }) => sum + doughnut.price * quantity,
    0
  );

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          items: cartEntries.map(({ doughnut, quantity }) => ({
            doughnutId: doughnut.id,
            quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to place order");
      }

      const order = await res.json();
      setSuccess(`Order ${order.id} placed successfully!`);
      setCustomerName("");
      onClearCart();
      onOrderPlaced();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartEntries.length === 0 && !success) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.title}>Your Order</h2>
        <p className={styles.empty}>
          No items yet. Add doughnuts from the menu!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>Your Order</h2>
        {cartEntries.length > 0 && (
          <button className={styles.clearBtn} onClick={onClearCart}>
            Clear
          </button>
        )}
      </div>

      {success && <p className={styles.success}>{success}</p>}

      {cartEntries.length > 0 && (
        <>
          <ul className={styles.items}>
            {cartEntries.map(({ doughnut, quantity }) => (
              <li key={doughnut.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{doughnut.name}</span>
                  <span className={styles.itemPrice}>
                    ${(doughnut.price * quantity).toFixed(2)}
                  </span>
                </div>
                <div className={styles.itemQty}>
                  <button
                    className={styles.smallBtn}
                    onClick={() => onUpdateQuantity(doughnut.id, -1)}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    className={styles.smallBtn}
                    onClick={() => onUpdateQuantity(doughnut.id, 1)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>${total.toFixed(2)}</span>
          </div>

          <div className={styles.form}>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing…" : "Place Order"}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </>
      )}
    </div>
  );
}
