import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required." },
        { status: 400 }
      );
    }

    const history = await prisma.request.findMany({
      where: {
        user: {
          email: email,
        },
      },
      include: {
        user: true,
        status: true,
        response: {
          include: {
            status: true,
            response_otp: true,
          },
          orderBy: {
            used_time: "desc",
          },
        },
      },
      orderBy: {
        date_time: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Request History Error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching request history." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}