"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormState {
    name: string;
    email: string;
    password: string;
}

export default function Signup() {
    const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (touched[e.target.name]) validateField(e.target.name, e.target.value);
        setSuccess(null);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched({ ...touched, [e.target.name]: true });
        validateField(e.target.name, e.target.value);
    };

    const validateField = (name: string, value: string) => {
        let error = "";

        if (name === "name") {
            if (!value.trim()) error = "Username is required.";
            else if (value.length < 3) error = "Username must be at least 3 characters.";
            else if (value.length > 30) error = "Username cannot be longer than 30 characters.";
            else if (/[\d\s#_]/.test(value.charAt(0))) error = "Username cannot start with number, space, '#' or '_'.";
            else if (!/^[a-zA-Z0-9_-]+$/.test(value)) error = "Username can only contain letters, numbers, '-' and '_'.";
        }

        if (name === "email") {
            if (!value.trim()) error = "Email is required.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email is not valid.";
        }

        if (name === "password") {
            if (!value) error = "Password is required.";
            else if (value.length < 8) error = "Password must be at least 8 characters.";
            else if (!/[A-Z]/.test(value)) error = "Password must contain at least one uppercase letter.";
            else if (!/[a-z]/.test(value)) error = "Password must contain at least one lowercase letter.";
            else if (!/[0-9]/.test(value)) error = "Password must contain at least one number.";
            else if (!/[^A-Za-z0-9]/.test(value)) error = "Password must contain at least one symbol.";
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);

        setTouched({ name: true, email: true, password: true });

        Object.entries(form).forEach(([key, value]) => validateField(key, value));

        if (Object.values(errors).some((e) => e)) return;

        try {
            const res = await fetch("http://localhost:8000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                const backendErrors: { [key: string]: string } = {};
                if (data.errors) {
                    data.errors.forEach((err: string) => {
                        if (err.toLowerCase().includes("email")) backendErrors.email = err;
                        else if (err.toLowerCase().includes("password")) backendErrors.password = err;
                        else if (err.toLowerCase().includes("name") || err.toLowerCase().includes("username"))
                            backendErrors.name = err;
                        else backendErrors.form = err;
                    });
                }
                setErrors((prev) => ({ ...prev, ...backendErrors }));
                setTimeout(() => setErrors({}), 3000); 
            } else {
                setSuccess("Signup successful!");
                setForm({ name: "", email: "", password: "" });
                setErrors({});
                setTouched({});
                setTimeout(() => setSuccess(null), 3000); 
            }
        } catch {
            setErrors({ form: "Network error. Try again." });
            setTimeout(() => setErrors({}), 3000);
        }
    };

    const inputClass = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Sign Up</h2>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Username</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClass + (errors.name ? " border-red-500" : "")}
                    />
                    <AnimatePresence>
                        {touched.name && errors.name && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-600 text-sm mt-1"
                            >
                                {errors.name}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClass + (errors.email ? " border-red-500" : "")}
                    />
                    <AnimatePresence>
                        {touched.email && errors.email && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-600 text-sm mt-1"
                            >
                                {errors.email}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClass + (errors.password ? " border-red-500" : "")}
                    />
                    <AnimatePresence>
                        {touched.password && errors.password && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-600 text-sm mt-1"
                            >
                                {errors.password}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
                >
                    Sign Up
                </button>

                <AnimatePresence>
                    {errors.form && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 bg-red-100 text-red-700 p-3 rounded-md"
                        >
                            {errors.form}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 bg-green-100 text-green-700 p-3 rounded-md"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
