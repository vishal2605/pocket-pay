import bcrypt from "bcryptjs";
import  {prisma}  from "@repo/db"; 
import { NextResponse } from "next/server";
import { error } from "console";


export const POST = async (req: Request) => {
    try {
      const { email, password } = await req.json();
  
      // Input validation
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }
      console.log(email , password);
      // Find user (case-insensitive email search)
      const user = await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase()
        }
      });
      console.log(user);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" }, // Generic message for security
          { status: 401 }
        );
      }
  
      // Compare passwords (timing-safe)
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid credentials" }, // Same message as user not found
          { status: 401 }
        );
      }
  
      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user;
  
      return NextResponse.json({ 
        user: userWithoutPassword 
      });
  
    } catch (error) {
      console.error("Login error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }