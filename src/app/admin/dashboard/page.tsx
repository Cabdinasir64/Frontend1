"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import UsersTab from "./components/userTab";
import ProfileTab from "./components/profileTab";

interface User {
    username: string;
    email: string;
    role: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"users" | "profile">("users");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:8000/api/users2/me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user");

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error("Error fetching user data:", err);
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
                <h1 className="text-xl font-bold">
                    Welcome, {user ? user.username : "Loading..."}
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </header>

            <div className="flex justify-center mt-6">
                <button
                    className={`px-4 py-2 mx-2 rounded-t-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded-t-lg ${activeTab === "profile" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
            </div>

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-b-lg mt-0">
                <AnimatePresence mode="wait">
                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "profile" && <ProfileTab user={user} />}
                </AnimatePresence>
            </div>
        </div>
    );
}
