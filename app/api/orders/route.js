import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req) {
  const user = await getUserFromToken(req)
  if (!user)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  try {
    const client = await pool.connect()
    const ordersRes = await client.query(
      `SELECT id, cashfree_order_id, address, status, created_at 
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user.id]
    )
    const orders = []
    for (const order of ordersRes.rows) {
      const itemsRes = await client.query(
        `SELECT oi.quantity, oi.price_at_time, p.name, p.image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = $1`,
        [order.id]
      )
      orders.push({
        ...order,
        items: itemsRes.rows,
      })
    }
    client.release()
    return NextResponse.json({ success: true, orders })
  } catch (err) {
    console.error("My Orders API Error:", err)
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }
}
