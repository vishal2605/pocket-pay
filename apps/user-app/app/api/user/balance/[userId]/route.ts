import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@repo/db";

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = Number(params.userId);

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const balance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!balance) {
      return NextResponse.json(
        { error: "Balance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ amount: balance.amount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
