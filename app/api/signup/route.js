import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { firstName, lastName, email, password } = await req.json();
    if (!email || !password || !firstName || !lastName) {
        return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 })
    }
    const fullName = `${firstName} ${lastName}`
    try {
        const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email])
        if (existing.rows.length > 0) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            [fullName, email, hashedPassword]
        )
        const token = jwt.sign(
            email,
            process.env.JWT_SECRET,
        )
        return NextResponse.json({ success: true, message: "Signup successful", token })
    } catch (err) {
        console.error("Signup error:", err)
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}
