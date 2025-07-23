import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { decryptAES } from "@/lib/crypto";

const prisma = new PrismaClient();

// Helper function to set secure cookies
const setSessionCookies = (response, email, credentials) => {
  // Set verification cookie
  response.cookies.set({
    name: "otp_verified",
    value: "true",
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 6 * 60 * 60, // 6 hours
  });

  // Set user-specific cookie (encrypted)
  response.cookies.set({
    name: "user_session",
    value: JSON.stringify({ email, ...credentials }),
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 6 * 60 * 60, // 6 hours
  });

  return response;
};

export async function POST(req) {
  try {
    // 1. Validate authentication token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded?.email) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Validate OTP
    const { otp } = await req.json();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Valid 6-digit OTP is required" },
        { status: 400 }
      );
    }

    // 3. Find and validate OTP record
    const otpRecord = await prisma.response_otp.findFirst({
      where: { otp },
      include: {
        response: {
          include: {
            request: {
              include: { user: true },
            },
            status: true,
          },
        },
      },
    });

    if (
      !otpRecord?.response?.request?.user ||
      otpRecord.response.request.user.email !== decoded.email ||
      otpRecord.response.status.status !== "completed"
    ) {
      return NextResponse.json(
        { error: "Invalid OTP or not authorized" },
        { status: 401 }
      );
    }

    // 4. Verify OTP hasn't expired (assuming exp_time exists)
    if (new Date(otpRecord.response.exp_time) < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 401 }
      );
    }

    // 5. Prepare credentials
    const credentials = {
      username: otpRecord.response.username ? decryptAES(otpRecord.response.username) : null,
      password: otpRecord.response.password ? decryptAES(otpRecord.response.password) : null,
    };

    if (!credentials.username || !credentials.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // 6. Delete used OTP
    await prisma.response_otp.delete({ where: { id: otpRecord.id } });

    // 7. Create success response with cookies
    const response = NextResponse.json({
      success: true,
      username: credentials.username,
      password: credentials.password,
    });

    return setSessionCookies(response, decoded.email, credentials);

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req) {
  try {
    // 1. Validate session cookies
    const verified = req.cookies.get("otp_verified")?.value;
    const session = req.cookies.get("user_session")?.value;
    
    if (!verified || !session) {
      return NextResponse.json(
        { error: "Session not verified" },
        { status: 401 }
      );
    }

    // 2. Validate authentication token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded?.email) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3. Verify session matches authenticated user
    let sessionData;
    try {
      sessionData = JSON.parse(session);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 401 }
      );
    }

    if (sessionData.email !== decoded.email) {
      return NextResponse.json(
        { error: "Session mismatch" },
        { status: 401 }
      );
    }

    // 4. Return cached credentials if available
    if (sessionData.username && sessionData.password) {
      return NextResponse.json({
        success: true,
        username: sessionData.username,
        password: sessionData.password,
      });
    }

    // 5. Fallback to database lookup
    const credentials = await prisma.response.findFirst({
      where: {
        request: {
          user: { email: decoded.email },
        },
        status: { status: "completed" },
      },
      orderBy: { used_time: 'desc' },
      select: {
        username: true,
        password: true,
        exp_time: true,
      },
    });

    if (!credentials || new Date(credentials.exp_time) < new Date()) {
      return NextResponse.json(
        { error: "No valid credentials found" },
        { status: 404 }
      );
    }

    const decrypted = {
      username: credentials.username ? decryptAES(credentials.username) : null,
      password: credentials.password ? decryptAES(credentials.password) : null,
    };

    if (!decrypted.username || !decrypted.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Update session with fresh credentials
    const response = NextResponse.json({
      success: true,
      username: decrypted.username,
      password: decrypted.password,
    });

    return setSessionCookies(response, decoded.email, decrypted);

  } catch (error) {
    console.error("Session Check Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear all session cookies
    response.cookies.delete("otp_verified");
    response.cookies.delete("user_session");
    
    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Failed to clear session" },
      { status: 500 }
    );
  }
}