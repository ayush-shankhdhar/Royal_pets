import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await pool.query("SELECT role FROM users WHERE email = $1", [decoded])
    const user = rows[0];

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, price, image, category } = body

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    await pool.query(
      "INSERT INTO products (name, description, price, image, category) VALUES ($1, $2, $3, $4, $5)",
      [name, description, price, image, category]
    )

    return NextResponse.json({ success: true, message: "Product added successfully" })
  } catch (err) {
    console.error("Add Product Error:", err)
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
}
