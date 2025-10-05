"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const clearAfter3s = (setter: (v: string) => void) => {
        setTimeout(() => setter(""), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            clearAfter3s(setError);
            setLoading(false);
            return;
        }

        const payload = { email: email.trim(), password };

        try {
            const res = await fetch("http://localhost:8000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data?.error || data?.message || "Login failed";
                setError(msg);
                clearAfter3s(setError);
            } else {
                setSuccess("Login successful!");
                clearAfter3s(setSuccess);
            }
        } catch (err: any) {
            setError(err?.message || "Network error");
            clearAfter3s(setError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
            >
                <h1 className="text-2xl font-semibold mb-2 text-center">Sign In</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            autoComplete="current-password"
                            
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-4">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25 }}
                                className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-center text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25 }}
                                className="rounded-md bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-center text-sm mt-2"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
