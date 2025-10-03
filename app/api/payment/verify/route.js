import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"
import axios from "axios"

export async function GET(req) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  const order_id = req.nextUrl.searchParams.get("order_id")
  if (!order_id) return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 })
  try {
    const client = await pool.connect()
    const orderRes = await client.query(
      "SELECT * FROM orders WHERE cashfree_order_id = $1 AND user_id = $2",
      [order_id, user.id]
    )
    if (orderRes.rows.length === 0) {
      client.release()
      return NextResponse.json({ success: false, message: "Order not found" })
    }
    const order = orderRes.rows[0]
    if (order.status === "paid") {
      client.release()
      return NextResponse.json({ success: true, message: "Already paid" })
    }
    const baseurl = `${process.env.ENV === "prod" ? "https://sandbox.cashfree.com" : "https://sandbox.cashfree.com"}/pg/orders/${order_id}/payments`;
    const client_id = process.env.ENV === "prod" ? process.env.CF_APIKEY_TEST : process.env.CF_APIKEY_TEST;
    const client_secret = process.env.ENV === "prod" ? process.env.CF_APISECRET_TEST : process.env.CF_APISECRET_TEST;
    const response = await axios.get(baseurl, {
      headers: {
        "x-api-version": "2025-01-01",
        "Content-Type": "application/json",
        "x-client-id": client_id,
        "x-client-secret": client_secret
      }
    });
    const paymentData = response.data[0];
    await client.query(
      `INSERT INTO payments (order_id, payment_id, amount, status, method)
         VALUES ($1, $2, $3, $4, $5)`,
      [order.id, paymentData.cf_payment_id, paymentData.order_amount, paymentData.payment_status, paymentData.payment_group]
    )
    if (paymentData.payment_status != "SUCCESS") {
      return NextResponse.json({ success: false, message: "Payment Failed" });
    }
    const cartItemsRes = await client.query(`
      SELECT c.product_id, c.quantity, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [user.id])
    const cartItems = cartItemsRes.rows
    if (cartItems.length === 0) {
      client.release()
      return NextResponse.json({ success: false, message: "Cart is empty" })
    }
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      )
    }
    await client.query("UPDATE orders SET status = 'paid' WHERE id = $1", [order.id])
    await client.query("DELETE FROM cart WHERE user_id = $1", [user.id])
    client.release()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Payment verify error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

