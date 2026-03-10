import { NextResponse } from "next/server";
import { doughnuts } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(doughnuts, { status: 200 });
}
