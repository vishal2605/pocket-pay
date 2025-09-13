import {prisma} from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from 'zod'; // For input validation

// Define input schema for validation
const transactionSchema = z.object({
  amount: z.number().positive(),
  bankName: z.string().min(1),
});

export const POST = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const { userId } = params;
    const input = await req.json();
    const validation = transactionSchema.safeParse(input);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { amount, bankName } = validation.data;

    if (isNaN(Number(userId))) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await prisma.$transaction(async (prisma) => {
      return await prisma.onRampTransaction.create({
        data: {
          userId: Number(userId),
          amount,
          provider: bankName,
          status: "Processing",
          token: uuidv4(), 
          startTime: new Date(),
        },
      });
    });

    return NextResponse.json({ 
      message: "Transaction initiated successfully",
      data: transaction 
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error("Error in transaction processing:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}