import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req, { params }) {
  const user = await getUserFromToken(req)
  if (!user)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  const {id} = await params;
  const orderId = id;
  try {
    const client = await pool.connect()
    const orderRes = await client.query(
      `SELECT * FROM orders WHERE cashfree_order_id = $1 AND user_id = $2`,
      [orderId, user.id]
    )
    if (orderRes.rows.length === 0) {
      client.release()
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }
    const itemsRes = await client.query(
      `SELECT oi.quantity, oi.price_at_time, p.name, p.image as image
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       JOIN orders o ON oi.order_id = o.id
       WHERE o.cashfree_order_id = $1`,
      [orderId]
    )
    const order = {
      ...orderRes.rows[0],
      items: itemsRes.rows,
    }
    client.release()
    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error("Order detail fetch failed:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
