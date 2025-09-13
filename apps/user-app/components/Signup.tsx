"use client"
import { Header } from "@repo/ui/header"
import { SubHeader } from "@repo/ui/subheader"
import Input from "./ui/input"
import { useState } from "react";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from 'zod';
import { signIn } from "next-auth/react";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const loadId = toast.loading('Creating account...');
      
      const res = await signIn('credentials', {
        redirect: false,
        firstname: formData.firstName, // Ensure lowercase to match auth options
        lastname: formData.lastName,   // Ensure lowercase to match auth options
        email: formData.email,
        password: formData.password,
        isSignUp: "true",
      });
  
      toast.dismiss(loadId);
  
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        router.push("/user-app/dashboard");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 px-8 bg-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-xl font-medium text-gray-700">Welcome to</h1>
            <h2 className="text-2xl font-bold tracking-tight">
              Pocket<span className="text-blue-600">Pay</span>
            </h2>
          </div>
          <h2 className="text-2xl font-medium text-gray-700">
            Your Smart, Secure Digital Wallet
          </h2>
        </div>
      </div>

      <div className="flex flex-col justify-center w-1/2 bg-gray-50 p-8">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <Header label="Sign up"/>
            
            {error && (
              <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="First Name"
                type="text"
                placeholder="Leon"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Parkour"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="leon@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between my-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="text-sm text-gray-600">Show password</span>
              </label>
            </div>

            <Button
              type="submit"
              label={loading ? "Signing Up..." : "Sign Up"}
              disabled={loading}
              className="w-full"
            />

            <div className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;