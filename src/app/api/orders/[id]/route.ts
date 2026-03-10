import { NextRequest, NextResponse } from "next/server";
import { orders, OrderStatus } from "@/lib/mockData";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["fulfilled", "cancelled"],
  fulfilled: [],
  cancelled: [],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const newStatus = body.status as OrderStatus;

    if (!newStatus) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Cannot transition from "${order.status}" to "${newStatus}"`,
        },
        { status: 422 }
      );
    }

    order.status = newStatus;

    return NextResponse.json(order, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
