import { useState } from "react";
import { getUrlStats, StatsResponse } from "../services/api";
import { BarChart2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function UrlStats() {
    const [shortcode, setShortcode] = useState("");
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [error, setError] = useState("");

    const handleFetch = async () => {
        try {
            const data = await getUrlStats(shortcode);
            setStats(data);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error");
            setStats(null);
        }
    };

    return (
        <motion.section
            className="bg-white p-8 rounded-2xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex items-center mb-6">
                <BarChart2 className="text-blue-600 mr-2" size={24} />
                <h2 className="text-2xl font-bold text-blue-800">
                    Link Analytics
                </h2>
            </div>

            <div className="flex mb-4">
                <input
                    value={shortcode}
                    onChange={(e) => setShortcode(e.target.value)}
                    placeholder="Enter shortcode"
                    className="flex-1 px-4 py-3 rounded-l-lg border-r-0 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleFetch}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-r-lg font-medium hover:opacity-90 visible"
                >
                    Fetch
                </button>
            </div>

            <AnimatePresence>
                {stats && (
                    <motion.div
                        key="stats"
                        className="mt-4 space-y-3 text-blue-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <p>
                            <span className="font-semibold">Original URL:</span>{" "}
                            <a
                                href={stats.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-600"
                            >
                                {stats.originalUrl}
                            </a>
                        </p>
                        <p>
                            <span className="font-semibold">Created:</span>{" "}
                            {new Date(stats.createdAt).toLocaleString()}
                        </p>
                        <p>
                            <span className="font-semibold">Expires:</span>{" "}
                            {new Date(stats.expiresAt).toLocaleString()}
                        </p>
                        <p>
                            <span className="font-semibold">Clicks:</span>{" "}
                            {stats.totalClicks}
                        </p>

                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Details</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {stats.clicks.map((c, i) => (
                                    <li key={i} className="text-sm">
                                        {new Date(c.timestamp).toLocaleString()}{" "}
                                        - {c.referrer} ({c.location})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="mt-4 text-red-500">{error}</p>}
        </motion.section>
    );
}
