"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const checkAuth = useAuthStore((state) => state.checkAuth);

    // UI State
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form Data
    const [email, setEmail] = useState("");

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        setEmail(data.email as string);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            if (!res.ok) {
                setError(resData.error || "Registration failed");
                setIsLoading(false);
                return;
            }

            setSuccessMessage(resData.message);
            setStep(2); // Move to OTP step
         
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const otp = formData.get("otp") as string;

        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const resData = await res.json();

            if (!res.ok) {
                setError(resData.error || "Verification failed");
                setIsLoading(false);
                return;
            }

            // Sync Zustand store with new cookie
            await checkAuth();
            router.push("/profile");
         
        } catch {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-heading font-bold tracking-tight text-gray-900">
                    {step === 1 ? "Create an account" : "Verify your email"}
                </h2>
                {step === 1 && (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                            Sign in here
                        </Link>
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-md rounded-2xl sm:px-10 border border-gray-100">

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {successMessage && step === 2 && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    {step === 1 ? (
                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required className="mt-1" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" name="email" type="email" required className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone number</Label>
                                <Input id="phone" name="phone" type="tel" required className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required className="mt-1" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Create Account"}
                            </Button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyOTP}>
                            <div className="text-center text-sm text-gray-600 mb-6">
                                We&apos;ve sent a 6-digit code to <strong className="text-gray-900">{email}</strong>. Please enter it below.
                            </div>

                            <div>
                                <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="000000"
                                    required
                                    className="text-center text-2xl tracking-widest font-mono py-6"
                                    maxLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-2.5 bg-emerald-600 text-white hover:bg-emerald-700"
                                disabled={isLoading}
                            >
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify Email"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
