export interface Doughnut {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface InventoryEntry {
  doughnutId: string;
  count: number;
  lastUpdated: string;
}

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export interface OrderItem {
  doughnutId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  items: { doughnutId: string; quantity: number }[];
}

export const doughnuts: Doughnut[] = [
  {
    id: "glazed",
    name: "Classic Glazed",
    description: "Light, fluffy yeast doughnut coated in a sweet vanilla glaze.",
    price: 1.25,
  },
  {
    id: "chocolate",
    name: "Chocolate Frosted",
    description: "Yeast doughnut topped with rich chocolate icing.",
    price: 1.5,
  },
  {
    id: "strawberry",
    name: "Strawberry Sprinkles",
    description: "Cake doughnut with strawberry glaze and colourful sprinkles.",
    price: 1.75,
  },
  {
    id: "maple-bacon",
    name: "Maple Bacon",
    description: "Yeast doughnut with maple glaze and crispy bacon bits on top.",
    price: 2.5,
  },
  {
    id: "boston-cream",
    name: "Boston Cream",
    description: "Filled with vanilla custard and dipped in chocolate ganache.",
    price: 2.0,
  },
  {
    id: "blueberry",
    name: "Blueberry Cake",
    description: "Dense cake doughnut packed with real blueberries.",
    price: 1.75,
  },
];

export const inventory: InventoryEntry[] = [
  { doughnutId: "glazed",       count: 42,  lastUpdated: "2026-03-10T08:00:00Z" },
  { doughnutId: "chocolate",    count: 5,   lastUpdated: "2026-03-10T08:05:00Z" },
  { doughnutId: "strawberry",   count: 3,   lastUpdated: "2026-03-10T08:10:00Z" },
  { doughnutId: "maple-bacon",  count: 18,  lastUpdated: "2026-03-10T08:15:00Z" },
  { doughnutId: "boston-cream", count: 0,   lastUpdated: "2026-03-10T08:20:00Z" },
  { doughnutId: "blueberry",    count: 11,  lastUpdated: "2026-03-10T08:25:00Z" },
];

let orderCounter = 3;

export function generateOrderId(): string {
  orderCounter += 1;
  return `ORD-${String(orderCounter).padStart(4, "0")}`;
}

export const orders: Order[] = [
  {
    id: "ORD-0001",
    items: [
      { doughnutId: "glazed", quantity: 6, unitPrice: 1.25 },
      { doughnutId: "maple-bacon", quantity: 2, unitPrice: 2.5 },
    ],
    total: 12.5,
    status: "fulfilled",
    customerName: "Alice Johnson",
    createdAt: "2026-03-09T14:30:00Z",
  },
  {
    id: "ORD-0002",
    items: [
      { doughnutId: "chocolate", quantity: 3, unitPrice: 1.5 },
      { doughnutId: "boston-cream", quantity: 2, unitPrice: 2.0 },
    ],
    total: 8.5,
    status: "confirmed",
    customerName: "Bob Martinez",
    createdAt: "2026-03-10T09:15:00Z",
  },
  {
    id: "ORD-0003",
    items: [
      { doughnutId: "strawberry", quantity: 1, unitPrice: 1.75 },
    ],
    total: 1.75,
    status: "pending",
    customerName: "Carol Williams",
    createdAt: "2026-03-10T10:45:00Z",
  },
];
