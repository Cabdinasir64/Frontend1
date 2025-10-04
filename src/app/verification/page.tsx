"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Verification() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState("");
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [resendLoading, setResendLoading] = useState(false);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newCode = [...code];
            newCode[idx] = val;
            setCode(newCode);

            if (val && idx < code.length - 1) {
                inputsRef.current[idx + 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData("Text").slice(0, 6);
        if (/^\d{1,6}$/.test(pasteData)) {
            const newCode = pasteData.split("");
            while (newCode.length < 6) newCode.push("");
            setCode(newCode);
            inputsRef.current[Math.min(5, newCode.length - 1)]?.focus();
        }
        e.preventDefault();
    };

    const handleSubmit = async () => {
        setErrors([]);
        setSuccess("");

        const verificationCode = code.join("");
        if (!email || verificationCode.length < 6) {
            setErrors(["Email and verification code are required"]);
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/users2/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });
            const result = await res.json();
            if (result.error) {
                setErrors([result.error]);
            } else if (result.message) {
                setSuccess(result.message);
                setTimeout(() => router.push("/login"), 3000);
            }
        } catch (err) {
            setErrors(["Network error"]);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setErrors([]);
        setSuccess("");

        try {
            const res = await fetch("http://localhost:8000/api/users2/resend-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const result = await res.json();
            if (result.error) {
                setErrors([result.error]);
            } else if (result.message) {
                setSuccess(result.message);
                setTimeLeft(5 * 60);
                setCode(["", "", "", "", "", ""]);
            }
        } catch (err) {
            setErrors(["Network error"]);
        } finally {
            setResendLoading(false);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Verify Email</h2>
                <p className="mb-4">Enter the 6-digit code sent to <b>{email}</b></p>

                <div className="flex justify-between mb-2">
                    {code.map((c, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputsRef.current[i] = el; }}
                            value={c}
                            onChange={(e) => handleChange(e, i)}
                            onPaste={handlePaste}
                            maxLength={1}
                            className="w-12 h-12 text-center border border-gray-300 rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                        />
                    ))}

                </div>

                <p className="text-gray-500 mb-4">
                    {timeLeft > 0
                        ? `Code expires in ${minutes}:${seconds.toString().padStart(2, "0")}`
                        : "Code expired"}
                </p>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition mb-2"
                    disabled={timeLeft === 0}
                >
                    Verify
                </button>

                <button
                    onClick={handleResend}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    disabled={resendLoading}
                >
                    {resendLoading ? "Sending..." : "Resend Code"}
                </button>

                <AnimatePresence>
                    {errors.length > 0 &&
                        errors.map((err, idx) => (
                            <motion.p
                                key={idx}
                                className="text-red-500 mt-2"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                {err}
                            </motion.p>
                        ))}
                </AnimatePresence>

                <AnimatePresence>
                    {success && (
                        <motion.p
                            className="text-green-500 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {success}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
