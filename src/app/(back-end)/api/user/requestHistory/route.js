import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        error: "User id required",
        status: 400,
      });
    }

    // find the user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        request: {
          include: { status: true },
          orderBy: { date_time: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      reqests: user.request,
    });
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
