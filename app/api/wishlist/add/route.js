// /app/api/wishlist/add/route.js
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  const { product_id } = await req.json();
  try {
    await pool.query(
      `
      INSERT INTO wishlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
      `,
      [user.id, product_id]
    )
    return NextResponse.json({ success: true, message: "Item added to wishlist" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 })
  }
}
