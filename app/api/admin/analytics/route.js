import { NextResponse } from "next/server"
import pool from "@/lib/db"
import jwt from "jsonwebtoken"

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check user's role from DB
    const { rows } = await pool.query("SELECT role FROM users WHERE email = $1", [decoded])
    if (rows.length === 0 || rows[0].role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Run analytics queries
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      todaySales,
      monthSales
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM products"),
      pool.query("SELECT COUNT(*) FROM orders"),
      pool.query("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE"),
      pool.query("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)")
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalProducts: parseInt(totalProducts.rows[0].count),
        totalOrders: parseInt(totalOrders.rows[0].count),
        todaySales: parseFloat(todaySales.rows[0].coalesce),
        monthlySales: parseFloat(monthSales.rows[0].coalesce)
      }
    })
  } catch (err) {
    console.error("Analytics error:", err)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
