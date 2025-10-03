import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q");
  if (!keyword || keyword.trim() === "") {
    return NextResponse.json({ success: false, message: "Search query is required." }, { status: 400 });
  }
  try {
    const client = await pool.connect();
    const query = `
      SELECT id, name, image, price
      FROM products
      WHERE name ILIKE $1
      ORDER BY name ASC
      LIMIT 4
    `;
    const result = await client.query(query, [`%${keyword}%`]);
    client.release();
    return NextResponse.json({ success: true, products: result.rows });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
