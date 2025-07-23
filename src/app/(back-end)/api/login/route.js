"use server";

import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Invalid input";

      return NextResponse.json(
        { error: firstError, details: errors },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    // ✅ Instead of database, check .env variables
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create token with a generic payload (no DB ID needed)
    const token = await signToken({
      admin: true,
      role: "admin",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
