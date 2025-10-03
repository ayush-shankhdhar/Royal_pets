import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  const { email, password } = await req.json()
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 })
    }
    const user = rows[0]
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 })
    }
    const token = jwt.sign(
      user.email,
      JWT_SECRET,
    )
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
    })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
