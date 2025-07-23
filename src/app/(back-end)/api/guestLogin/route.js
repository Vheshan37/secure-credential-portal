// app/api/guestLogin/route.js
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

    // Validate required fields
    if (!email || !circuitId) {
      return NextResponse.json(
        { error: "Email and Circuit ID are required." },
        { status: 400 }
      );
    }

    // Check if user exists with matching email + circuitId
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        circuit_id: circuitId,
      },
    });

    // Generate new OTP (for both new and pending users)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (user) {
      // Handle existing user
      if (user.status === "active") {
        // Active user - log them in directly
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
          // secure: process.env.NODE_ENV === "production",
          secure: false,
          sameSite: "strict",
          path: "/",
        });

        return response;
      } else if (user.status === "pending") {
        // Pending user - update OTP and resend
        await prisma.user.update({
          where: { id: user.id },
          data: { otp },
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
          message: "New OTP sent to your email.",
          otpSent: true,
        });
      }
    } else {
      // Check if email is registered with different circuit ID
      const existingEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingEmail) {
        return NextResponse.json(
          {
            error: "This email is already registered for a different Circuit ID.",
          },
          { status: 401 }
        );
      }

      // New user - create with OTP
      await prisma.user.create({
        data: {
          email,
          circuit_id: circuitId,
          status: "pending",
          otp,
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
    }
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