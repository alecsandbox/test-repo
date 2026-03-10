import { Doughnut, InventoryEntry } from "@/lib/mockData";
import InventoryView from "@/components/InventoryView";

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
  const [doughnuts, inventory] = await Promise.all([
    getDoughnuts(),
    getInventory(),
  ]);

  return <InventoryView doughnuts={doughnuts} inventory={inventory} />;
}
