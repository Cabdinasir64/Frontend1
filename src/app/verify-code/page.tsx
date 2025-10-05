"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyCodePage() {
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join("");

        if (fullCode.length < 6) {
            setMessage("Please enter the full 6-digit code");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:8000/api/users2/verify-code-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: fullCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Invalid code");
            } else {
                setMessage("✅ Code verified successfully!");
                setTimeout(() => {
                    router.push(`/new-password?email=${email}`);
                }, 1200);
            }
        } catch {
            setMessage("Network error");
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
                <h1 className="text-2xl font-semibold text-center mb-6">Verify Your Code</h1>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-between">
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => { inputsRef.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ))}
                    </div>

                    {message && (
                        <p
                            className={`text-sm text-center ${message.includes("✅") ? "text-green-600" : "text-red-500"
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
