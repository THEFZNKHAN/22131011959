import { useState } from "react";
import { createShortUrl, ShortUrlResponse } from "../services/api";
import { log } from "../utils/logger";
import { Box, TextField, Button, IconButton, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

interface UrlInput {
    url: string;
    validity: number;
    shortcode: string;
}

export function ShortenUrl({
    addShortcode,
}: {
    addShortcode: (shortcode: string) => void;
}) {
    const [urls, setUrls] = useState<UrlInput[]>([
        { url: "", validity: 30, shortcode: "" },
    ]);
    const [results, setResults] = useState<(ShortUrlResponse | null)[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const addUrlInput = () => {
        if (urls.length < 5) {
            setUrls([...urls, { url: "", validity: 30, shortcode: "" }]);
            setErrors([...errors, ""]);
        }
    };

    const removeUrlInput = (index: number) => {
        setUrls(urls.filter((_, i) => i !== index));
        setErrors(errors.filter((_, i) => i !== index));
        setResults(results.filter((_, i) => i !== index));
    };

    const handleChange = (
        index: number,
        field: keyof UrlInput,
        value: string | number
    ) => {
        const newUrls = [...urls];
        newUrls[index][field] = value as never;
        setUrls(newUrls);
    };

    const handleShorten = async () => {
        const newResults: (ShortUrlResponse | null)[] = [];
        const newErrors: string[] = [];
        const promises = urls.map(async (urlInput, index) => {
            try {
                const data = await createShortUrl(
                    urlInput.url,
                    urlInput.validity,
                    urlInput.shortcode || undefined
                );
                newResults[index] = data;
                newErrors[index] = "";
                const shortcode = data.shortLink.split("/").pop() || "";
                addShortcode(shortcode);
                log(
                    "frontend",
                    "info",
                    "ShortenUrl",
                    `Shortened URL to ${data.shortLink}`
                );
            } catch (err) {
                newResults[index] = null;
                newErrors[index] =
                    err instanceof Error ? err.message : "Unexpected error";
                log(
                    "frontend",
                    "error",
                    "ShortenUrl",
                    `Failed to shorten URL: ${newErrors[index]}`
                );
            }
        });
        await Promise.all(promises);
        setResults(newResults);
        setErrors(newErrors);
    };

    return (
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                    Create Short Links
                </Typography>
            </Box>
            {urls.map((urlInput, index) => (
                <Box
                    key={index}
                    sx={{
                        mb: 2,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <TextField
                        label="URL"
                        value={urlInput.url}
                        onChange={(e) =>
                            handleChange(index, "url", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Validity (min)"
                        type="number"
                        value={urlInput.validity}
                        onChange={(e) =>
                            handleChange(
                                index,
                                "validity",
                                Number(e.target.value) || 30
                            )
                        }
                        variant="outlined"
                        sx={{ width: "150px" }}
                    />
                    <TextField
                        label="Custom Shortcode (optional)"
                        value={urlInput.shortcode}
                        onChange={(e) =>
                            handleChange(index, "shortcode", e.target.value)
                        }
                        variant-controls="outlined"
                        sx={{ width: "200px" }}
                    />
                    {urls.length > 1 && (
                        <IconButton
                            onClick={() => removeUrlInput(index)}
                            color="error"
                        >
                            <Remove />
                        </IconButton>
                    )}
                    {results[index] && (
                        <Box>
                            <Typography>
                                Short Link:{" "}
                                <a
                                    href={results[index]?.shortLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {results[index]?.shortLink}
                                </a>
                            </Typography>
                            <Typography variant="body2">
                                Expires:{" "}
                                {new Date(
                                    results[index]?.expiry || ""
                                ).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                    {errors[index] && (
                        <Typography color="error">{errors[index]}</Typography>
                    )}
                </Box>
            ))}
            {urls.length < 5 && (
                <Button
                    startIcon={<Add />}
                    onClick={addUrlInput}
                    sx={{ mb: 2 }}
                >
                    Add Another URL
                </Button>
            )}
            <Button variant="contained" onClick={handleShorten} fullWidth>
                Shorten Now
            </Button>
        </Box>
    );
}
