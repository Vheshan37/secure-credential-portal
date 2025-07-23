import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, circuitId, otp } = body;

    if (!email || !circuitId || !otp) {
      return NextResponse.json(
        { error: "Email, Circuit ID and OTP are required." },
        { status: 400 }
      );
    }

    // Find user with matching email, circuitId and OTP
    const user = await prisma.user.findFirst({
      where: {
        email,
        circuit_id: circuitId,
        otp,
        status: "pending",
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid OTP or user not found." },
        { status: 401 }
      );
    }

    // Update user status to active
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "active",
        otp: null, // Clear OTP after successful verification
      },
    });

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: "user",
    });

    const response = NextResponse.json({
      success: true,
      token,
    });

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
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "An error occurred during OTP verification." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
