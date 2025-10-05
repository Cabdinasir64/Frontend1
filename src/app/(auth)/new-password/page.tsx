"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function NewPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    useEffect(() => {
        const validationErrors: string[] = [];

        if (!password || password.length < 8) {
            validationErrors.push("Password must be at least 8 characters.");
        }
        if (!/[A-Z]/.test(password)) {
            validationErrors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            validationErrors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            validationErrors.push("Password must contain at least one digit.");
        }
        if (!/[!@#$%^&*]/.test(password)) {
            validationErrors.push("Password must contain at least one special character (!@#$%^&*).");
        }

        if (confirmPassword && password !== confirmPassword) {
            validationErrors.push("Passwords do not match.");
        }

        setErrors(validationErrors);
        setValid(validationErrors.length === 0 && !!password && !!confirmPassword);
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!valid) return;

        setLoading(true);
        setErrors([]);

        try {
            const res = await fetch("http://localhost:8000/api/users2/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors([data.error || "Something went wrong"]);
            } else {
                router.push("/login");
            }
        } catch (err) {
            setErrors(["Network error, please try again"]);
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
                <h1 className="text-2xl font-semibold text-center mb-6">Set New Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            className={`w-full p-2 border rounded-md focus:ring-2 outline-none transition ${errors.length ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
                                }`}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className={`w-full p-2 border rounded-md focus:ring-2 outline-none transition ${errors.length ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
                                }`}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errors.length > 0 && (
                        <ul className="text-red-500 text-sm list-disc ml-5">
                            {errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    )}

                    <button
                        type="submit"
                        disabled={!valid || loading}
                        className={`w-full py-2 rounded-md text-white transition ${!valid || loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Updating..." : "Set Password"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
