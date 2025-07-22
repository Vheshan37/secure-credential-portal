// app/api/admin/sendResponse/route.js
import { encryptAES } from "@/lib/crypto";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    let otp = null;

    const body = await req.json();
    const {
      requestId,
      circuitNo,
      username,
      password,
      itManagerEmail,
      itManagerMessage,
      userMessage,
      isRejected,
      status,
    } = body;

    // Validate required fields
    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required." },
        { status: 400 }
      );
    }

    if (!itManagerEmail || !itManagerMessage) {
      return NextResponse.json(
        { error: "IT Manager email and message are required." },
        { status: 400 }
      );
    }

    if (!isRejected && (!username || !password)) {
      return NextResponse.json(
        { error: "Username and password are required for approval." },
        { status: 400 }
      );
    }

    const statusRecord = await prisma.status.findUnique({
      where: { status: status }, // Find by status string ("completed" or "rejected")
    });

    if (!statusRecord) {
      throw new Error(`Status '${status}' not found`);
    }

    const encryptedUsername = username ? encryptAES(username) : null;
    const encryptedPassword = password ? encryptAES(password) : null;

    // Get the request first to include service information
    const existingRequest = await prisma.request.findUnique({
      where: { id: Number(requestId) },
      select: {
        service: true,
        user: true
      }
    });

    if (!existingRequest) {
      throw new Error(`Request with ID ${requestId} not found`);
    }

    const updatedRequest = await prisma.request.update({
      where: { id: Number(requestId) },
      data: {
        status: {
          connect: { id: statusRecord.id },
        },
      },
      include: {
        user: true,
        status: true,
      },
    });

    const response = await prisma.response.create({
      data: {
        used_time: new Date(),
        exp_time: new Date(Date.now() + 6 * 60 * 60 * 1000),
        username: encryptedUsername,
        password: encryptedPassword,
        request: {
          connect: { id: Number(requestId) },
        },
        status: {
          connect: { id: statusRecord.id },
        },
      },
    });

    // If approved, create OTP (optional)
    if (!isRejected) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.response_otp.create({
        data: {
          otp,
          response: {
            connect: { id: response.id },
          },
        },
      });
    }

    // Send emails
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to IT Manager
    await transporter.sendMail({
      from: "Secure Credential Portal <noreply@yourdomain.com>",
      to: itManagerEmail,
      subject: `Request ${
        isRejected ? "Rejected" : "Approved"
      } - Circuit ${circuitNo}`,
      html: `
        <h2>Request ${isRejected ? "Rejection" : "Approval"} Notification</h2>
        <p><strong>Circuit No:</strong> ${circuitNo}</p>
        <p><strong>Service:</strong> ${existingRequest.service}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Message:</strong> ${itManagerMessage}</p>
        ${
          !isRejected
            ? `
          <p><strong>Generated Credentials:</strong></p>
          ${otp ? `<p>OTP: ${otp}</p>` : ""}
        `
            : ""
        }
      `,
    });

    // Email to User
    if (updatedRequest.user.email) {
      await transporter.sendMail({
        from: "Secure Credential Portal <noreply@yourdomain.com>",
        to: updatedRequest.user.email,
        subject: `Your Request ${
          isRejected ? "Has Been Rejected" : "Is Ready"
        }`,
        html: `
          <h2>Request Update</h2>
          <p><strong>Circuit No:</strong> ${circuitNo}</p>
          <p><strong>Status:</strong> ${status}</p>
          ${
            userMessage ? `<p><strong>Message:</strong> ${userMessage}</p>` : ""
          }
          ${
            !isRejected
              ? `
            <p>Your credentials have been generated and sent to the IT manager.</p>
          `
              : `
            <p>Your request has been rejected. Please contact support for more information.</p>
          `
          }
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Request ${isRejected ? "rejected" : "approved"} successfully`,
      requestId: updatedRequest.id,
      status: updatedRequest.status.status,
    });
  } catch (error) {
    console.error("Response Submission Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the response." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
