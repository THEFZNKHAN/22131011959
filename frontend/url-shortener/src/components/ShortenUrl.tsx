import { useState } from "react";
import { createShortUrl, ShortUrlResponse } from "../services/api";
import { Link2 } from "lucide-react";
import { motion } from "framer-motion";

export function ShortenUrl() {
    const [url, setUrl] = useState("");
    const [validity, setValidity] = useState(30);
    const [shortcode, setShortcode] = useState("");
    const [result, setResult] = useState<ShortUrlResponse | null>(null);
    const [error, setError] = useState("");

    const handleShorten = async () => {
        try {
            const data = await createShortUrl(
                url,
                validity,
                shortcode || undefined
            );
            setResult(data);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error");
            setResult(null);
        }
    };

    return (
        <motion.section
            className="bg-white p-8 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center mb-6">
                <Link2 className="text-blue-600 mr-2" size={24} />
                <h2 className="text-2xl font-bold text-blue-800">
                    Create a Short Link
                </h2>
            </div>

            <div className="space-y-4">
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your URL here"
                    className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-4">
                    <input
                        type="number"
                        value={validity}
                        onChange={(e) =>
                            setValidity(Number(e.target.value) || 30)
                        }
                        placeholder="Valid (min)"
                        className="w-1/3 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        value={shortcode}
                        onChange={(e) => setShortcode(e.target.value)}
                        placeholder="Custom code"
                        className="flex-1 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleShorten}
                    className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 visible"
                >
                    Shorten Now
                </button>
            </div>

            {result && (
                <motion.div
                    className="mt-6 p-4 bg-blue-100 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-sm text-blue-800">
                        Your link:
                        <a
                            href={result.shortLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                        >
                            {result.shortLink}
                        </a>
                    </p>
                    <p className="text-xs text-blue-500">
                        Expires at: {new Date(result.expiry).toLocaleString()}
                    </p>
                </motion.div>
            )}

            {error && <p className="mt-4 text-red-500">{error}</p>}
        </motion.section>
    );
}
