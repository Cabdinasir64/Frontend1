"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/users2/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error && data.error.includes("not verified")) {
                    setErrors(["Your account is not verified. Please check your email."]);

                    setTimeout(() => {
                        router.push(`/verification?email=${encodeURIComponent(formData.email)}`);
                    }, 2000);

                    return;
                }

                if (data.error) setErrors([data.error]);
                else if (data.errors) setErrors(data.errors);
            } else {
                setSuccess("Login successful! Redirecting...");
                localStorage.setItem("token", data.token);

                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            }
        } catch (err) {
            setErrors(["Network error. Please try again."]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {["email", "password"].map((field) => (
                    <div key={field} className="mb-4">
                        <label className="block mb-1 font-semibold capitalize">{field}</label>
                        <input
                            type={field === "password" ? "password" : "text"}
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                ))}

                <div className="flex justify-between items-center mb-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <p
                    className="text-sm text-blue-500 text-center cursor-pointer hover:underline mb-4"
                    onClick={() => router.push("/forgot-password")}
                >
                    Forgot Password?
                </p>

                <AnimatePresence>
                    {errors.length > 0 &&
                        errors.map((err, idx) => (
                            <motion.p
                                key={idx}
                                className="text-red-500 mt-2 text-center"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                {err}
                            </motion.p>
                        ))}
                    {success && (
                        <motion.p
                            className="text-green-500 mt-2 text-center"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            {success}
                        </motion.p>
                    )}
                </AnimatePresence>

                <p
                    className="text-sm text-gray-500 text-center mt-6 cursor-pointer hover:underline"
                    onClick={() => router.push("/signup2")}
                >
                    Don't have an account? Sign Up
                </p>
            </form>
        </div>
    );
}
