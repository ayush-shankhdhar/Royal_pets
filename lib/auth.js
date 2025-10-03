import jwt from "jsonwebtoken"
import pool from "@/lib/db"

export async function getUserFromToken(req) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.replace("Bearer ", "")
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await pool.query("SELECT id, email, role FROM users WHERE email = $1", [decoded])
    return rows[0] || null
  } catch {
    return null
  }
}
