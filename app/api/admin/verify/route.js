import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import pool from "@/lib/db"

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const email = decoded;
    if (!email) {
      return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 400 })
    }

    const { rows } = await pool.query("SELECT role FROM users WHERE email = $1", [email])
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const userRole = rows[0].role
    if (userRole !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ success: true, message: "Authorized", role: userRole })
  } catch (err) {
    console.error("Auth error:", err)
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
  }
}
