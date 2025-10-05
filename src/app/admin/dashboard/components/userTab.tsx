"use client";

import { motion } from "framer-motion";

export default function UsersTab() {
    return (
        <motion.div
            key="users"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-lg font-semibold mb-4">Users List</h2>
            <p>Halkan waxaad ka arki kartaa users-ka system-ka.</p>
        </motion.div>
    );
}
