export interface ShortUrlResponse {
    shortLink: string;
    expiry: string;
}

export interface ClickDetail {
    timestamp: string;
    referrer: string;
    location: string;
}

export interface StatsResponse {
    shortcode: string;
    originalUrl: string;
    createdAt: string;
    expiresAt: string;
    totalClicks: number;
    clicks: ClickDetail[];
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function createShortUrl(
    url: string,
    validity: number,
    shortcode?: string
): Promise<ShortUrlResponse> {
    const res = await fetch(`${API_BASE}/shorturls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, validity, shortcode }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to shorten URL");
    }
    return res.json();
}

export async function getUrlStats(shortcode: string): Promise<StatsResponse> {
    const res = await fetch(`${API_BASE}/shorturls/${shortcode}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch stats");
    }
    return res.json();
}
