"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { id, name, designation, contact, company, service, description } =
      await req.json();

    if (
      !id ||
      !name ||
      !designation ||
      !contact ||
      !company ||
      !service ||
      !description
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pendingStatus = await prisma.status.findFirst({
      where: {
        status: "pending",
      },
      select: {
        id: true,
      },
    });

    if (!pendingStatus) {
      return NextResponse.json(
        { error: "Pending status not configured in system" },
        { status: 500 }
      );
    }

    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

    await prisma.request.create({
      data: {
        name,
        designation,
        contact_no: contact,
        company,
        service,
        description,
        date_time: localTime,
        status_id: pendingStatus.id,
        user_id: parseInt(id),
      },
      include: {
        user: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
