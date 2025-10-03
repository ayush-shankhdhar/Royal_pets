import { NextResponse } from "next/server";
import pool from "@/lib/db";
const FEATURED_IDS = [1, 2, 3, 7];
export async function GET() {
  try {
    const query = `
      SELECT id, name, price, category, image
      FROM products
      WHERE id = ANY($1)
    `
    const { rows } = await pool.query(query, [FEATURED_IDS]);
    return NextResponse.json({ success: true, products: rows });
  } catch (err) {
    console.error("Error fetching featured products:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured products" },
      { status: 500 }
    )
  }
}
