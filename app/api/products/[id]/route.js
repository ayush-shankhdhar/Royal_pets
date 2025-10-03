import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req, { params }) {
  const {id} = await params;
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM products WHERE id = $1", [id])
    client.release()
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, product: result.rows[0] })
  } catch (err) {
    console.error("Product fetch error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
