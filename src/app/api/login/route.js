import { signToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { success, z } from "zod";

const prisma = new PrismaClient();

const LoginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      // Transform Zod errors into a more client-friendly format
      const errors = result.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Invalid input";

      return NextResponse.json(
        { error: firstError, details: errors },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    const user = await prisma.admin.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id });
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
