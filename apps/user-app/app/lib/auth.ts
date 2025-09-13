import {prisma} from "@repo/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import * as z from "zod";

// Schema for signup
const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
  });

// Schema for signin
const signInSchema = z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
})

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
        firstname: { label: "First Name", type: "text", required: false },
        lastname: { label: "Last Name", type: "text", required: false },
        isSignUp: { label: "Is Sign Up", type: "text", required: false } // Hidden field to differentiate
      },
      async authorize(credentials: any) {
        try {
          const isSignUp = credentials.isSignUp === "true";
      
          if (isSignUp) {
            // Transform incoming data to match schema
            const signUpData = {
              firstName: credentials.firstname || credentials.firstName,
              lastName: credentials.lastname || credentials.lastName,
              email: credentials.email,
              password: credentials.password
            };
      
            const validatedFields = signUpSchema.safeParse(signUpData);
            
            if (!validatedFields.success) {
              console.log('hii');
              const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(', ');
              throw new Error(errorMessages);
            }
      
            const { firstName, lastName, email, password } = validatedFields.data;
            
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
              where: { email }
            });
      
            if (existingUser) {
              throw new Error("Email already in use");
            }
      
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
              data: {
                firstname: firstName,
                lastname: lastName,
                email,
                password: hashedPassword
              }
            });
            console.log(user);
            // Create balance
            await prisma.balance.create({
              data: {
                userId: user.id,
                amount: 2000,
                locked: 0
              }
            });
      
            return {
              id: user.id.toString(),
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname
            };
          } else {
            const validatedFields = signInSchema.safeParse(credentials);
      
            if (!validatedFields.success) {
              const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(', ');
              throw new Error(errorMessages);
            }
      
            const { email, password } = validatedFields.data;
      
            const user = await prisma.user.findFirst({
              where: { email }
            });
      
            if (!user) {
              throw new Error("User not found");
            }
      
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
              throw new Error("Invalid password");
            }
      
            return {
              id: user.id.toString(),
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email
            };
          }
        } catch (error: any) {
          // Properly catch and rethrow errors so they reach the client
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
    newUser: '/signup'
  }
};