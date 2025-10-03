import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  const { product_id } = await req.json()
  try {
    await pool.query(
      `DELETE FROM wishlist
       WHERE user_id = $1
       AND product_id = $2`,
      [user.id, product_id]
    )
    return NextResponse.json({ success: true, message: "Item removed from wishlist" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 })
  }
}
