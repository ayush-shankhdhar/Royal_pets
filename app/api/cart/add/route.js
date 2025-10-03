import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
  const { product_id, quantity } = await req.json()
  try {
    await pool.query(
      `
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity;
      `,
      [user.id, product_id, quantity]
    )
    return NextResponse.json({ success: true, message: "Item added to cart" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 })
  }
}
