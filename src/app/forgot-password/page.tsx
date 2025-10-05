"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!email) {
            setError("Email is required");
            setIsValidEmail(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            setIsValidEmail(false);
        } else {
            setError("");
            setIsValidEmail(true);
        }
    }, [email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail) return; 
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/users2/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                router.push(`/verify-code?email=${email}`);
            }
        } catch (err) {
            setError("Network error, please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
            >
                <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email address</label>
                        <input
                            type="email"
                            className={`w-full p-2 border rounded-md focus:ring-2 outline-none transition ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
                                }`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isValidEmail}
                        className={`w-full py-2 rounded-md text-white transition ${loading || !isValidEmail
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Sending..." : "Send Verification Code"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
