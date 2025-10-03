import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
export async function POST(req) {
  const user = await getUserFromToken(req)
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { product_id, change } = await req.json();
  try {
    await pool.query(
      `UPDATE cart
       SET quantity = quantity + $1
       WHERE user_id = $2 AND product_id = $3`,
      [change, user.id, product_id]
    )
    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 });
  }
}
