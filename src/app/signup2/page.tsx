"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup2() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [success, setSuccess] = useState("");

    const validateField = async (name: string, value: string) => {
        let error = "";

        if (name === "username") {
            if (!value.trim() || value.trim().length < 3 || value.trim().length > 20)
                error = "Username must be between 3 and 20 characters.";
            else if (/^[0-9]/.test(value))
                error = "Username cannot start with a number.";
            else if (/^[^a-zA-Z]/.test(value))
                error = "Username cannot start with special characters.";
            else if (!/^[a-zA-Z0-9_]+$/.test(value))
                error = "Username can only contain letters, numbers, and underscores.";
        }

        if (name === "email") {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(value)) error = "Invalid email format.";
        }

        if (name === "password") {
            if (!value || value.length < 8)
                error = "Password must be at least 8 characters.";
            else if (!/[A-Z]/.test(value))
                error = "Password must contain at least one uppercase letter.";
            else if (!/[a-z]/.test(value))
                error = "Password must contain at least one lowercase letter.";
            else if (!/[0-9]/.test(value))
                error = "Password must contain at least one digit.";
            else if (!/[!@#$%^&*]/.test(value))
                error = "Password must contain at least one special character (!@#$%^&*).";
        }

        return error;
    };

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const newErrors: { [key: string]: string } = {};
            for (const key in formData) {
                if (touched[key]) {
                    const error = await validateField(key, (formData as any)[key]);
                    if (error) newErrors[key] = error;
                }
            }
            setErrors(newErrors);
        }, 80);
        return () => clearTimeout(timeout);
    }, [formData, touched]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");

        try {
            const res = await fetch("http://localhost:8000/api/users2/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.errors?.length) {
                const fieldErrors: { [key: string]: string } = {};
                result.errors.forEach((err: string) => {
                    if (err.toLowerCase().includes("username"))
                        fieldErrors.username = err;
                    else if (err.toLowerCase().includes("email"))
                        fieldErrors.email = err;
                    else if (err.toLowerCase().includes("password"))
                        fieldErrors.password = err;
                });
                setErrors(fieldErrors);

                setTimeout(() => setErrors({}), 3000);
            } else if (result.message) {
                setSuccess(result.message);
                setTimeout(() => {
                    setSuccess("");
                    router.push(`/verification?email=${encodeURIComponent(formData.email)}`);
                }, 3000);
            }
        } catch (err) {
            setErrors({ general: "Network error, please try again later." });
            setTimeout(() => setErrors({}), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {["username", "email", "password"].map((field) => (
                    <div key={field} className="mb-4">
                        <label className="block mb-1 font-semibold capitalize">
                            {field}
                        </label>
                        <input
                            type={field === "password" ? "password" : "text"}
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleChange}
                            className={`w-full border ${errors[field] ? "border-red-500" : "border-gray-300"
                                } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        />
                        <AnimatePresence>
                            {errors[field] && (
                                <motion.p
                                    className="text-red-500 text-sm mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                >
                                    {errors[field]}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Sign Up
                </button>

                <AnimatePresence>
                    {success && (
                        <motion.p
                            className="text-green-500 mt-4 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {success}
                        </motion.p>
                    )}
                    {errors.general && (
                        <motion.p
                            className="text-red-500 mt-4 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {errors.general}
                        </motion.p>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
