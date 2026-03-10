import { NextRequest, NextResponse } from "next/server";
import {
  orders,
  doughnuts,
  inventory,
  generateOrderId,
  CreateOrderPayload,
  Order,
  OrderItem,
} from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let filtered = orders;

  if (status) {
    filtered = orders.filter((o) => o.status === status);
  }

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(sorted, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderPayload = await request.json();

    if (!body.customerName?.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of body.items) {
      const doughnut = doughnuts.find((d) => d.id === item.doughnutId);
      if (!doughnut) {
        return NextResponse.json(
          { error: `Unknown doughnut: ${item.doughnutId}` },
          { status: 400 }
        );
      }

      if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json(
          { error: `Invalid quantity for ${doughnut.name}` },
          { status: 400 }
        );
      }

      const inventoryEntry = inventory.find(
        (inv) => inv.doughnutId === item.doughnutId
      );

      if (!inventoryEntry || inventoryEntry.count < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${doughnut.name}. Available: ${inventoryEntry?.count ?? 0}`,
          },
          { status: 409 }
        );
      }

      orderItems.push({
        doughnutId: item.doughnutId,
        quantity: item.quantity,
        unitPrice: doughnut.price,
      });

      total += doughnut.price * item.quantity;
    }

    for (const item of orderItems) {
      const inventoryEntry = inventory.find(
        (inv) => inv.doughnutId === item.doughnutId
      );
      if (inventoryEntry) {
        inventoryEntry.count += item.quantity;
        inventoryEntry.lastUpdated = new Date().toISOString();
      }
    }

    const newOrder: Order = {
      id: generateOrderId(),
      items: orderItems,
      total: Math.round(total * 100) / 100,
      status: "pending",
      customerName: body.customerName.trim(),
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
