import { NextResponse } from "next/server";
import { inventory } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(inventory, { status: 200 });
}
