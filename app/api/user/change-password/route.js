import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  const { oldPassword, newPassword } = await req.json()
  try {
    const client = await pool.connect()
    const res = await client.query("SELECT password FROM users WHERE id = $1", [user.id])
    const hashed = res.rows[0]?.password
    const match = await bcrypt.compare(oldPassword, hashed)
    if (!match) {
      client.release()
      return NextResponse.json({ success: false, message: "Old password incorrect" })
    }
    const newHashed = await bcrypt.hash(newPassword, 10)
    await client.query("UPDATE users SET password = $1 WHERE id = $2", [newHashed, user.id])
    client.release()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: "Password update failed" }, { status: 500 })
  }
}
