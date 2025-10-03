import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }

    const existing = await pool.query("SELECT * FROM newsletter WHERE email = $1", [email]);

    if (existing.rows.length > 0) {
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    await pool.query("INSERT INTO newsletter (email) VALUES ($1)", [email]);

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
