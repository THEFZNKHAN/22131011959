interface Click {
    timestamp: string;
    referrer: string;
    location: string;
}

interface UrlEntry {
    originalUrl: string;
    shortcode: string;
    createdAt: string;
    expiresAt: string;
    clicks: Click[];
}

const urlStore: Map<string, UrlEntry> = new Map();

export { urlStore, UrlEntry, Click };
