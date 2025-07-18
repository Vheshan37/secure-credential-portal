"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, circuitId } = body;

    if (!email || !circuitId) {
      return NextResponse.json(
        { error: "Email and Circuit ID are required." },
        { status: 400 }
      );
    }

    // ✅ Check if user exists with matching email + circuitId
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        circuit_id: circuitId,
      },
    });

    console.log("Email:", email);
    console.log("Circuit ID:", circuitId);
    console.log("User:", user);

    if (user) {
      // ✅ Exact match found → issue token and login
      const token = await signToken({
        userId: user.id,
        email: user.email,
        role: "user",
      });

      const response = NextResponse.json({
        success: true,
        redirect: "/user",
      });

      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return response;
    } else {
      // 🔍 Check if the email is already registered with a DIFFERENT circuit ID
      const existingEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            error:
              "This email is already registered for a different Circuit ID.",
          },
          { status: 401 }
        );
      }
    }

    // ✅ New user → create with OTP and send email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.create({
      data: {
        email,
        circuit_id: circuitId,
        status: "pending",
        otp,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: "Secure Credential Portal",
      to: email,
      subject: "Your Verification OTP",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
      otpSent: true,
    });
  } catch (error) {
    console.error("User Login Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
