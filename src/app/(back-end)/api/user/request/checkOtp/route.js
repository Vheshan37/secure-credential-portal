"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { id, otp } = await req.json();

    // validate input data
    if (!id || !otp) {
      return NextResponse.json(
        { error: "Both ID and OTP are required" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify OTP (case-sensitive comparison)
    if (user.otp !== otp.trim()) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // remove the otp code
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { otp: null },
    });

    // On success
    return NextResponse.json(
      { success: true, message: "OTP verified" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
