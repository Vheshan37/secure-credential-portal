"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // find the user with user id
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }

    // generate otp code
    const otpcode = Math.floor(100000 + Math.random() * 900000).toString();

    // update the otp code in the user table
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { otp: otpcode },
    });

    // send email to the user
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
      to: user.email,
      subject: "Your Verification OTP",
      text: `Your OTP is: ${otpcode}`,
      html: `<p>Your OTP is: <b>${otpcode}</b></p>`,
    });

    // send the final response
    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }finally{
    prisma.$disconnect();
  }
}
