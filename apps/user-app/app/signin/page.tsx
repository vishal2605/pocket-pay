"use client"
import { Button } from "@repo/ui/button";
import { Header } from "@repo/ui/header";
import { SubHeader } from "@repo/ui/subheader";
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Input from "../../components/ui/input";
import { toast } from 'sonner';
import { signIn } from "next-auth/react";



const SignInComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e?: React.FormEvent<HTMLButtonElement>) => {
        const loadId = toast.loading('Signing in...');
        if(e) {
            e.preventDefault();
        }
        if(!email || !password) {
            toast.dismiss(loadId);
            return;
        }

        try {
            setLoading(true);
            const result = await signIn("credentials",{
                redirect:false,
                email,
                password,
                isSignUp : "false"
            })
            if (result?.error) {
                setError(result.error);
              } else {
                toast.success('Successfully signed in!', { id: loadId });
                router.push('/user-app/dashboard');
              }
        } catch (error) {
            toast.error('Invalid email or password. Please try again.', { id: loadId });
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col justify-center items-center w-1/2 px-8">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-medium text-gray-700">
                        Welcome to
                    </h1>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Pocket
                        <span className="text-blue-600 ml-1">Pay</span>
                    </h2>
                </div>
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">
                    Your Smart, Secure Digital Wallet
                    </h2>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-gray-50">
                <div className="p-5 rounded-lg bg-gray-50 mx-4">
                    <div className="p-1">
                        <Header label={"Sign in"}></Header>
                        <SubHeader label={"Please enter your details"}></SubHeader>
                        <Input
                        label="Email"
                        type="text"
                        placeholder="LeonParkour@gmail.com"
                        name="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                          }}>
                        </Input>
                        <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                          }}>
                        </Input>
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <Button
                            label={loading ? "Signing In..." : "Sign In"}
                            onClick={handleLogin}
                        />{" "}
                        <div className="flex flex-row text-center pt-4 font-medium px-9">
                            <div className="text-center ">Create an new account?
                            </div>
                            <Link href='/signup' className="text-center pl-1 underline decoration-2">
                                Sign up
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default SignInComponent;