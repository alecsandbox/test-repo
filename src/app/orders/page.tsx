"use client";

import { useEffect, useState, useCallback } from "react";
import { Order, OrderStatus } from "@/lib/mockData";
import styles from "./page.module.css";

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  fulfilled: styles.statusFulfilled,
  cancelled: styles.statusCancelled,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const url =
        activeTab === "all"
          ? "/api/orders"
          : `/api/orders?status=${activeTab}`;
      const res = await fetch(url);
      if (res.ok) {
        setOrders(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchOrders();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Order History</h1>
        <p className={styles.subtitle}>View and manage customer orders</p>
      </header>

      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${
              activeTab === tab.value ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className={styles.emptyText}>
          No orders found{activeTab !== "all" ? ` with status "${activeTab}"` : ""}.
        </p>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>{order.id}</span>
                  <span
                    className={`${styles.statusBadge} ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderMeta}>
                  <span>{order.customerName}</span>
                  <span className={styles.orderDate}>
                    {formatDate(order.createdAt)} at{" "}
                    {formatTime(order.createdAt)}
                  </span>
                </div>
              </div>

              <ul className={styles.orderItems}>
                {order.items.map((item) => (
                  <li key={item.doughnutId} className={styles.orderItem}>
                    <span>
                      {item.quantity}× {item.doughnutId}
                    </span>
                    <span className={styles.itemTotal}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.orderFooter}>
                <span className={styles.orderTotal}>
                  Total: ${order.total.toFixed(2)}
                </span>
                <div className={styles.actions}>
                  {order.status === "pending" && (
                    <>
                      <button
                        className={`${styles.actionBtn} ${styles.confirmBtn}`}
                        onClick={() => updateStatus(order.id, "confirmed")}
                        disabled={updatingId === order.id}
                      >
                        Confirm
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                        onClick={() => updateStatus(order.id, "cancelled")}
                        disabled={updatingId === order.id}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === "confirmed" && (
                    <>
                      <button
                        className={`${styles.actionBtn} ${styles.fulfillBtn}`}
                        onClick={() => updateStatus(order.id, "fulfilled")}
                        disabled={updatingId === order.id}
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                        onClick={() => updateStatus(order.id, "cancelled")}
                        disabled={updatingId === order.id}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
