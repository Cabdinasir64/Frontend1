"use client";

import { motion } from "framer-motion";

interface ProfileTabProps {
  user: { username: string; email: string; role: string } | null;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      {user ? (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </motion.div>
  );
}
