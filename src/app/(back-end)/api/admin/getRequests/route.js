import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // 1. Authenticate admin via token in cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 2. Fetch all requests with status 'pending'
    const requests = await prisma.request.findMany({
      where: {
        status: {
          status: "pending", // Filter through the relation
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            circuit_id: true,
          },
        },
        status: true,
      },
      orderBy: {
        date_time: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      requests: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
