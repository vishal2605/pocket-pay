import {prisma} from "@repo/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export const POST = async (req: Request) => {
    try{
    const { firstName, lastName, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(firstName, lastName, email, password);
    const existingUser = await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase()
        }
      });
    if(existingUser){
        return NextResponse.json({
            error : "Email already exists"
        },
        {status: 400});
    }
    const user = await prisma.user.create({
        data: { firstname:firstName, lastname:lastName, email:email.toLowerCase(), password: hashedPassword }
    });
    return NextResponse.json({ user });
    }catch(error){
        console.error("Signup error:", error);
        return NextResponse.json(
            {error : "Internal server error"},
            {status: 500}
        );
    }
}