import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
export const POST = async (request: Request, { params }: { params: { userId: string } }) => {
    try {
      const senderId = parseInt(params.userId);
      const { to, amount } = await request.json(); 
  
      if (!senderId || !to || !amount || amount <= 0) {
        return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
      }
  
      const sender = await prisma.user.findUnique({
        where: { id: senderId },
        include: { Balance: true },
      });
  
      if (!sender || !sender.Balance.length) {
        return NextResponse.json({ message: "Sender not found or no balance record" }, { status: 404 });
      }
  
      const senderBalance = sender.Balance[0];
  
      if (senderBalance.amount < amount) {
        return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
      }
  
      const recipient = await prisma.user.findUnique({
        where: { id: to },
        include: { Balance: true },
      });
  
      if (!recipient || !recipient.Balance.length) {
        return NextResponse.json({ message: "Recipient not found or no balance record" }, { status: 404 });
      }
  
      // Create a single transaction record with both parties' information
      await prisma.$transaction([
        prisma.walletTransaction.create({
          data: {
            type: "TRANSFER",
            amount,
            fromUserId: senderId,
            toUserId: to,
            status: "SUCCESS",
            notes: "User-to-user transfer",
          },
        }),
        prisma.balance.update({
          where: { userId: senderId },
          data: {
            amount: {
              decrement: amount,
            },
          },
        }),
        prisma.balance.update({
          where: { userId: to },
          data: {
            amount: {
              increment: amount,
            },
          },
        }),
      ]);
  
      return NextResponse.json({ message: "Transfer completed successfully" }, { status: 200 });
    } catch (error) {
      console.error("[TRANSFER_ERROR]", error);
      return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
  };