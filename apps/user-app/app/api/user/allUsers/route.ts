import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const users = await prisma.user.findMany();

        if (!users || users.length === 0) { 
            return NextResponse.json(
                { message: "No users found" },
                { status: 404 }
            );
        }

        const userResponse = users.map(user => ({
            user_id : user.id,
            firstname : user.firstname,
            lastname : user.lastname
        }))
        return NextResponse.json(
            { userResponse },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};