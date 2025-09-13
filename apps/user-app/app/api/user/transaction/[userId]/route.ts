import {prisma} from "@repo/db"
import { NextResponse,NextRequest } from "next/server"
import { uuidv4 } from "zod/v4"
import {z} from 'zod'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: 'Invalid user ID' }), { status: 400 });
    }

    const onRampTransactions = await prisma.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
    });

    // Get all transfers where the user is either sender or recipient
    const walletTransactions = await prisma.walletTransaction.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId },
        ],
      },
      orderBy: { timestamp: 'desc' },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    // Transform the transactions to show from the user's perspective
    const formattedTransactions = walletTransactions.map(txn => {
      const isSender = txn.fromUserId === userId;
      return {
        id: txn.id,
        type: isSender ? 'SENT' : 'RECEIVED',
        amount: txn.amount,
        counterparty: isSender ? txn.toUser : txn.fromUser,
        status: txn.status,
        timestamp: txn.timestamp,
        notes: txn.notes
      };
    });

    return new Response(
      JSON.stringify({ 
        onRampTransactions, 
        walletTransactions: formattedTransactions 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

const transactionSchema = z.object({
    bank: z.string().min(1, "Bank name is required"),
    amount: z.number().positive("Amount must be positive")
  });
  
  export const POST = async (request: Request, { params }: { params: { userId: number } }) => {
    try {
      const { userId } = params;
  
      // Validate request body
      const transactionBody = await request.json();
      const validatedBody = transactionSchema.parse(transactionBody);
  
      // Check for pending transactions
      const pendingTransaction = await prisma.onRampTransaction.findFirst({
        where: {
          userId,
          status: 'Processing'
        },
        select: { id: true } // Only select what we need
      });
  
      if (pendingTransaction) {
        return Response.json(
          { message: "Please complete your previous transaction before initiating a new one" },
          { status: 409 }
        );
      }
  
      // Generate and validate token
      const token = crypto.randomUUID(); // Built-in browser/node crypto API
  
      // Check for token collision (extremely unlikely with UUIDv4)
      const transactionCheck = await prisma.onRampTransaction.findUnique({
        where: { token },
        select: { id: true }
      });
  
      if (transactionCheck) {
        return Response.json(
          { message: "Transaction conflict detected. Please try again" },
          { status: 409 }
        );
      }
  
      // Create transaction
      const transaction = await prisma.onRampTransaction.create({
        data: {
          status: 'Processing',
          provider: validatedBody.bank,
          startTime: new Date(),
          userId,
          token,
          amount: validatedBody.amount
        },
        select: {
          token: true,
          amount: true,
          provider: true
        }
      });
  
      return Response.json({
        message: "Transaction initiated successfully",
        data: transaction
      }, { status: 201 });
  
    } catch (error) {
      console.error("Transaction error:", error);
      
      if (error instanceof z.ZodError) {
        return Response.json(
          { message: "Validation failed", errors: error.errors },
          { status: 400 }
        );
      }
  
      return Response.json(
        { message: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };