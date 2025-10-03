import { NextResponse } from "next/server"
import pool from "@/lib/db"
import axios from "axios"
import { getUserFromToken } from "@/lib/auth"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
    try {
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const { address, phone } = await req.json();
        const userId = user.id;
        const cartRes = await pool.query("SELECT * FROM cart WHERE user_id = $1", [userId])
        const cart = cartRes.rows
        if (!cart.length) return NextResponse.json({ success: false, message: "Cart empty" })
        const productIds = cart.map(i => i.product_id)
        const productQuery = await pool.query("SELECT id, price FROM products WHERE id = ANY($1::int[])", [productIds])
        const products = productQuery.rows
        let total = 0
        for (let item of cart) {
            const prod = products.find(p => p.id === item.product_id)
            if (prod) total += prod.price * item.quantity
        }
        const client_id = process.env.ENV === "prod" ? process.env.CF_APIKEY_PROD : process.env.CF_APIKEY_TEST;
        const client_secret = process.env.ENV === "prod" ? process.env.CF_APISECRET_PROD : process.env.CF_APISECRET_TEST;
        const sid = 'user-psession-' + uuidv4().slice(0,13);
        const res = await axios.post(
            `${process.env.ENV === "prod"
                ? "https://api.cashfree.com"
                : "https://sandbox.cashfree.com"
            }/pg/orders`,
            {
                order_amount: total,
                order_currency: "INR",
                customer_details: {
                    customer_id: sid,
                    customer_phone: phone
                },
                order_meta: {
                    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?order_id={order_id}`
                }
            },
            {
                headers: {
                    "x-api-version": "2025-01-01",
                    "Content-Type": "application/json",
                    "x-client-id": client_id,
                    "x-client-secret": client_secret
                }
            }
        )
        const cashfreeOrder = res.data
        await pool.query(
            "INSERT INTO orders (user_id, cashfree_order_id, total_amount, status, address) VALUES ($1, $2, $3, $4, $5)",
            [userId, cashfreeOrder.order_id, total, "pending", address]
        )

        return NextResponse.json({ success: true, paymentSessionId: cashfreeOrder.payment_session_id })
    } catch (err) {
        console.error("Cashfree Checkout Error", err)
        return NextResponse.json({ success: false, message: "Payment initiation failed" }, { status: 500 })
    }
}
