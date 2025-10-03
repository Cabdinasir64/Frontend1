"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Verification() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            const newCode = [...code];
            newCode[idx] = val;
            setCode(newCode);
        }
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
                <p className="mb-6">Enter the 6-digit code sent to {email}</p>
                <div className="flex justify-between mb-4">
                    {code.map((c, i) => (
                        <input
                            key={i}
                            value={c}
                            onChange={(e) => handleChange(e, i)}
                            maxLength={1}
                            className="w-10 h-12 text-center border border-gray-300 rounded text-xl"
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    Verify
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
