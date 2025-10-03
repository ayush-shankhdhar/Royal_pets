import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  try {
    const client = await pool.connect()
    const res = await client.query("SELECT name, email, role, created_at FROM users WHERE id = $1", [user.id])
    client.release()
    return NextResponse.json({ success: true, user: res.rows[0] })
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error fetching user" }, { status: 500 })
  }
}
