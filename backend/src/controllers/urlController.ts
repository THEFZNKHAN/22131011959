import { Request, Response } from "express";
import { urlStore, UrlEntry } from "../models/urlModel";
import { logger } from "../utils/logger";
import { Click } from "../models/urlModel";

const generateShortcode = (): string => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    if (urlStore.has(result)) {
        return generateShortcode();
    }
    return result;
};

const isValidShortcode = (shortcode: string): boolean => {
    return /^[a-zA-Z0-9]{3,10}$/.test(shortcode);
};

export const createShortUrl = async (req: Request, res: Response) => {
    const { url, validity, shortcode } = req.body;
    if (!url || typeof url !== "string") {
        logger({
            stack: "backend",
            level: "error",
            package: "controller",
            message: "Invalid URL",
        });
        return res.status(400).json({ error: "Invalid URL" });
    }
    let finalShortcode = shortcode;
    if (finalShortcode) {
        if (!isValidShortcode(finalShortcode)) {
            logger({
                stack: "backend",
                level: "error",
                package: "controller",
                message: "Invalid shortcode",
            });
            return res.status(400).json({ error: "Invalid shortcode" });
        }
        if (urlStore.has(finalShortcode)) {
            logger({
                stack: "backend",
                level: "error",
                package: "controller",
                message: "Shortcode already in use",
            });
            return res.status(409).json({ error: "Shortcode already in use" });
        }
    } else {
        finalShortcode = generateShortcode();
    }
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(
        Date.now() + (validity || 30) * 60 * 1000
    ).toISOString();
    const entry: UrlEntry = {
        originalUrl: url,
        shortcode: finalShortcode,
        createdAt,
        expiresAt,
        clicks: [],
    };
    urlStore.set(finalShortcode, entry);
    logger({
        stack: "backend",
        level: "info",
        package: "controller",
        message: `Created short URL: ${finalShortcode}`,
    });
    res.status(201).json({
        shortLink: `http://localhost:5000/${finalShortcode}`,
        expiry: expiresAt,
    });
};

export const getUrlStats = async (req: Request, res: Response) => {
    const { shortcode } = req.params;
    const entry = urlStore.get(shortcode);
    if (!entry) {
        logger({
            stack: "backend",
            level: "error",
            package: "controller",
            message: `Shortcode not found: ${shortcode}`,
        });
        return res.status(404).json({ error: "Shortcode not found" });
    }
    const stats = {
        shortcode: entry.shortcode,
        originalUrl: entry.originalUrl,
        createdAt: entry.createdAt,
        expiresAt: entry.expiresAt,
        totalClicks: entry.clicks.length,
        clicks: entry.clicks,
    };
    res.status(200).json(stats);
};

export const redirectToUrl = async (req: Request, res: Response) => {
    const { shortcode } = req.params;
    const entry = urlStore.get(shortcode);
    if (!entry) {
        logger({
            stack: "backend",
            level: "error",
            package: "controller",
            message: `Shortcode not found: ${shortcode}`,
        });
        return res.status(404).json({ error: "Shortcode not found" });
    }
    if (new Date() > new Date(entry.expiresAt)) {
        logger({
            stack: "backend",
            level: "error",
            package: "controller",
            message: `Shortcode expired: ${shortcode}`,
        });
        return res.status(410).json({ error: "Shortcode expired" });
    }
    const click: Click = {
        timestamp: new Date().toISOString(),
        referrer: req.headers.referer || "Direct",
        location: "Unknown",
    };
    entry.clicks.push(click);
    logger({
        stack: "backend",
        level: "info",
        package: "controller",
        message: `Redirecting for shortcode: ${shortcode}`,
    });
    res.redirect(301, entry.originalUrl);
};
