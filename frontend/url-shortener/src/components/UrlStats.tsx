import { useState } from "react";
import { getUrlStats, StatsResponse } from "../services/api";
import { log } from "../utils/logger";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

export function UrlStats({ shortcodes }: { shortcodes: string[] }) {
    const [selectedShortcode, setSelectedShortcode] = useState("");
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [error, setError] = useState("");

    const handleFetch = async (shortcode: string) => {
        setSelectedShortcode(shortcode);
        try {
            const data = await getUrlStats(shortcode);
            setStats(data);
            setError("");
            log(
                "frontend",
                "info",
                "UrlStats",
                `Fetched stats for ${shortcode}`
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error");
            setStats(null);
            log(
                "frontend",
                "error",
                "UrlStats",
                `Failed to fetch stats: ${
                    err instanceof Error ? err.message : String(err)
                }`
            );
            log(
                "frontend",
                "error",
                "UrlStats",
                `Failed to fetch stats: ${
                    err instanceof Error ? err.message : err
                }`
            );
        }
    };

    return (
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                    Link Analytics
                </Typography>
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Shortcode</InputLabel>
                <Select
                    value={selectedShortcode}
                    onChange={(e) => handleFetch(e.target.value as string)}
                    label="Select Shortcode"
                >
                    {shortcodes.length === 0 && (
                        <MenuItem disabled>No shortcodes available</MenuItem>
                    )}
                    {shortcodes.map((sc) => (
                        <MenuItem key={sc} value={sc}>
                            {sc}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {stats && (
                <Box sx={{ mt: 2 }}>
                    <Typography>
                        <strong>Original URL:</strong>{" "}
                        <a
                            href={stats.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {stats.originalUrl}
                        </a>
                    </Typography>
                    <Typography>
                        <strong>Created:</strong>{" "}
                        {new Date(stats.createdAt).toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>Expires:</strong>{" "}
                        {new Date(stats.expiresAt).toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>Clicks:</strong> {stats.totalClicks}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        <strong>Details:</strong>
                    </Typography>
                    <ul>
                        {stats.clicks.map((c, i) => (
                            <li key={i}>
                                {new Date(c.timestamp).toLocaleString()} -{" "}
                                {c.referrer} ({c.location})
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
