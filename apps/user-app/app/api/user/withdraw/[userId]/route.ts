import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@repo/db";
import { Prisma } from "@prisma/client";
export const POST = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = Number(params.userId);
    const { amount, bankAccountNumber, ifscCode } = await request.json();

    // Validate inputs
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }
    if (!bankAccountNumber || !ifscCode) {
      return NextResponse.json({ message: "Bank account details required" }, { status: 400 });
    }

    // Fetch user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Balance: true },
    });

    if (!user || !user.Balance?.length) {
      return NextResponse.json({ message: "User not found or no balance record" }, { status: 404 });
    }

    const userBalance = user.Balance[0];

    if (userBalance.amount < Number(amount)) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
    }

    // Run atomic transaction
    const updatedBalance = await prisma.$transaction(async (tx) => {
      // Create withdrawal transaction log
      await tx.walletTransaction.create({
        data: {
          type: "WITHDRAW",
          amount: new Prisma.Decimal(amount),
          fromUserId: user.id,
          toUserId: user.id,
          status: "SUCCESS",
          notes: `Withdraw to bank: ${bankAccountNumber}, IFSC: ${ifscCode}`,
        },
      });

      // Update balance and return updated record
      return tx.balance.update({
        where: { userId: user.id },
        data: { amount: { decrement: new Prisma.Decimal(amount) } },
      });
    });

    return NextResponse.json(
      {
        message: "Withdrawal successful",
        newBalance: updatedBalance.amount, // ✅ updated balance
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
